import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft, Pencil, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTaskById, updateTask } from '../api/taskApi';
import type { TaskDto, UpdateTaskRequest } from '../types/auth';
import Layout from '../components/Layout';

const priorityColor: Record<string, string> = { Low: '#10B981', Medium: '#F59E0B', High: '#FF3B3B' };
const statusColor: Record<string, string> = { Pending: '#F59E0B', InProgress: '#3B82F6', Completed: '#10B981' };

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<TaskDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, reset } = useForm<UpdateTaskRequest>();

  useEffect(() => {
    if (!id) return;
    getTaskById(Number(id))
      .then((data) => { setTask(data); reset(data as any); })
      .catch(() => navigate('/tasks'))
      .finally(() => setLoading(false));
  }, [id]);

  const onSubmit = async (data: UpdateTaskRequest) => {
    if (!task) return;
    setSaving(true);
    setError('');
    try {
      const updated = await updateTask(task.id, {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
      });
      setTask(updated);
      setEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update task.');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = { backgroundColor: 'var(--input)', borderColor: 'var(--border)', color: 'var(--foreground)' };
  const labelStyle = { color: 'var(--foreground)' };

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center h-64">
        <Loader2 size={24} className="animate-spin" style={{ color: 'var(--primary)' }} />
      </div>
    </Layout>
  );

  if (!task) return null;

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-2xl">

        <button onClick={() => navigate('/tasks')} className="flex items-center gap-2 text-sm mb-6 transition-colors"
          style={{ color: 'var(--muted-foreground)' }}>
          <ArrowLeft size={16} /> Back to Tasks
        </button>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Task Detail</h1>
          {!editing ? (
            <Button variant="outline" onClick={() => setEditing(true)}
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
              <Pencil size={14} className="mr-1.5" /> Edit
            </Button>
          ) : (
            <Button variant="outline" onClick={() => { setEditing(false); reset(task as any); }}
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
              <X size={14} className="mr-1.5" /> Cancel
            </Button>
          )}
        </div>

        <Card style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: statusColor[task.status] + '22', color: statusColor[task.status] }}>
                {task.status}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: priorityColor[task.priority] + '22', color: priorityColor[task.priority] }}>
                {task.priority}
              </span>
            </div>
            <CardTitle className="mt-2" style={{ color: 'var(--foreground)' }}>{task.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {!editing ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Description</p>
                  <p style={{ color: 'var(--foreground)' }}>{task.description || '—'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Category</p>
                    <p style={{ color: 'var(--foreground)' }}>{task.category || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Due Date</p>
                    <p style={{ color: 'var(--foreground)' }}>
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Assigned To</p>
                    <p style={{ color: 'var(--foreground)' }}>{task.assignedToName || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Created By</p>
                    <p style={{ color: 'var(--foreground)' }}>{task.createdByName || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Created At</p>
                    <p style={{ color: 'var(--foreground)' }}>{new Date(task.createdAt).toLocaleDateString()}</p>
                  </div>
                  {task.updatedAt && (
                    <div>
                      <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>Last Updated</p>
                      <p style={{ color: 'var(--foreground)' }}>{new Date(task.updatedAt).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label style={labelStyle}>Title</Label>
                  <Input style={inputStyle} {...register('title', { required: true })} />
                </div>
                <div className="space-y-1.5">
                  <Label style={labelStyle}>Description</Label>
                  <Input style={inputStyle} {...register('description')} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label style={labelStyle}>Priority</Label>
                    <select className="w-full px-3 py-2 rounded-md border text-sm" style={inputStyle} {...register('priority')}>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label style={labelStyle}>Status</Label>
                    <select className="w-full px-3 py-2 rounded-md border text-sm" style={inputStyle} {...register('status')}>
                      <option value="Pending">Pending</option>
                      <option value="InProgress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label style={labelStyle}>Category</Label>
                    <Input style={inputStyle} {...register('category')} />
                  </div>
                  <div className="space-y-1.5">
                    <Label style={labelStyle}>Due Date</Label>
                    <Input type="date" style={inputStyle} {...register('dueDate')} />
                  </div>
                </div>
                {error && (
                  <p className="text-sm py-2 px-3 rounded-lg"
                    style={{ backgroundColor: '#FF3B3B22', color: 'var(--destructive)' }}>{error}</p>
                )}
                <Button type="submit" disabled={saving}
                  style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                  {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : <Check size={16} className="mr-2" />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </Layout>
  );
}