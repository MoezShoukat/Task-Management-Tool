import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createTask } from '../api/taskApi';
import type { CreateTaskRequest } from '../types/auth';
import Layout from '../components/Layout';

export default function NewTaskPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<CreateTaskRequest>();

  const onSubmit = async (data: CreateTaskRequest) => {
    setLoading(true);
    setError('');
    try {
      const task = await createTask({
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
        assignedToUserId: data.assignedToUserId || '',
      });
      navigate(`/tasks/${task.id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create task.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    backgroundColor: 'var(--input)',
    borderColor: 'var(--border)',
    color: 'var(--foreground)',
  };

  const labelStyle = { color: 'var(--foreground)' };

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>New Task</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Fill in the details to create a new task</p>
        </div>

        <Card style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <CardHeader className="pb-2">
            <CardTitle style={{ color: 'var(--foreground)' }}>Task Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              <div className="space-y-1.5">
                <Label style={labelStyle}>Title *</Label>
                <Input placeholder="Task title" style={inputStyle}
                  {...register('title', { required: 'Title is required' })} />
                {errors.title && <p className="text-xs" style={{ color: 'var(--destructive)' }}>{errors.title.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label style={labelStyle}>Description</Label>
                <Input placeholder="Task description" style={inputStyle}
                  {...register('description')} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label style={labelStyle}>Priority *</Label>
                  <select
                    className="w-full px-3 py-2 rounded-md border text-sm"
                    style={inputStyle}
                    {...register('priority', { required: 'Priority is required' })}
                  >
                    <option value="">Select priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  {errors.priority && <p className="text-xs" style={{ color: 'var(--destructive)' }}>{errors.priority.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label style={labelStyle}>Category</Label>
                  <Input placeholder="e.g. Work, Personal" style={inputStyle}
                    {...register('category')} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label style={labelStyle}>Due Date</Label>
                  <Input type="date" style={inputStyle}
                    {...register('dueDate')} />
                </div>

                <div className="space-y-1.5">
                  <Label style={labelStyle}>Assign To (User ID)</Label>
                  <Input placeholder="Leave blank to assign to yourself" style={inputStyle}
                    {...register('assignedToUserId')} />
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-sm text-center py-2 px-3 rounded-lg"
                  style={{ backgroundColor: '#FF3B3B22', color: 'var(--destructive)' }}
                >
                  {error}
                </motion.p>
              )}

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={loading}
                  style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                  {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                  {loading ? 'Creating...' : 'Create Task'}
                </Button>
                <Button type="button" variant="outline"
                  onClick={() => navigate('/tasks')}
                  style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                  Cancel
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>
      </motion.div>
    </Layout>
  );
}