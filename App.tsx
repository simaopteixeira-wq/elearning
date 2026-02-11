
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
      spot.addEventListener('click', () => 
        sendEvent('questionClick', { id: (spot as HTMLElement).dataset.id })
      );
    });

    // Video listener
    const video = document.querySelector('video');
    if (video) {
      video.addEventListener('play', () => sendEvent('videoPlay', {}));
      video.addEventListener('timeupdate', () => 
        sendEvent('videoTime', { current: video.currentTime })
      );
    }
  }, []);

  useEffect(() => {
    // Restaurar sessão local
    const savedUser = localStorage.getItem('mestria_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentView('dashboard');
    }

    // CURRÍCULO PADRÃO (4 Módulos de Extrusão)
    const defaultCourses: Course[] = [
      {
        id: 'extrusion-001',
        title: 'Mestria em Extrusão de Alimentos',
        description: 'Curso técnico avançado cobrindo todos os aspetos do processo de extrusão industrial.',
        instructor: 'Simão Teixeira',
        category: 'Engenharia',
        thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop',
        progress: 0,
        createdAt: new Date().toISOString(),
        lessons: [
          {
            id: 'l1',
            title: 'Módulo 1: Introdução à Extrusão',
            content: 'Conceitos fundamentais, SME, STE e o papel do amido na expansão.',
            duration: '15 min',
            completed: false,
            type: 'project',
            externalUrl: '/courses/formar-opencode/index.html?module=1'
          },
          {
            id: 'l2',
            title: 'Módulo 2: Introdução ao Equipamento',
            content: 'Sistemas de alimentação, pré-condicionamento, design de roscas e cabeçotes.',
            duration: '25 min',
            completed: false,
            type: 'project',
            externalUrl: '/courses/formar-opencode/index.html?module=2'
          },
          {
            id: 'l3',
            title: 'Módulo 3: Controlo de Extrusão',
            content: 'Software de controlo, sequências de estado e gestão de receitas.',
            duration: '30 min',
            completed: false,
            type: 'project',
            externalUrl: '/courses/formar-opencode/index.html?module=3'
          },
          {
            id: 'l4',
            title: 'Módulo 4: Cereais Diretamente Expandidos',
            content: 'Mecanismos de expansão, RTE, fibras e co-extrusão.',
            duration: '20 min',
            completed: false,
            type: 'project',
            externalUrl: '/courses/formar-opencode/index.html?module=4'
          }
        ]
      },
      {
        id: 'safety-002',
        title: 'Segurança e Higiene no Trabalho',
        description: 'Normas essenciais de segurança industrial.',
        instructor: 'Ana Oliveira',
        category: 'Segurança',
        thumbnail: 'https://images.unsplash.com/photo-1590644365607-1c5a519a7a37?q=80&w=2070&auto=format&fit=crop',
        progress: 0,
        createdAt: new Date().toISOString(),
        lessons: [
          { id: 's1', title: 'Introdução à Segurança Industrial', content: 'Conceitos básicos.', duration: '10 min', completed: false, type: 'text' },
          { id: 's2', title: 'Uso Correto de EPIs', content: 'Guia completo.', duration: '20 min', completed: false, type: 'text' },
          { id: 's3', title: 'Protocolos de Emergência', content: 'Evacuação.', duration: '15 min', completed: false, type: 'text' }
        ]
      }
    ];

    const savedCourses = localStorage.getItem('mestria_courses');
    if (savedCourses) {
      const parsedCourses: Course[] = JSON.parse(savedCourses);
      const extrusionCourse = parsedCourses.find(c => c.id === 'extrusion-001');
      // Forçar atualização se os títulos não baterem (versão sincronizada)
      const needsUpdate = !extrusionCourse || 
                          extrusionCourse.lessons.length !== 4 || 
                          extrusionCourse.lessons[0].title !== 'Módulo 1: Introdução à Extrusão';

      if (needsUpdate || parsedCourses.length < 2) {
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
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <Loader2 className="animate-spin mr-2" />
        <span>A carregar mestria...</span>
      </div>
    );
  }

  // CORREÇÃO: Retornar o componente Auth se não houver user
  if (!user || currentView === 'login') {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* CORREÇÃO: Tag Navbar completa */}
      <Navbar 
        user={user}
        currentView={currentView} 
        setView={setCurrentView} 
        onLogout={handleLogout}
        isAdmin={user.role === 'admin'}
      />
      
      <main className="max-w-[1600px] mx-auto px-4 py-8">
        {(currentView === 'dashboard' || currentView === 'my-courses') && (
          /* CORREÇÃO: Tag Dashboard completa */
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
          /* CORREÇÃO: Tag CourseDetail completa */
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
          /* CORREÇÃO: Tag AdminPanel completa */
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
  );
};

export default App;