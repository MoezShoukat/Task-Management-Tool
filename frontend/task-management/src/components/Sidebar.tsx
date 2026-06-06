import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ListTodo, PlusCircle, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tasks', icon: ListTodo, label: 'Tasks' },
  { to: '/tasks/new', icon: PlusCircle, label: 'New Task' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-56 flex flex-col py-6 px-3 border-r z-10"
      style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-3 mb-8">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          <ListTodo size={16} color="white" />
        </div>
        <span className="font-bold text-base" style={{ color: 'var(--foreground)' }}>
          TaskManager
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'text-white' : ''
              }`
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'var(--primary)' : 'transparent',
              color: isActive ? 'white' : 'var(--muted-foreground)',
            })}
          >
            <item.icon size={17} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full"
        style={{ color: 'var(--muted-foreground)' }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--destructive)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted-foreground)')}
      >
        <LogOut size={17} />
        Logout
      </button>
    </aside>
  );
}