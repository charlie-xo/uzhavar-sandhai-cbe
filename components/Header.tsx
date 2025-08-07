import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import LogoutButton from './LogoutButton';
import { buttonVariants } from './ui/button';
import { Leaf } from 'lucide-react';

export default async function Header() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Leaf className="h-6 w-6 text-green-600" />
          <span className="font-bold">Uzhavar Sandhai</span>
        </Link>
        <nav className="flex flex-1 items-center space-x-4">
          {/* Add other nav links here if needed */}
        </nav>
        <div className="flex items-center justify-end space-x-2">
          {user ? (
            <>
              <Link href="/dashboard" className={buttonVariants({ variant: 'ghost' })}>
                Dashboard
              </Link>
              <Link href="/products/add" className={buttonVariants({ variant: 'default' })}>
                Puthu Porul
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className={buttonVariants({ variant: 'ghost' })}>
                Login
              </Link>
              <Link href="/signup" className={buttonVariants({ variant: 'default' })}>
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}