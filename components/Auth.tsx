
import React, { useState } from 'react';
import { User } from '../types';
import { BookOpen, Loader2, Mail, ArrowRight, Lock, Chrome } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);

    setTimeout(() => {
      const role = email.includes('admin') ? 'admin' : 'student';
      
      const loggedUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: mode === 'login' ? email.split('@')[0] : name,
        email: email,
        role: role,
        avatar: `https://i.pravatar.cc/150?u=${email}`
      };

      localStorage.setItem('mestria_user', JSON.stringify(loggedUser));
      onLogin(loggedUser);
      setIsAuthenticating(false);
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      const loggedUser: User = {
        id: 'google-' + Math.random().toString(36).substr(2, 9),
        name: 'Utilizador Google',
        email: 'user@gmail.com',
        role: 'student',
        avatar: 'https://lh3.googleusercontent.com/a/default-user'
      };
      localStorage.setItem('mestria_user', JSON.stringify(loggedUser));
      onLogin(loggedUser);
      setIsAuthenticating(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 font-sans">
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        
        {isAuthenticating && (
          <div className="absolute inset-0 z-40 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
            <Loader2 size={48} className="text-indigo-600 animate-spin mb-4" />
            <p className="text-indigo-900 font-black tracking-widest text-xs uppercase">A processar...</p>
          </div>
        )}

        <div className="text-center mb-10 relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-50 rounded-3xl mb-6 text-indigo-600 shadow-inner">
            <BookOpen size={40} />
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Mestria Digital</h1>
          <p className="text-slate-500 mt-3 text-sm font-medium">Plataforma de E-Learning</p>
        </div>

        <div className="space-y-6 relative z-10">
          <button 
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-4 border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-[0.98]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar com Google
          </button>

          <div className="flex items-center gap-4 py-2">
            <div className="h-px bg-slate-100 flex-1"></div>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Ou com e-mail</span>
            <div className="h-px bg-slate-100 flex-1"></div>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-1 animate-in slide-in-from-top-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                <input 
                  type="text" 
                  required 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                  placeholder="Seu nome" 
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Endereço de E-mail</label>
              <div className="relative">
                <Mail className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                  placeholder="exemplo@email.com" 
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Palavra-passe</label>
              <div className="relative">
                <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input 
                  type="password" 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-black hover:bg-indigo-600 transition-all shadow-xl active:scale-[0.98] mt-4 flex items-center justify-center gap-3 group">
              {mode === 'login' ? 'ENTRAR AGORA' : 'CRIAR MINHA CONTA'}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
        
        <div className="mt-8 pt-8 border-t border-slate-50 text-center">
          <button 
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-indigo-600 text-xs font-bold uppercase tracking-widest hover:underline"
          >
            {mode === 'login' ? 'Não tem conta? Registe-se' : 'Já tem conta? Faça Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
