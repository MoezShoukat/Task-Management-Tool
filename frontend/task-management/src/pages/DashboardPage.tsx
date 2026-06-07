import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, ListTodo } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';
import { getTaskSummary } from '../api/taskApi';
import type { TaskSummaryDto } from '../types/auth';
import Layout from '../components/Layout';

export default function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<TaskSummaryDto>({ pending: 0, inProgress: 0, completed: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTaskSummary()
      .then(setSummary)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Pending', value: summary.pending, icon: AlertCircle, color: '#F59E0B' },
    { label: 'In Progress', value: summary.inProgress, icon: Clock, color: '#3B82F6' },
    { label: 'Completed', value: summary.completed, icon: CheckCircle, color: '#10B981' },
    { label: 'Total', value: summary.total, icon: ListTodo, color: '#FF3B3B' },
  ];

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
            Welcome back, {user?.firstName} 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            {user?.role === 'Admin' ? 'Showing all tasks across the system' : 'Showing your personal task overview'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Card style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{stat.label}</p>
                      <p className="text-3xl font-bold mt-1" style={{ color: 'var(--foreground)' }}>
                        {loading ? '—' : stat.value}
                      </p>
                    </div>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: stat.color + '22' }}
                    >
                      <stat.icon size={20} style={{ color: stat.color }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Layout>
  );
}