
-- SQL para criar a tabela de progresso no Supabase
-- Executa isto no SQL Editor do teu Dashboard do Supabase

CREATE TABLE IF NOT EXISTS public.user_elearning (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    course_id TEXT NOT NULL,
    completed_lessons JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, course_id)
);

-- Ativar Row Level Security (RLS)
ALTER TABLE public.user_elearning ENABLE ROW LEVEL SECURITY;

-- Políticas de Acesso
CREATE POLICY "Users can view their own progress" 
    ON public.user_elearning FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" 
    ON public.user_elearning FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
    ON public.user_elearning FOR UPDATE 
    USING (auth.uid() = user_id);
