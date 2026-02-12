
import React, { useState } from 'react';
import { Course } from '../types';
import { 
  TrendingUp, 
  Clock, 
  Award, 
  Play, 
  ChevronRight,
  Plus,
  CheckCircle,
  Sparkles,
  Loader2,
  Wand2,
  Search,
  BookOpen
} from 'lucide-react';
import { generateCourseOutline } from '../services/gemini';

interface DashboardProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  onAddCourse: (course: Course) => void;
  filterByProgress?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ courses = [], onSelectCourse, onAddCourse, filterByProgress }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtro em tempo real com proteção contra valores ausentes
  const displayCourses = (courses || []).filter(c => {
    if (!c) return false;
    
    const term = (searchQuery || '').toLowerCase().trim();
    const title = (c.title || '').toLowerCase();
    const category = (c.category || '').toLowerCase();
    const instructor = (c.instructor || '').toLowerCase();
    
    const matchesSearch = 
      title.includes(term) || 
      category.includes(term) || 
      instructor.includes(term);
    
    // Se for a vista "Meus Cursos", mostrar apenas se houver progresso
    if (filterByProgress) return matchesSearch && (c.progress > 0);
    return matchesSearch;
  });

  const handleSearchTrigger = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
  };

  const totalLessons = courses.reduce((acc, c) => acc + c.lessons.length, 0);
  const completedLessons = courses.reduce((acc, c) => acc + c.lessons.filter(l => l.completed).length, 0);
  const globalProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const stats = [
    { label: 'Cursos Ativos', value: courses.length, icon: Play, color: 'bg-blue-500' },
    { label: 'Lições Concluídas', value: `${completedLessons}/${totalLessons}`, icon: CheckCircle, color: 'bg-indigo-500' },
    { label: 'Certificados', value: courses.filter(c => c.progress === 100).length, icon: Award, color: 'bg-teal-500' },
  ];

  const handleQuickCreate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    try {
      const outline = await generateCourseOutline(topic);
      if (outline) {
        const newCourse: Course = {
          id: Math.random().toString(36).substr(2, 9),
          title: outline.title,
          description: outline.description,
          category: outline.category,
          instructor: 'IA Assistente',
          thumbnail: `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop`,
          progress: 0,
          createdAt: new Date().toISOString(),
          lessons: outline.lessons.map((l: any) => ({
            id: Math.random().toString(36).substr(2, 9),
            title: l.title,
            content: l.content,
            duration: l.duration,
            completed: false
          }))
        };
        onAddCourse(newCourse);
        setTopic('');
      }
    } catch (err) {
      console.error("Erro ao gerar curso:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-md">
            {filterByProgress ? 'Meus Cursos' : 'Explorar Aprendizado'}
          </h1>
          <p className="text-slate-300 mt-2 font-medium">
            {filterByProgress ? 'Cursos em que você já iniciou o progresso.' : `Você já concluiu ${globalProgress}% da sua trilha total.`}
          </p>
        </div>
        {!filterByProgress && (
          <div className="w-full md:w-64 space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-300">
              <span>Progresso Geral</span>
              <span>{globalProgress}%</span>
            </div>
            <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-teal-400 transition-all duration-1000 ease-out"
                style={{ width: `${globalProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </header>

      {/* Quick Add Section removed as requested */}

      {/* Stats */}
      {!filterByProgress && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
              <div className={`${stat.color} p-3 rounded-xl text-white shadow-lg`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Course List */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {filterByProgress ? 'Continuar Aprendendo' : 'Cursos Disponíveis'}
            <span className="bg-white/10 text-slate-300 text-xs py-1 px-2 rounded-full">{displayCourses.length}</span>
          </h2>
          
          <form onSubmit={handleSearchTrigger} className="relative group/search flex items-center gap-2">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-indigo-600 transition-colors z-10">
                <Search size={16} />
              </div>
              <input 
                type="text" 
                placeholder="Pesquisar cursos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64 transition-all"
              />
            </div>
            {searchQuery && (
              <button 
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Limpar
              </button>
            )}
          </form>
        </div>

        {displayCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayCourses.map((course) => (
              <div 
                key={course.id}
                onClick={() => onSelectCourse(course)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative"
              >
                {course.progress === 100 && (
                  <div className="absolute top-4 right-4 z-20 bg-teal-500 text-white p-1.5 rounded-full shadow-lg animate-bounce">
                    <Award size={18} />
                  </div>
                )}
                
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${course.progress === 100 ? 'grayscale-[0.5]' : ''}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white text-indigo-600 px-4 py-2 rounded-full font-bold text-sm">Aceder</span>
                  </div>
                  <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur rounded-lg text-[10px] font-bold text-indigo-600 uppercase">
                    {course.category}
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">{course.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">Instrutor: {course.instructor}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className={course.progress === 100 ? 'text-teal-600' : 'text-slate-600'}>
                        {course.progress === 100 ? 'Concluído' : 'Progresso'}
                      </span>
                      <span className={course.progress === 100 ? 'text-teal-600' : 'text-indigo-600'}>{course.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${course.progress === 100 ? 'bg-teal-500' : 'bg-indigo-500'}`} 
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                     <span className="text-xs text-slate-400 flex items-center gap-1">
                       <CheckCircle size={14} className={course.progress === 100 ? 'text-teal-500' : ''} /> 
                       {course.lessons.filter(l => l.completed).length}/{course.lessons.length} aulas
                     </span>
                     <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-3xl border-2 border-dashed border-white/10 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Search size={32} />
            </div>
            <h3 className="text-lg font-bold text-white">
              Nenhum resultado para "{searchQuery}"
            </h3>
            <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">
              Tente pesquisar por palavras-chave diferentes, categorias ou pelo nome do instrutor.
            </p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-6 text-indigo-400 font-bold text-sm hover:underline"
            >
              Limpar Pesquisa
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
