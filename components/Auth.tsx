
import React, { useState } from 'react';
import { User } from '../types';
import { BookOpen, Loader2, Mail, ArrowRight, Lock, Chrome, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../services/supabase';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  // Auto-login for testing purposes
  // Auto-login for testing purposes
  /*
  React.useEffect(() => {
    const autoLogin = async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password',
      });
      if (data.user) {
        onLogin({
          id: data.user.id,
          name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'Utilizador',
          email: data.user.email || '',
          role: data.user.user_metadata?.role || 'student',
          avatar: data.user.user_metadata?.avatar_url || `https://i.pravatar.cc/150?u=${data.user.id}`
        });
      } else if (error) {
        console.error('Auto-login error:', error.message);
      }
    };
    autoLogin();
  }, []);
  */

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // New state for password visibility
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setError(null);

    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              role: email.includes('admin') ? 'admin' : 'student' // Simplificação inicial, idealmente gerido no backend
            }
          }
        });

        if (signUpError) throw signUpError;
        if (data.user) {
          setError('Conta criada! Por favor verifique o seu email para confirmar o registo.');
          setMode('login');
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) {
          console.error('Sign-in error:', signInError.message); // Log error to terminal
          setError(signInError.message); // Display error in UI
          throw signInError;
        }
        

        if (data.user) {
          const user: User = {
            id: data.user.id,
            name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'Utilizador',
            email: data.user.email || '',
            role: data.user.user_metadata?.role || 'student',
            avatar: data.user.user_metadata?.avatar_url || `https://i.pravatar.cc/150?u=${data.user.id}`
          };
          onLogin(user); // Call onLogin with the authenticated user
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err); // Log general auth error to terminal
      setError(err.message || 'Ocorreu um erro durante a autenticação.'); // Display general error in UI
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsAuthenticating(true);
    setError(null);
    try {
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (googleError) throw googleError;
    } catch (err: any) {
      console.error('Google Auth error:', err);
      setError(err.message || 'Erro ao entrar com Google');
      setIsAuthenticating(false);
    }
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
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} className="shrink-0" />
              <p>{error}</p>
            </div>
          )}

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
                <input 
                  type={passwordVisible ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  className="w-full px-6 py-4 pr-12 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={passwordVisible ? "Hide password" : "Show password"}
                >
                  {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
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
