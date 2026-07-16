
-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Public token check function (called from signup form before submitting)
CREATE OR REPLACE FUNCTION public.check_token(_token TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.banco_de_tokens
    WHERE token = _token AND (used IS NULL OR used = false)
  );
$$;

GRANT EXECUTE ON FUNCTION public.check_token(TEXT) TO anon, authenticated;

-- Trigger on new auth user: validate token, mark used, create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _token TEXT;
  _token_row_id UUID;
BEGIN
  _token := NEW.raw_user_meta_data ->> 'token';

  IF _token IS NULL OR length(_token) = 0 THEN
    RAISE EXCEPTION 'Token de acesso é obrigatório';
  END IF;

  SELECT id INTO _token_row_id
  FROM public.banco_de_tokens
  WHERE token = _token AND (used IS NULL OR used = false)
  LIMIT 1
  FOR UPDATE;

  IF _token_row_id IS NULL THEN
    RAISE EXCEPTION 'Token inválido ou já utilizado';
  END IF;

  UPDATE public.banco_de_tokens
  SET used = true, user_email = NEW.email
  WHERE id = _token_row_id;

  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name'
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
