
import React from 'react';
import { User, AppView } from '../types';
import { Bell, LogOut, LayoutDashboard, BookOpen, PlusCircle } from 'lucide-react';

interface NavbarProps {
  user: User;
  currentView: AppView;
  setView: (view: AppView) => void;
  onLogout: () => void;
  isAdmin: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ user, currentView, setView, onLogout, isAdmin }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-courses', label: 'Meus Cursos', icon: BookOpen },
  ];

  if (isAdmin) {
    menuItems.push({ id: 'admin', label: 'Gerenciar', icon: PlusCircle });
  }

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
            <BookOpen size={20} />
          </div>
          <span className="font-bold text-lg text-slate-800">Mestria</span>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {menuItems.map((item) => {
            const isActive = currentView === item.id || (item.id === 'dashboard' && currentView === 'course-detail');
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id as AppView)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
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

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-200 mx-2"></div>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-800 leading-none">{user.name}</p>
            <p className="text-xs text-slate-500 mt-1 capitalize">{user.role}</p>
          </div>
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full border-2 border-indigo-100 object-cover"
          />
          <button 
            onClick={onLogout}
            className="ml-2 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Sair"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
