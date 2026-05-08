import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Loader2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { registerUser } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import type { RegisterRequest } from '../types/auth';

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterRequest>();

  const onSubmit = async (data: RegisterRequest) => {
    setLoading(true);
    setError('');
    try {
      const response = await registerUser(data);
      login(response);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
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
            <UserPlus size={22} color="white" />
          </motion.div>
          <h1 className="text-2xl font-bold tracking-tight"
            style={{ color: 'var(--foreground)' }}>
            Task Manager
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Create your account
          </p>
        </div>

        <Card style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <CardHeader className="pb-4">
            <CardTitle style={{ color: 'var(--foreground)' }}>Get started</CardTitle>
            <CardDescription style={{ color: 'var(--muted-foreground)' }}>
              Fill in your details to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label style={{ color: 'var(--foreground)' }}>First Name</Label>
                  <Input
                    placeholder="John"
                    style={{ backgroundColor: 'var(--input)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                    {...register('firstName', { required: 'Required' })}
                  />
                  {errors.firstName && <p className="text-xs" style={{ color: 'var(--destructive)' }}>{errors.firstName.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label style={{ color: 'var(--foreground)' }}>Last Name</Label>
                  <Input
                    placeholder="Doe"
                    style={{ backgroundColor: 'var(--input)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                    {...register('lastName', { required: 'Required' })}
                  />
                  {errors.lastName && <p className="text-xs" style={{ color: 'var(--destructive)' }}>{errors.lastName.message}</p>}
                </div>
              </div>

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
                  placeholder="Min. 8 characters"
                  style={{ backgroundColor: 'var(--input)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Minimum 8 characters' }
                  })}
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
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>

              <p className="text-center text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Already have an account?{' '}
                <Link to="/login"
                  className="font-medium hover:underline"
                  style={{ color: 'var(--primary)' }}>
                  Sign in
                </Link>
              </p>

            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}