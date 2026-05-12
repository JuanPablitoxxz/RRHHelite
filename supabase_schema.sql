-- HABILITAR EXTENSIÓN PARA UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- TABLA DE PERFILES Y ROLES
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'interviewer', 'user', 'applicant')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- HABILITAR RLS PARA PERFILES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admins can update profiles" ON profiles;
CREATE POLICY "Admins can update profiles" ON profiles FOR UPDATE TO authenticated USING (true);

-- FUNCION Y TRIGGER PARA CREAR PERFIL AUTOMATICAMENTE AL REGISTRARSE
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'full_name', 'Usuario'), 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- TABLA DE CANDIDATOS
CREATE TABLE IF NOT EXISTS candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    position TEXT NOT NULL,
    stage TEXT DEFAULT 'Postulación' CHECK (stage IN ('Postulación', 'Preselección', 'Entrevista', 'Evaluación', 'Contratado')),
    rating INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLA DE VACANTES (JOBS)
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    location TEXT NOT NULL,
    type TEXT NOT NULL, -- Full-time, Part-time, Remoto
    status TEXT DEFAULT 'Abierta' CHECK (status IN ('Abierta', 'Cerrada', 'En Pausa')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLA DE ENTREVISTAS
CREATE TABLE IF NOT EXISTS interviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    type TEXT DEFAULT 'Video' CHECK (type IN ('Video', 'Presencial')),
    location TEXT, -- Link de video o dirección física
    notes TEXT,
    status TEXT DEFAULT 'Pendiente' CHECK (status IN ('Pendiente', 'Realizada', 'Cancelada')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLA DE EVALUACIONES
CREATE TABLE IF NOT EXISTS evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    interviewer_name TEXT NOT NULL,
    score INTEGER CHECK (score >= 1 AND score <= 5),
    observations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLA DE DOCUMENTOS
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- HABILITAR RLS
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for authenticated' AND tablename = 'candidates') THEN
        CREATE POLICY "Allow all for authenticated" ON candidates FOR ALL TO authenticated USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for authenticated' AND tablename = 'evaluations') THEN
        CREATE POLICY "Allow all for authenticated" ON evaluations FOR ALL TO authenticated USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for authenticated' AND tablename = 'documents') THEN
        CREATE POLICY "Allow all for authenticated" ON documents FOR ALL TO authenticated USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for authenticated' AND tablename = 'jobs') THEN
        CREATE POLICY "Allow all for authenticated" ON jobs FOR ALL TO authenticated USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for authenticated' AND tablename = 'interviews') THEN
        CREATE POLICY "Allow all for authenticated" ON interviews FOR ALL TO authenticated USING (true);
    END IF;
END $$;
