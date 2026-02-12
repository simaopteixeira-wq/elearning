
import React, { useState, useRef } from 'react';
import { User, AppView, Course } from '../types';
import { 
  LogOut, 
  LayoutDashboard, 
  BookOpen, 
  PlusCircle, 
  User as UserIcon, 
  Camera, 
  BarChart3, 
  X,
  Loader2
} from 'lucide-react';
import { supabase } from '../services/supabase';

interface NavbarProps {
  user: User;
  currentView: AppView;
  setView: (view: AppView) => void;
  onLogout: () => void;
  isAdmin: boolean;
  courses: Course[];
}

const Navbar: React.FC<NavbarProps> = ({ user, currentView, setView, onLogout, isAdmin, courses }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-courses', label: 'Meus Cursos', icon: BookOpen },
  ];

  if (isAdmin) {
    menuItems.push({ id: 'admin', label: 'Gerenciar', icon: PlusCircle });
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload para o bucket 'avatars' (deve ser criado no Supabase)
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Atualizar metadados do utilizador
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateError) throw updateError;
      
      // Forçar refresh para atualizar o objeto user vindo do AuthStateChange
      window.location.reload();
    } catch (error) {
      console.error('Erro ao carregar avatar:', error);
      alert('Erro ao carregar a foto. Certifique-se de que o bucket "avatars" existe e é público no Supabase.');
    } finally {
      setIsUploading(false);
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0 relative z-50">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
            <BookOpen size={22} />
          </div>
          <span className="font-bold text-xl text-slate-800">Mestria</span>
        </div>

        <nav className="hidden md:flex items-center gap-2">
          {menuItems.map((item) => {
            const isActive = currentView === item.id || (item.id === 'dashboard' && currentView === 'course-detail');
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id as AppView)}
                className={`px-4 py-2 rounded-lg text-base font-medium transition-colors ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-4 relative">
        <div 
          className="flex items-center gap-3 cursor-pointer group p-1 pr-4 rounded-full hover:bg-slate-50 transition-all"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center border-2 border-indigo-100 overflow-hidden relative">
            {isUploading ? (
              <Loader2 size={24} className="text-indigo-600 animate-spin" />
            ) : user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <UserIcon size={24} className="text-slate-400" />
            )}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-base font-bold text-slate-800 leading-none group-hover:text-indigo-600 transition-colors">{user.name}</p>
          </div>
        </div>

        {/* Menu Dropdown */}
        {isMenuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}></div>
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleAvatarUpload} 
              />
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <Camera size={18} className="text-indigo-500" />
                <span>Acrescentar foto</span>
              </button>

              <button 
                onClick={() => { setShowProgressModal(true); setIsMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <BarChart3 size={18} className="text-indigo-500" />
                <span>Mostrar progresso</span>
              </button>

              <div className="h-px bg-slate-100 my-1 mx-2"></div>

              <button 
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut size={18} />
                <span className="font-semibold">Sair</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Progress Modal */}
      {showProgressModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden relative">
            <header className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-600 p-2 rounded-xl text-white">
                  <BarChart3 size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-800 tracking-tight">Meu Progresso</h2>
                  <p className="text-xs text-slate-500 font-medium">Resumo das tuas formações</p>
                </div>
              </div>
              <button 
                onClick={() => setShowProgressModal(false)}
                className="p-2 bg-white hover:bg-slate-100 rounded-full transition-colors shadow-sm"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </header>

            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              {courses.filter(c => c.progress > 0).length > 0 ? (
                courses.filter(c => c.progress > 0).map(course => (
                  <div key={course.id} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{course.title}</h4>
                      <span className="text-indigo-600 font-black text-sm">{course.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-teal-400 transition-all duration-1000"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen size={24} className="text-slate-300" />
                  </div>
                  <p className="text-slate-500 text-sm font-medium">Ainda não iniciaste nenhum curso.</p>
                </div>
              )}
            </div>

            <footer className="p-8 bg-slate-50/50 border-t border-slate-50">
              <button 
                onClick={() => setShowProgressModal(false)}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98]"
              >
                FECHAR
              </button>
            </footer>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
