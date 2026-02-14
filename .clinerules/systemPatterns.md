# System Patterns - Mestria Digital

## Arquitetura Geral

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────┐  │
│  │  Auth   │  │Dashboard │  │CourseDet │  │  AdminPanel │  │
│  └────┬────┘  └────┬─────┘  └────┬─────┘  └──────┬──────┘  │
│       │            │             │               │          │
│       └────────────┴─────────────┴───────────────┘          │
│                           │                                  │
│                    ┌──────┴──────┐                          │
│                    │   App.tsx   │                          │
│                    └──────┬──────┘                          │
└───────────────────────────┼─────────────────────────────────┘
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
    ┌────┴────┐      ┌─────┴────┐      ┌────┴────┐
    │Supabase │      │LocalStore│      │ Gemini  │
    │  Auth   │      │ Progress │      │   API   │
    └─────────┘      └──────────┘      └─────────┘
```

## Padrões de Componentes

### Hierarquia de Componentes
```
App
├── Navbar
│   └── Sidebar
├── Auth (Login/Registo)
├── Dashboard
│   └── CourseCard (xN)
├── CourseDetail
│   ├── VideoPlayer
│   ├── LessonList
│   └── CertificateModal
└── AdminPanel
    ├── GitSync
    ├── CourseEditor
    └── AIGenerator
```

## Gestão de Estado

### Estado Global (App.tsx)
```typescript
// Estado principal gerido no App.tsx
const [user, setUser] = useState<User | null>(null);
const [currentView, setCurrentView] = useState<AppView>('login');
const [courses, setCourses] = useState<Course[]>([]);
const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
```

### Sincronização de Dados
1. **LocalStorage**: `mestria_courses_{user_id}`
2. **Supabase Cloud**: Tabela `user_elearning`
3. **Estratégia**: Cloud tem precedência sobre local

## Padrões de Comunicação

### Comunicação com Iframe (Módulos Interativos)
```typescript
// Envio de eventos para o parent
window.parent.postMessage({
  type: 'elearning-navigation',
  course: 'mestria-digital',
  data: { moduleIndex, action, score }
}, '*');

// Escuta de mensagens no componente
window.addEventListener('message', handleMessage);
```

### Eventos Rastreados
- `lessonChange` - Mudança de lição
- `videoPlay` - Início de vídeo
- `videoTime` - Progresso de vídeo
- `questionClick` - Clique em questões

## Padrões de UI

### Design System
- **Cores**: Slate (background), Indigo (primary), Teal (success)
- **Tipografia**: Font system com Tailwind
- **Componentes**: lucide-react icons
- **Animações**: Tailwind animate-in classes

### Padrões de Componentes
- Feedback visual de progresso
- Loading states com Loader2
- Toast notifications implícitas
- Modal para certificados

## Segurança

### Autenticação
- Supabase Auth com sessionStorage
- Row Level Security (RLS) na base de dados
- Tokens persistidos automaticamente

### Validação
- Verificação de sessão em cada requisição
- Sanitização de inputs
- Content Security Policy via Vite
