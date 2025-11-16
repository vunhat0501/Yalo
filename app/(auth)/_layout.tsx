import { useAuth } from '@/providers/AuthProvide';
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
  const { user } = useAuth();

  if (user) {
    return <Redirect href="/home" />;
  }

  return <Stack />;
}
