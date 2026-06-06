import { motion } from 'framer-motion';
import { User, Mail, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-lg">
        <div className="mb-6">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Profile</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Your account information</p>
        </div>

        <Card style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
          <CardContent className="pt-6">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-3"
                style={{ backgroundColor: 'var(--primary)' }}>
                <User size={36} color="white" />
              </div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>
                {user?.firstName} {user?.lastName}
              </h2>
              <span className="text-xs px-3 py-1 rounded-full mt-2 font-medium"
                style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                {user?.role}
              </span>
            </div>

            {/* Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                <Mail size={18} style={{ color: 'var(--muted-foreground)' }} />
                <div>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Email</p>
                  <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--muted)' }}>
                <Shield size={18} style={{ color: 'var(--muted-foreground)' }} />
                <div>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Role</p>
                  <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{user?.role}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Layout>
  );
}