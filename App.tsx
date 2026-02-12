
import React, { useState, useEffect } from 'react';
import { User, Course, AppView, Lesson } from './types';
import Auth from './components/Auth';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CourseDetail from './components/CourseDetail';
import AdminPanel from './components/AdminPanel';
import { Loader2 } from 'lucide-react';
import { supabase } from './services/supabase';

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
    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const loggedUser: User = {
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Utilizador',
          email: session.user.email || '',
          role: session.user.user_metadata?.role || 'student',
          avatar: session.user.user_metadata?.avatar_url || `https://i.pravatar.cc/150?u=${session.user.id}`
        };
        setUser(loggedUser);
        if (currentView === 'login') setCurrentView('dashboard');
      } else {
        setUser(null);
        setCurrentView('login');
      }
      setIsInitializing(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setCourses([]);
      return;
    }

    const loadCourses = async () => {
      // CURRÍCULO PADRÃO (4 Módulos de Extrusão)
      const defaultCourses: Course[] = [
        {
          id: 'extrusion-001',
          title: 'Mestria em Extrusão de Alimentos',
          description: 'Curso técnico avançado cobrindo todos os aspetos do processo de extrusão industrial.',
          instructor: 'Simão Teixeira',
          category: 'Extrusão',
          thumbnail: '/courses/formar-opencode/assets/GEA-xTru-Twin92H-65984.jpg',
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
        }
      ];

      // Tentar carregar da Supabase (Nova tabela: user_elearning)
      let cloudProgress: any[] = [];
      try {
        const { data, error } = await supabase
          .from('user_elearning')
          .select('*')
          .eq('user_id', user.id);
        
        if (!error && data) {
          cloudProgress = data;
        }
      } catch (err) {
        console.error("Erro ao carregar progresso da cloud:", err);
      }

      // Carregar do localStorage específico do utilizador
      const localKey = `mestria_courses_${user.id}`;
      const savedCourses = localStorage.getItem(localKey);
      
      let mergedCourses = defaultCourses;

      if (savedCourses) {
        const parsed: Course[] = JSON.parse(savedCourses);
        mergedCourses = defaultCourses.map(dc => {
          const pc = parsed.find(p => p.id === dc.id);
          if (pc) {
            return { ...dc, progress: pc.progress, lessons: dc.lessons.map(dl => {
              const pl = pc.lessons.find(l => l.id === dl.id);
              return pl ? { ...dl, completed: pl.completed, rating: pl.rating } : dl;
            })};
          }
          return dc;
        });
      }

      // Fundir com progresso da cloud (cloud manda)
      if (cloudProgress.length > 0) {
        mergedCourses = mergedCourses.map(c => {
          const cp = cloudProgress.find(p => p.course_id === c.id);
          if (cp) {
            const completedIds = cp.completed_lessons || [];
            const updatedLessons = c.lessons.map(l => ({
              ...l,
              completed: completedIds.includes(l.id)
            }));
            const progress = Math.round((updatedLessons.filter(l => l.completed).length / updatedLessons.length) * 100);
            return { ...c, lessons: updatedLessons, progress };
          }
          return c;
        });
      }

      setCourses(mergedCourses);
      localStorage.setItem(localKey, JSON.stringify(mergedCourses));
    };

    loadCourses();
  }, [user]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // O onAuthStateChange tratará do reset do estado
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
        courses={courses}
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
              if (user) {
                localStorage.setItem(`mestria_courses_${user.id}`, JSON.stringify(newCourses));
              }
            }}
            filterByProgress={currentView === 'my-courses'}
          />
        )}

        {currentView === 'course-detail' && selectedCourse && (
          /* CORREÇÃO: Tag CourseDetail completa */
          <CourseDetail 
            course={selectedCourse}
            onBack={() => setCurrentView('dashboard')}
            onUpdateCourse={async (updated) => {
              const newCourses = courses.map(c => c.id === updated.id ? updated : c);
              setCourses(newCourses);
              
              if (user) {
                // Salvar no localStorage do utilizador
                localStorage.setItem(`mestria_courses_${user.id}`, JSON.stringify(newCourses));
                
                // Sincronizar com Supabase (Nova tabela: user_elearning)
                try {
                  const completedLessons = updated.lessons
                    .filter(l => l.completed)
                    .map(l => l.id);
                  
                  await supabase
                    .from('user_elearning')
                    .upsert({
                      user_id: user.id,
                      course_id: updated.id,
                      completed_lessons: completedLessons,
                      updated_at: new Date().toISOString()
                    }, { onConflict: 'user_id,course_id' });
                } catch (err) {
                  console.error("Erro ao sincronizar com Supabase:", err);
                }
              }
              
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
              if (user) {
                localStorage.setItem(`mestria_courses_${user.id}`, JSON.stringify(newCourses));
              }
            }}
            onUpdateCourse={(updated) => {
              const newCourses = courses.map(c => c.id === updated.id ? updated : c);
              setCourses(newCourses);
              if (user) {
                localStorage.setItem(`mestria_courses_${user.id}`, JSON.stringify(newCourses));
              }
            }}
          />
        )}
      </main>
    </div>
  );
};

export default App;