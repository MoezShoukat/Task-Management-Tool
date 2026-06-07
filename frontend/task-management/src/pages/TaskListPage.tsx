import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Trash2, Eye, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getTasks, deleteTask } from '../api/taskApi';
import type { TaskDto } from '../types/auth';
import Layout from '../components/Layout';

const priorityColor: Record<string, string> = {
  Low: '#10B981',
  Medium: '#F59E0B',
  High: '#FF3B3B',
};

const statusColor: Record<string, string> = {
  Pending: '#F59E0B',
  InProgress: '#3B82F6',
  Completed: '#10B981',
};

export default function TaskListPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [filtered, setFiltered] = useState<TaskDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  useEffect(() => {
    getTasks()
      .then((data) => { setTasks(data); setFiltered(data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = tasks;
    if (statusFilter !== 'All') result = result.filter(t => t.status === statusFilter);
    if (priorityFilter !== 'All') result = result.filter(t => t.priority === priorityFilter);
    setFiltered(result);
  }, [statusFilter, priorityFilter, tasks]);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this task?')) return;
    await deleteTask(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const filterBtn = (label: string, active: string, setActive: (v: string) => void) => (
    <button
      key={label}
      onClick={() => setActive(label)}
      className="px-3 py-1 rounded-full text-xs font-medium transition-colors"
      style={{
        backgroundColor: active === label ? 'var(--primary)' : 'var(--muted)',
        color: active === label ? 'white' : 'var(--muted-foreground)',
      }}
    >
      {label}
    </button>
  );

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Tasks</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
              {filtered.length} task{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button
            onClick={() => navigate('/tasks/new')}
            style={{ backgroundColor: 'var(--primary)', color: 'white' }}
          >
            <Plus size={16} className="mr-1.5" /> New Task
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter size={14} style={{ color: 'var(--muted-foreground)' }} />
            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Status:</span>
            {['All', 'Pending', 'InProgress', 'Completed'].map(s => filterBtn(s, statusFilter, setStatusFilter))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Priority:</span>
            {['All', 'Low', 'Medium', 'High'].map(s => filterBtn(s, priorityFilter, setPriorityFilter))}
          </div>
        </div>

        {/* Task List */}
        {loading ? (
          <p style={{ color: 'var(--muted-foreground)' }}>Loading tasks...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p style={{ color: 'var(--muted-foreground)' }}>No tasks found.</p>
            <Button
              className="mt-4"
              onClick={() => navigate('/tasks/new')}
              style={{ backgroundColor: 'var(--primary)', color: 'white' }}
            >
              Create your first task
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                  <CardContent className="py-4 px-5">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ backgroundColor: statusColor[task.status] + '22', color: statusColor[task.status] }}
                          >
                            {task.status}
                          </span>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ backgroundColor: priorityColor[task.priority] + '22', color: priorityColor[task.priority] }}
                          >
                            {task.priority}
                          </span>
                          {task.category && (
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                              {task.category}
                            </span>
                          )}
                        </div>
                        <p className="font-semibold truncate" style={{ color: 'var(--foreground)' }}>{task.title}</p>
                        <p className="text-sm truncate mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{task.description}</p>
                        {task.dueDate && (
                          <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/tasks/${task.id}`)}
                          style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                        >
                          <Eye size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(task.id)}
                          style={{ borderColor: 'var(--border)', color: 'var(--destructive)' }}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </Layout>
  );
}