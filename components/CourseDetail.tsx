
import React, { useState } from 'react';
import { Course, Lesson } from '../types';
import { 
  ArrowLeft, 
  Play, 
  CheckCircle2, 
  Clock, 
  Video,
  ChevronRight,
  Award,
  CheckCircle,
  X,
  ShieldCheck,
  Calendar,
  ExternalLink,
  Layers,
  Star
} from 'lucide-react';

interface CourseDetailProps {
  course: Course;
  onBack: () => void;
  onUpdateCourse: (course: Course) => void;
  sendEvent: (eventType: string, data: any) => void;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ course, onBack, onUpdateCourse, sendEvent }) => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(course.lessons[0]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  // Sincronizar lição selecionada quando o curso atualiza (ex: após marcar como concluída)
  React.useEffect(() => {
    const freshLesson = course.lessons.find(l => l.id === selectedLesson.id);
    if (freshLesson && freshLesson !== selectedLesson) {
      setSelectedLesson(freshLesson);
    }
  }, [course.lessons, selectedLesson.id]);

  // Resetar overlay de sucesso ao mudar de lição
  React.useEffect(() => {
    setShowSuccess(false);
  }, [selectedLesson.id]);

  React.useEffect(() => {
    sendEvent('lessonChange', { 
      courseId: course.id, 
      lessonId: selectedLesson.id,
      lessonTitle: selectedLesson.title 
    });
  }, [selectedLesson.id, course.id]);

  const toggleLessonComplete = React.useCallback((lessonId: string, score: number | null = null) => {
    const lessonToToggle = course.lessons.find(l => l.id === lessonId);
    if (!lessonToToggle) return;

    let isCompleted = lessonToToggle.completed;
    let lessonScore = lessonToToggle.score || 0;

    if (score !== null) {
      lessonScore = score;
      isCompleted = score >= 80; // Assuming 80% is the passing score
    } else {
      // For non-project lessons or manual toggling (if applicable later)
      isCompleted = !lessonToToggle.completed;
    }

    const updatedLessons = course.lessons.map(l =>
      l.id === lessonId ? { ...l, completed: isCompleted, score: lessonScore } : l
    );

    const completedCount = updatedLessons.filter(l => l.completed).length;
    const progress = Math.round((completedCount / updatedLessons.length) * 100);

    const updatedCourse = {
      ...course,
      lessons: updatedLessons,
      progress
    };

    onUpdateCourse(updatedCourse);

    const newSelected = updatedLessons.find(l => l.id === lessonId);
    if (newSelected) {
      setSelectedLesson(newSelected);
      if (isCompleted && !lessonToToggle.completed) { // Only show success if it just became completed
        setShowSuccess(true);
      }
    }
  }, [course, onUpdateCourse]);

  const rateLesson = (lessonId: string, rating: number) => {
    const updatedLessons = course.lessons.map(l => 
      l.id === lessonId ? { ...l, rating } : l
    );

    const updatedCourse = {
      ...course,
      lessons: updatedLessons
    };

    onUpdateCourse(updatedCourse);
    
    const newSelected = updatedLessons.find(l => l.id === lessonId);
    if (newSelected) setSelectedLesson(newSelected);
  };

  // Sync with iframe navigation
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Safety check for message data
      if (!event.data || typeof event.data !== 'object') return;

      const { type, moduleIndex, action, score } = event.data; // Destructure score

      if (type === 'elearning-navigation') {
        const targetLesson = course.lessons.find(l =>
          l.externalUrl?.includes(`module=${moduleIndex}`)
        );

        if (targetLesson) {
          if (action === 'loadModule' && targetLesson.id !== selectedLesson.id) {
            setSelectedLesson(targetLesson);
          } else if (action === 'moduleProgress') { // Handle moduleProgress
            toggleLessonComplete(targetLesson.id, score); // Pass score to toggleLessonComplete
          }
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [course.lessons, selectedLesson.id, toggleLessonComplete]);

  const currentIndex = course.lessons.findIndex(l => l.id === selectedLesson.id);
  const isLastLesson = currentIndex === course.lessons.length - 1;
  const nextLesson = !isLastLesson ? course.lessons[currentIndex + 1] : null;

  const canAdvance = selectedLesson.type !== 'project' || (selectedLesson.score !== undefined && selectedLesson.score >= 80);

  return (
    <div className="max-w-7xl mx-auto animate-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-4xl overflow-hidden relative border-[12px] border-slate-50">
            <button 
              onClick={() => setShowCertificate(false)}
              className="absolute top-8 right-8 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors z-20"
            >
              <X size={20} className="text-slate-500" />
            </button>
            
            <div className="p-12 text-center space-y-8 relative">
              <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-50 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-50"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-50 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl opacity-50"></div>

              <header className="relative z-10 space-y-2">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                  <ShieldCheck size={14} /> Certificado Oficial
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Certificado de Conclusão</h1>
                <p className="text-slate-400 font-medium">Este documento certifica que o aluno completou com sucesso o curso</p>
              </header>

              <div className="py-12 relative z-10">
                <h2 className="text-3xl md:text-4xl font-black text-indigo-600 mb-2">{course.title}</h2>
                <div className="h-1 w-24 bg-slate-200 mx-auto rounded-full mb-8"></div>
                <p className="text-lg text-slate-500">Emitido para:</p>
                <p className="text-4xl font-serif font-bold text-slate-800 italic mt-2">Mestrando Digital</p>
              </div>

              <footer className="pt-12 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Data de Conclusão</p>
                  <p className="text-slate-800 font-bold flex items-center justify-center gap-2">
                    <Calendar size={16} className="text-indigo-400" /> {new Date().toLocaleDateString('pt-PT')}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                    <Award size={48} className="text-indigo-600" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID de Verificação</p>
                  <p className="text-slate-800 font-mono font-bold text-sm">MD-{course.id.toUpperCase()}-2024</p>
                </div>
              </footer>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-6 font-medium group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Voltar ao Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Player & Content */}
        <div className="lg:col-span-3 space-y-6">
          <div className={`w-full ${selectedLesson.type === 'project' ? 'aspect-[16/10] sm:aspect-video lg:h-[800px]' : 'aspect-video'} bg-slate-900 rounded-2xl overflow-hidden relative shadow-2xl flex items-center justify-center group/player`}>
            <img 
              src={course.thumbnail} 
              alt="Video Preview" 
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                selectedLesson.type === 'project' ? 'opacity-0' : (selectedLesson.completed ? 'opacity-20' : 'opacity-40')
              }`}
            />
            
            {showSuccess && selectedLesson.completed && (
              <div className="absolute inset-0 bg-teal-900/40 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center text-white text-center p-6 animate-in fade-in zoom-in duration-300">
                <div className="bg-white text-teal-600 p-4 rounded-full mb-4 shadow-xl">
                  <CheckCircle size={48} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Lição Concluída!</h3>
                <div className="mt-6 flex gap-4">
                  <button 
                    onClick={() => toggleLessonComplete(selectedLesson.id)}
                    className="px-4 py-2 border border-white/30 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium"
                  >
                    Refazer Aula
                  </button>
                  {nextLesson && (
                    <button 
                      onClick={() => setSelectedLesson(nextLesson)}
                      className="px-4 py-2 bg-white text-teal-700 rounded-lg hover:bg-teal-50 transition-colors text-sm font-bold shadow-lg"
                    >
                      Próxima Aula
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className={`relative z-10 w-full h-full flex flex-col items-center gap-4 text-white transition-opacity ${showSuccess && selectedLesson.completed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              {selectedLesson.type === 'project' ? (
                <iframe
                  src={selectedLesson.externalUrl || '#'}
                  title={selectedLesson.title}
                  className="w-full h-full rounded-2xl border-0 shadow-inner"
                  allowFullScreen
                />
              ) : (
                <button className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-xl shadow-indigo-500/30">
                  <Play size={40} fill="white" className="ml-1" />
                </button>
              )}
              
              {selectedLesson.type !== 'project' && (
                <div className="text-center">
                  <p className="text-sm opacity-80 uppercase tracking-widest font-semibold">Aula {course.lessons.indexOf(selectedLesson) + 1}</p>
                  <h3 className="text-xl font-bold">{selectedLesson.title}</h3>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-slate-800">{selectedLesson.title}</h2>
                  {selectedLesson.externalUrl && (
                    <a 
                      href={selectedLesson.externalUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      title="Abrir em nova aba"
                    >
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                  <span className="flex items-center gap-1"><Clock size={16} /> {selectedLesson.duration}</span>
                  <span className="flex items-center gap-1">
                    {selectedLesson.type === 'project' ? <Layers size={16} /> : <Video size={16} />}
                    {selectedLesson.type === 'project' ? 'Software/Projeto' : 'Alta Definição'}
                  </span>
                </div>
              </div>
              
              
            </div>

            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap">
                {selectedLesson.content || "Conteúdo em preparação para esta aula..."}
              </p>
            </div>

            {/* Rating Section */}
            <div className="pt-6 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Avaliar esta lição</h4>
                  <p className="text-xs text-slate-500 font-medium">O seu feedback ajuda a melhorar o conteúdo.</p>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => rateLesson(selectedLesson.id, star)}
                      className="p-1 transition-transform active:scale-90"
                    >
                      <Star 
                        size={28} 
                        className={`transition-colors ${
                          (hoverRating || selectedLesson.rating || 0) >= star 
                          ? 'text-yellow-400 fill-yellow-400' 
                          : 'text-slate-200'
                        }`} 
                      />
                    </button>
                  ))}
                  {selectedLesson.rating && (
                    <span className="ml-2 text-sm font-bold text-slate-700">{selectedLesson.rating}/5</span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
              <button 
                disabled={currentIndex === 0}
                onClick={() => setSelectedLesson(course.lessons[currentIndex - 1])}
                className="text-slate-400 font-semibold hover:text-slate-600 flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft size={18} /> Aula Anterior
              </button>
              
              {nextLesson && (
                <button 
                  onClick={() => setSelectedLesson(nextLesson)}
                  disabled={!canAdvance}
                  className={`px-6 py-2 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-700 transition-colors flex items-center gap-2 ${!canAdvance ? 'opacity-30 cursor-not-allowed' : ''}`}
                >
                  Próxima Aula <ChevronRight size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar List */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-50">
              <h3 className="font-bold text-slate-800">Seu Progresso no Curso</h3>
              <div className="mt-4 flex items-center justify-between text-xs font-bold">
                <span className={course.progress === 100 ? 'text-teal-600' : 'text-slate-500'}>
                  {course.progress === 100 ? 'Curso Completo!' : `${course.progress}% concluído`}
                </span>
                <span className="text-slate-400">{course.lessons.filter(l => l.completed).length}/{course.lessons.length} aulas</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full mt-2 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-700 ${course.progress === 100 ? 'bg-teal-500' : 'bg-indigo-500'}`} 
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
              {course.progress === 100 && (
                <button 
                  onClick={() => setShowCertificate(true)}
                  className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                  <Award size={18} /> Ver Certificado
                </button>
              )}
            </div>

            <div className="max-h-[500px] overflow-y-auto">
              {course.lessons.map((lesson, idx) => {
                const previousLesson = course.lessons[idx - 1];
                const isPreviousLessonCompleted = previousLesson
                  ? previousLesson.type !== 'project' || (previousLesson.score !== undefined && previousLesson.score >= 80)
                  : true; // First lesson is never locked by previous

                const isLessonLocked = (lesson.type === 'project' && idx > currentIndex && !isPreviousLessonCompleted);

                return (
                <div 
                  key={lesson.id}
                  onClick={() => {
                    if (!isLessonLocked) {
                      setSelectedLesson(lesson);
                    }
                  }}
                  className={`p-4 flex items-center justify-between cursor-pointer border-b border-slate-50 transition-all group ${
                    selectedLesson.id === lesson.id ? 'bg-indigo-50/50' : 'hover:bg-slate-50'
                  } ${isLessonLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex gap-3 items-start">
                    <CheckCircle2 size={20} fill={lesson.completed ? 'currentColor' : 'none'} className={`shrink-0 mt-0.5 transition-colors ${lesson.completed ? 'text-teal-500' : 'text-slate-300'}`} />
                    <div>
                      <p className={`text-sm font-bold transition-colors line-clamp-1 ${selectedLesson.id === lesson.id ? 'text-indigo-600' : 'text-slate-700'}`}>
                        {idx + 1}. {lesson.title}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[10px] text-slate-400 font-medium uppercase flex items-center gap-1">
                          {lesson.type === 'project' ? <Layers size={10} /> : <Clock size={10} />}
                          {lesson.type === 'project' ? ' Projeto' : ` ${lesson.duration}`}
                        </span>
                        {lesson.rating && (
                          <span className="text-[10px] text-yellow-600 font-bold flex items-center gap-0.5">
                            <Star size={10} fill="currentColor" /> {lesson.rating}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );})}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
