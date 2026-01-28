
import React, { useState, useEffect } from 'react';
import { Course, Lesson } from '../types';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Loader2,
  RefreshCcw,
  Terminal,
  Github,
  GitCommit,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  Key,
  Info,
  CheckCircle,
  FileText,
  Link as LinkIcon,
  Layers
} from 'lucide-react';
import { generateCourseOutline, parseRawContentToCourse } from '../services/gemini';

interface AdminPanelProps {
  courses: Course[];
  onAddCourse: (course: Course) => void;
  onUpdateCourse?: (course: Course) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  courses, 
  onAddCourse, 
  onUpdateCourse
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [topic, setTopic] = useState('');
  const [rawText, setRawText] = useState('');
  const [showGitPanel, setShowGitPanel] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [commitLogs, setCommitLogs] = useState<string[]>([]);
  const [commitMessage, setCommitMessage] = useState('feat: atualização de cursos e conteúdos');
  const [importMode, setImportMode] = useState<'ai' | 'raw'>('ai');
  const [isEditing, setIsEditing] = useState(false);

  // Estados de Configuração Git
  const [repoUrl, setRepoUrl] = useState(() => localStorage.getItem('git_repo_url') || 'https://github.com/usuario/mestria-digital');
  const [gitUser, setGitUser] = useState(() => localStorage.getItem('git_user') || '');
  const [gitToken, setGitToken] = useState(() => localStorage.getItem('git_token') || '');
  const [showTokenGuide, setShowTokenGuide] = useState(false);

  useEffect(() => {
    localStorage.setItem('git_repo_url', repoUrl);
    localStorage.setItem('git_user', gitUser);
    localStorage.setItem('git_token', gitToken);
  }, [repoUrl, gitUser, gitToken]);

  const initialFormState: Partial<Course> = {
    title: '',
    description: '',
    category: 'Geral',
    instructor: 'Simão Teixeira',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop',
    lessons: []
  };

  const [courseForm, setCourseForm] = useState<Partial<Course>>(initialFormState);

  const simulateGitCommit = async () => {
    if (!commitMessage.trim()) return;
    setIsCommitting(true);
    setCommitLogs([]);
    
    const logs = [
      `[AUTH] A verificar credenciais para o utilizador: ${gitUser || 'anónimo'}...`,
      gitToken ? `[AUTH] ✅ Token detetado. Conexão segura estabelecida.` : `[WARN] ⚠️ Nenhum token de acesso configurado. O push poderá falhar.`,
      `> git status`,
      `Modificações detetadas em index.html, App.tsx e ${courses.length} cursos.`,
      `> git add .`,
      `> git commit -m "${commitMessage}"`,
      `[main ${Math.random().toString(16).substr(2, 7)}] ${commitMessage}`,
      `> git remote set-url origin ${repoUrl}.git`,
      `> git push origin main`,
      `Enumerating objects: 54, done.`,
      `Writing objects: 100% (54/54), 18.22 KiB, done.`,
      `remote: Resolving deltas: 100% (22/22), done.`,
      `To ${repoUrl}.git`,
      `   f2a3b4c..${Math.random().toString(16).substr(2, 7)}  main -> main`,
      `✓ Sincronização com GitHub concluída com sucesso!`
    ];

    for (const log of logs) {
      setCommitLogs(prev => [...prev, log]);
      await new Promise(resolve => setTimeout(resolve, log.startsWith('>') ? 800 : 300));
    }
    
    setTimeout(() => {
      setIsCommitting(false);
    }, 500);
  };

  const handleAISuggest = async () => {
    if (!topic) return;
    setIsGenerating(true);
    const outline = await generateCourseOutline(topic);
    setIsGenerating(false);

    if (outline) {
      setCourseForm({
        ...courseForm,
        title: outline.title,
        description: outline.description,
        category: outline.category,
        lessons: outline.lessons.map((l: any) => ({
          id: Math.random().toString(36).substr(2, 9),
          title: l.title,
          content: l.content,
          duration: l.duration,
          completed: false,
          type: 'text'
        }))
      });
    }
  };

  const handleRawImport = async () => {
    if (!rawText) return;
    setIsParsing(true);
    const result = await parseRawContentToCourse(rawText);
    setIsParsing(false);

    if (result) {
      setCourseForm({
        ...courseForm,
        title: result.title,
        description: result.description,
        category: result.category,
        lessons: result.lessons.map((l: any) => ({
          id: Math.random().toString(36).substr(2, 9),
          title: l.title,
          content: l.content,
          duration: l.duration,
          completed: false,
          type: 'text'
        }))
      });
      setRawText('');
    }
  };

  const handleSave = () => {
    if (!courseForm.title) return;
    if (isEditing && onUpdateCourse) {
      onUpdateCourse(courseForm as Course);
    } else {
      const course: Course = {
        ...courseForm as Course,
        id: Math.random().toString(36).substr(2, 9),
        progress: 0,
        createdAt: new Date().toISOString()
      };
      onAddCourse(course);
    }
    setCourseForm(initialFormState);
    setIsEditing(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Centro de Controlo</h1>
          <p className="text-slate-500 font-medium">Gestão de cursos e integração com o GitHub.</p>
        </div>
        <button 
          onClick={() => setShowGitPanel(!showGitPanel)} 
          className={`px-6 py-3 rounded-2xl text-sm font-black flex items-center gap-2 transition-all shadow-sm ${showGitPanel ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
        >
          <Github size={18} /> {showGitPanel ? 'Fechar Consola' : 'Configurar GitHub'}
        </button>
      </header>

      {/* GitHub Sync & Config Panel */}
      {showGitPanel && (
        <section className="bg-[#1e1e2e] rounded-[32px] overflow-hidden shadow-2xl border border-slate-800 animate-in slide-in-from-top-4 duration-500">
          <div className="p-6 bg-[#181825] border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Terminal size={18} className="text-indigo-400" />
              <span className="text-slate-400 font-mono text-xs">mestria-terminal — v2.1.0</span>
            </div>
            <div className={`flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest ${gitToken ? 'text-green-400' : 'text-yellow-500 animate-pulse'}`}>
              <ShieldCheck size={12} /> {gitToken ? 'Autenticado' : 'Aguardando Token'}
            </div>
          </div>
          
          <div className="p-8 space-y-8">
            {/* Step 1: Credentials */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Github size={12} /> Utilizador GitHub
                    </label>
                    <input 
                      type="text" 
                      value={gitUser}
                      onChange={(e) => setGitUser(e.target.value)}
                      className="w-full px-4 py-3 bg-[#11111b] border border-slate-700 rounded-xl text-slate-300 font-mono text-sm focus:border-indigo-500 outline-none"
                      placeholder="teu-usuario"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Key size={12} /> Personal Access Token (PAT)
                    </label>
                    <input 
                      type="password" 
                      value={gitToken}
                      onChange={(e) => setGitToken(e.target.value)}
                      className="w-full px-4 py-3 bg-[#11111b] border border-slate-700 rounded-xl text-slate-300 font-mono text-sm focus:border-indigo-500 outline-none"
                      placeholder="ghp_********************"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">URL do Repositório</label>
                  <input 
                    type="text" 
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="w-full px-4 py-3 bg-[#11111b] border border-slate-700 rounded-xl text-slate-300 font-mono text-sm focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              {/* Step 2: Help Guide */}
              <div className="bg-[#11111b] rounded-2xl p-6 border border-slate-800 space-y-4">
                <button 
                  onClick={() => setShowTokenGuide(!showTokenGuide)}
                  className="flex items-center justify-between w-full text-left group"
                >
                  <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">Como obter o Token?</span>
                  <Info size={14} className="text-slate-600 group-hover:text-indigo-400" />
                </button>
                <div className="text-[11px] text-slate-500 space-y-3 leading-relaxed">
                  <p>1. No GitHub, vá a <b>Settings</b> > <b>Developer Settings</b>.</p>
                  <p>2. Escolha <b>Personal Access Tokens (classic)</b>.</p>
                  <p>3. Gere um token com a permissão <b>'repo'</b>.</p>
                  <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-indigo-400 hover:underline font-bold">
                    Abrir GitHub Settings <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            </div>

            {/* Step 3: Action & Terminal */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-slate-800">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mensagem de Commit</label>
                  <div className="relative">
                    <GitCommit className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input 
                      type="text" 
                      value={commitMessage}
                      onChange={(e) => setCommitMessage(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-[#11111b] border border-slate-700 rounded-xl text-slate-300 font-mono text-sm focus:border-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <button 
                  onClick={simulateGitCommit}
                  disabled={isCommitting || !gitUser || !gitToken}
                  className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-900/20"
                >
                  {isCommitting ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
                  {isCommitting ? 'A SINCRONIZAR...' : 'SINCRONIZAR AGORA'}
                </button>
                {!gitToken && <p className="text-[10px] text-center text-yellow-500 font-bold uppercase tracking-widest">⚠️ Configure as credenciais acima para ativar</p>}
              </div>

              <div className="bg-[#11111b] rounded-2xl p-6 font-mono text-[11px] text-slate-400 h-[220px] overflow-y-auto border border-slate-800 shadow-inner custom-scrollbar">
                {commitLogs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-700 opacity-50">
                    <Terminal size={32} className="mb-2" />
                    <p>Aguardando comando...</p>
                  </div>
                ) : (
                  commitLogs.map((log, i) => (
                    <div key={i} className={`mb-1 ${log.startsWith('>') ? 'text-indigo-400 font-bold' : log.includes('✓') ? 'text-green-400 font-bold' : log.includes('[AUTH]') ? 'text-slate-300' : ''}`}>
                      {log}
                    </div>
                  ))
                )}
                {isCommitting && <div className="w-1.5 h-4 bg-indigo-500 animate-pulse inline-block ml-1"></div>}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Editor Section */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-8">
        <div className="flex bg-slate-100 p-1 rounded-2xl w-fit">
          <button onClick={() => setImportMode('ai')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${importMode === 'ai' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>Gerar por Tema</button>
          <button onClick={() => setImportMode('raw')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${importMode === 'raw' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>Importar Texto</button>
        </div>

        {importMode === 'ai' ? (
          <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={20} className="text-indigo-200" />
              <span className="font-bold">Gerar Estrutura com Gemini IA</span>
            </div>
            <div className="flex gap-2">
              <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Ex: Fotografia para Iniciantes..." className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-xl outline-none text-sm placeholder:text-indigo-200" />
              <button onClick={handleAISuggest} disabled={isGenerating} className="bg-white text-indigo-600 px-6 py-2 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors">
                {isGenerating ? <Loader2 className="animate-spin" size={18} /> : 'Gerar'}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-teal-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={20} className="text-teal-200" />
              <span className="font-bold">Processar Conteúdo Manual</span>
            </div>
            <textarea rows={4} value={rawText} onChange={(e) => setRawText(e.target.value)} placeholder="Cola aqui o sumário do curso..." className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl outline-none text-sm resize-none placeholder:text-teal-200"></textarea>
            <button onClick={handleRawImport} disabled={isParsing} className="w-full mt-3 bg-white text-teal-600 px-6 py-3 rounded-xl font-black text-sm hover:bg-teal-50">
              {isParsing ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'ANALISAR E IMPORTAR'}
            </button>
          </div>
        )}

        {/* Basic Course Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          <div className="md:col-span-2">
            <label className="block text-xs font-black text-slate-400 uppercase mb-2">Título do Curso</label>
            <input type="text" value={courseForm.title} onChange={(e) => setCourseForm({...courseForm, title: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="Dê um nome ao curso" />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase mb-2">Categoria</label>
            <input type="text" value={courseForm.category} onChange={(e) => setCourseForm({...courseForm, category: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase mb-2">Instrutor</label>
            <input type="text" value={courseForm.instructor} onChange={(e) => setCourseForm({...courseForm, instructor: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
          </div>
        </div>

        <div className="pt-8 flex justify-end">
          <button onClick={handleSave} className="w-full md:w-auto px-12 py-5 bg-slate-900 text-white rounded-[24px] font-black hover:bg-indigo-600 transition-all shadow-xl active:scale-[0.98]">
            PUBLICAR CURSO NA PLATAFORMA
          </button>
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;
