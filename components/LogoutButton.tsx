'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { toast } from 'sonner';

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Vetrigaramaga veliyerinirgal!");
    router.push('/');
    router.refresh();
  };

  return (
    <Button onClick={handleLogout} variant="ghost">
      Logout
    </Button>
  );
}