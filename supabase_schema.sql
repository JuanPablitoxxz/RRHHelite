-- TABLA DE CANDIDATOS
CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    position TEXT NOT NULL,
    stage TEXT DEFAULT 'Postulación' CHECK (stage IN ('Postulación', 'Preselección', 'Entrevista', 'Evaluación', 'Contratado')),
    rating INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLA DE EVALUACIONES
CREATE TABLE evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    interviewer_name TEXT NOT NULL,
    score INTEGER CHECK (score >= 1 AND score <= 5),
    observations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLA DE DOCUMENTOS (REFERENCIA A STORAGE)
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL, -- Ruta en Supabase Storage
    file_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLA DE VACANTES (JOBS)
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    location TEXT NOT NULL,
    type TEXT NOT NULL, -- Full-time, Part-time, Remoto
    status TEXT DEFAULT 'Abierta' CHECK (status IN ('Abierta', 'Cerrada', 'En Pausa')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (ROW LEVEL SECURITY)
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Políticas simples (Lectura y Escritura para usuarios autenticados)
CREATE POLICY "Allow all for authenticated" ON candidates FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated" ON evaluations FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated" ON documents FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated" ON jobs FOR ALL TO authenticated USING (true);
