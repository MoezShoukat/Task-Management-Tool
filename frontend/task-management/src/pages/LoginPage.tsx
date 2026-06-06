import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Loader2, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { loginUser } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import type { LoginRequest } from '../types/auth';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>();

  const onSubmit = async (data: LoginRequest) => {
    setLoading(true);
    setError('');
    try {
      const response = await loginUser(data);
      login(response);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: 'var(--background)' }}>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            <LogIn size={22} color="white" />
          </motion.div>
          <h1 className="text-2xl font-bold tracking-tight"
            style={{ color: 'var(--foreground)' }}>
            Task Manager
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Sign in to your workspace
          </p>
        </div>

        <Card style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <CardHeader className="pb-4">
            <CardTitle style={{ color: 'var(--foreground)' }}>Welcome back</CardTitle>
            <CardDescription style={{ color: 'var(--muted-foreground)' }}>
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              <div className="space-y-1.5">
                <Label style={{ color: 'var(--foreground)' }}>Email</Label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  style={{ backgroundColor: 'var(--input)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  {...register('email', { required: 'Email is required' })}
                />
                {errors.email && <p className="text-xs" style={{ color: 'var(--destructive)' }}>{errors.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label style={{ color: 'var(--foreground)' }}>Password</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  style={{ backgroundColor: 'var(--input)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  {...register('password', { required: 'Password is required' })}
                />
                {errors.password && <p className="text-xs" style={{ color: 'var(--destructive)' }}>{errors.password.message}</p>}
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-center py-2 px-3 rounded-lg"
                  style={{ backgroundColor: '#FF3B3B22', color: 'var(--destructive)' }}
                >
                  {error}
                </motion.p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full font-semibold"
                style={{ backgroundColor: 'var(--primary)', color: 'white' }}
              >
                {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              <p className="text-center text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Don't have an account?{' '}
                <Link to="/register"
                  className="font-medium hover:underline"
                  style={{ color: 'var(--primary)' }}>
                  Create one
                </Link>
              </p>

            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}