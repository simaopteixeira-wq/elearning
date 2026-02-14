# Tech Context - Mestria Digital

## Stack Tecnológica

### Frontend
| Tecnologia | Versão | Uso |
|------------|--------|-----|
| React | 19.2.4 | Framework UI |
| TypeScript | 5.8.2 | Tipagem estática |
| Vite | 6.2.0 | Build tool |
| Tailwind CSS | 4.1.18 | Estilização |
| lucide-react | 0.563.0 | Ícones |

### Backend & Serviços
| Serviço | Tecnologia | Uso |
|---------|------------|-----|
| Supabase | @supabase/supabase-js | Auth + Base de dados |
| Gemini | @google/genai | Geração de cursos por IA |

### Testing
| Ferramenta | Versão | Uso |
|------------|--------|-----|
| Vitest | 4.0.18 | Unit tests |
| Playwright | 1.58.1 | E2E tests |
| Testing Library | 16.3.2 | Component tests |

## Configuração de Ambiente

### Variáveis de Ambiente (.env)
```env
VITE_SUPABASE_URL=https://uluxauaztnwiwatsuinx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Variáveis de Ambiente (.env.local)
```env
GEMINI_API_KEY=AIzaSyA13YAyvZ9pzss8MBVakJ_3NzJ572D60qs
```

## Base de Dados Supabase

### Tabela: user_elearning
```sql
CREATE TABLE public.user_elearning (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    course_id TEXT NOT NULL,
    completed_lessons JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, course_id)
);
```

### Políticas RLS
- `Users can view their own progress` - SELECT
- `Users can insert their own progress` - INSERT
- `Users can update their own progress` - UPDATE

## Estrutura de Pastas

```
elearning/
├── .clinerules/          # Documentação do projeto
├── components/           # Componentes React
│   ├── AdminPanel.tsx
│   ├── Auth.tsx
│   ├── CourseDetail.tsx
│   ├── Dashboard.tsx
│   ├── Navbar.tsx
│   └── Sidebar.tsx
├── services/             # Serviços externos
│   ├── gemini.ts
│   └── supabase.ts
├── public/               # Ficheiros estáticos
│   └── courses/          # Módulos interativos
│       └── formar-opencode/
├── e2e/                  # Testes E2E
├── data/                 # Dados (vazio)
└── ui/                   # Componentes UI (vazio)
```

## Scripts NPM

```json
{
  "dev": "vite --open",
  "build": "vite build",
  "preview": "vite preview",
  "test": "vitest",
  "test:e2e": "playwright test"
}
```

## Dependências de Produção

- `@google/genai`: ^1.38.0
- `@supabase/supabase-js`: ^2.95.3
- `lucide-react`: ^0.563.0
- `react`: ^19.2.4
- `react-dom`: ^19.2.4

## Notas Técnicas

1. O Gemini API está configurado para usar o modelo `gemini-3-flash-preview`
2. A autenticação usa sessionStorage (não localStorage) para maior segurança
3. Os módulos interativos são iframes que comunicam via postMessage
4. O progresso é sincronizado entre localStorage e Supabase
