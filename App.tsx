
import React, { useState, useEffect } from 'react';
import { User, Course, AppView } from './types';
import Auth from './components/Auth';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CourseDetail from './components/CourseDetail';
import AdminPanel from './components/AdminPanel';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('login');
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const sendEvent = (eventType: string, data: any) => {
    if (window.parent !== window) {
      window.parent.postMessage({
        type: eventType,
        course: 'mestria-digital',
        data
      }, '*');
    }
  };

  useEffect(() => {
    // Question spots
    document.querySelectorAll('.question-spot').forEach(spot => {
      spot.addEventListener('click', () => sendEvent('questionClick', { id: (spot as HTMLElement).dataset.id }));
    });

    // Video (adapta teu video ref)
    const video = document.querySelector('video');
    if (video) {
      video.addEventListener('play', () => sendEvent('videoPlay', {}));
      video.addEventListener('timeupdate', () => sendEvent('videoTime', { current: video.currentTime }));
    }
  }, []);

  useEffect(() => {
    // Restaurar sessão local
    const savedUser = localStorage.getItem('mestria_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentView('dashboard');
    }
    
    // Carregar cursos do localStorage
    const savedCourses = localStorage.getItem('mestria_courses');
    
    // CURRÍCULO PADRÃO (Sempre inclui os 2 cursos base para novos usuários ou reset)
    const defaultCourses: Course[] = [
      {
        id: 'extrusion-001',
        title: 'Mestria em Extrusão de Alimentos',
        description: 'Curso técnico avançado cobrindo todos os aspetos do processo de extrusão industrial, desde a termodinâmica até à manutenção preventiva.',
        instructor: 'Simão Teixeira',
        category: 'Engenharia',
        thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop',
        progress: 0,
        createdAt: new Date().toISOString(),
        lessons: [
          { 
            id: 'l1', 
            title: 'Introdução ao Processo de Extrusão', 
            content: 'Visão geral histórica e evolução das extrusoras na indústria alimentar.', 
            duration: '15 min', 
            completed: false, 
            type: 'project',
            externalUrl: '/courses/formar-opencode/index.html'
          },
          { id: 'l2', title: 'Componentes da Extrusora', content: 'Análise detalhada do canhão (barrel), matrizes (dies) e sistemas de corte.', duration: '25 min', completed: false, type: 'text' },
          { id: 'l3', title: 'Termodinâmica e Transferência de Calor', content: 'Cálculo de perfis de temperatura. Zonas de aquecimento e arrefecimento.', duration: '30 min', completed: false, type: 'text' },
          { id: 'l4', title: 'Reologia de Massas Alimentares', content: 'Comportamento de polímeros naturais sob alta pressão e cisalhamento.', duration: '20 min', completed: false, type: 'text' },
          { id: 'l5', title: 'Geometria do Parafuso e Configurações', content: 'Configuração de elementos de transporte e amassamento.', duration: '35 min', completed: false, type: 'text' },
          { id: 'l6', title: 'Parâmetros de Processo (SME e Torque)', content: 'Cálculo da Energia Mecânica Específica (SME).', duration: '40 min', completed: false, type: 'text' },
          { id: 'l7', title: 'Expansão e Texturização', content: 'Fenómenos de nucleação e flash-off no final da matriz.', duration: '20 min', completed: false, type: 'text' },
          { id: 'l8', title: 'Secagem e Revestimento Pós-Extrusão', content: 'Etapas cruciais de estabilização e aplicação de aromas.', duration: '15 min', completed: false, type: 'text' },
          { id: 'l9', title: 'Manutenção e Segurança Operacional', content: 'Protocolos de limpeza (CIP) e desgaste de componentes.', duration: '20 min', completed: false, type: 'text' }
        ]
      },
      {
        id: 'safety-002',
        title: 'Segurança e Higiene no Trabalho',
        description: 'Normas essenciais de segurança industrial, uso de EPIs e protocolos de emergência em ambiente fabril.',
        instructor: 'Ana Oliveira',
        category: 'Segurança',
        thumbnail: 'https://images.unsplash.com/photo-1590644365607-1c5a519a7a37?q=80&w=2070&auto=format&fit=crop',
        progress: 0,
        createdAt: new Date().toISOString(),
        lessons: [
          { id: 's1', title: 'Introdução à Segurança Industrial', content: 'Conceitos básicos de risco, perigo e prevenção.', duration: '10 min', completed: false, type: 'text' },
          { id: 's2', title: 'Uso Correto de EPIs', content: 'Guia completo sobre capacetes, luvas, proteção auditiva e calçado de segurança.', duration: '20 min', completed: false, type: 'text' },
          { id: 's3', title: 'Protocolos de Emergência e Evacuação', content: 'O que fazer em caso de incêndio ou acidente químico.', duration: '15 min', completed: false, type: 'text' }
        ]
      }
    ];

    if (savedCourses) {
      const parsedCourses = JSON.parse(savedCourses);
      // Garante que o curso de teste existe se a lista estiver vazia ou antiga
      if (parsedCourses.length < 2) {
        setCourses(defaultCourses);
        localStorage.setItem('mestria_courses', JSON.stringify(defaultCourses));
      } else {
        setCourses(parsedCourses);
      }
    } else {
      setCourses(defaultCourses);
      localStorage.setItem('mestria_courses', JSON.stringify(defaultCourses));
    }
    setIsInitializing(false);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('mestria_user');
    setUser(null);
    setCurrentView('login');
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 size={40} className="text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">A carregar mestria...</p>
      </div>
    );
  }

  if (!user || currentView === 'login') {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        onLogout={handleLogout} 
        isAdmin={user.role === 'admin'}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar user={user} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {(currentView === 'dashboard' || currentView === 'my-courses') && (
            <Dashboard 
              courses={courses} 
              onSelectCourse={(c) => { setSelectedCourse(c); setCurrentView('course-detail'); }} 
              onAddCourse={(c) => {
                const newCourses = [c, ...courses];
                setCourses(newCourses);
                localStorage.setItem('mestria_courses', JSON.stringify(newCourses));
              }}
              filterByProgress={currentView === 'my-courses'}
            />
          )}
          {currentView === 'course-detail' && selectedCourse && (
            <CourseDetail 
              course={selectedCourse} 
              onBack={() => setCurrentView('dashboard')}
              onUpdateCourse={(updated) => {
                const newCourses = courses.map(c => c.id === updated.id ? updated : c);
                setCourses(newCourses);
                localStorage.setItem('mestria_courses', JSON.stringify(newCourses));
                setSelectedCourse(updated);
              }}
              sendEvent={sendEvent}
            />
          )}
          {currentView === 'admin' && (
            <AdminPanel 
              courses={courses} 
              onAddCourse={(c) => {
                const newCourses = [c, ...courses];
                setCourses(newCourses);
                localStorage.setItem('mestria_courses', JSON.stringify(newCourses));
              }}
              onUpdateCourse={(updated) => {
                const newCourses = courses.map(c => c.id === updated.id ? updated : c);
                setCourses(newCourses);
                localStorage.setItem('mestria_courses', JSON.stringify(newCourses));
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
