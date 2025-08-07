import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Leaf } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="container mx-auto px-4">
      <section className="flex flex-col items-center justify-center text-center py-20 md:py-32">
        <Leaf className="h-16 w-16 text-green-600 mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Coimbatore-in Uzhavar Sandhai-ku Vanakkam!
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Engal moolam, Coimbatore vivasaayigal thangaludaiya nalla, taja kaaikarigalaiyum porutkalaiyum neradiyaga ungalukku kondu varugiraargal.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/dashboard" className={buttonVariants({ size: 'lg' })}>
            Sandhaiku Sel
          </Link>
          <Link href="/signup" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
            Vivasaayiyaaga Inai
          </Link>
        </div>
      </section>
    </main>
  );
}
