
import React from 'react';
import { AppView } from '../types';
import { 
  LayoutDashboard, 
  BookOpen, 
  PlusCircle, 
  LogOut, 
  Settings,
  HelpCircle
} from 'lucide-react';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  onLogout: () => void;
  isAdmin: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onLogout, isAdmin }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-courses', label: 'Meus Cursos', icon: BookOpen },
  ];

  if (isAdmin) {
    menuItems.push({ id: 'admin', label: 'Gerenciar', icon: PlusCircle });
  }

  return (
    <aside className="w-20 md:w-64 bg-white border-r border-slate-200 flex flex-col h-full transition-all">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg text-white">
          <BookOpen size={24} />
        </div>
        <span className="font-bold text-xl text-slate-800 hidden md:block">Mestria</span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const isActive = currentView === item.id || (item.id === 'dashboard' && currentView === 'course-detail');
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id as AppView)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-indigo-50 text-indigo-600 font-semibold' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <item.icon size={22} />
              <span className="hidden md:block">{item.label}</span>
              {isActive && <div className="ml-auto w-1.5 h-1.5 bg-indigo-600 rounded-full hidden md:block"></div>}
            </button>
          );
        })}
      </nav>

      <div className="px-4 py-6 border-t border-slate-100 space-y-2">
        <button className="w-full flex items-center gap-3 p-3 text-slate-500 hover:bg-slate-50 rounded-xl transition-all">
          <Settings size={22} />
          <span className="hidden md:block">Ajustes</span>
        </button>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
        >
          <LogOut size={22} />
          <span className="hidden md:block">Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
