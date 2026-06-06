import { motion } from 'framer-motion';
import { LogOut, CheckSquare, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'var(--primary)' }}>
            <CheckSquare size={16} color="white" />
          </div>
          <span className="font-bold text-lg" style={{ color: 'var(--foreground)' }}>
            Task Manager
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            {user?.firstName} {user?.lastName}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
          >
            <LogOut size={14} className="mr-1.5" />
            Logout
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-10">

        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
            Welcome back, {user?.firstName} 👋
          </h2>
          <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Here's your workspace overview
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
        >
          {[
            { label: 'Pending', count: 0, color: '#F59E0B' },
            { label: 'In Progress', count: 0, color: '#3B82F6' },
            { label: 'Completed', count: 0, color: '#10B981' },
          ].map((stat) => (
            <Card key={stat.label}
              style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <CardContent className="pt-5 pb-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold mt-1" style={{ color: 'var(--foreground)' }}>
                      {stat.count}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: stat.color + '22' }}>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stat.color }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--primary)' }}>
                  <User size={20} color="white" />
                </div>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--foreground)' }}>
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    {user?.email}
                  </p>
                  <span className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block"
                    style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                    {user?.role}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </main>
    </div>
  );
}