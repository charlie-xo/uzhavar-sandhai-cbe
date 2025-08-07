// app/dashboard/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import DeleteButton from '@/components/DeleteButton';
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from 'next/navigation';

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  user_id: string;
  image_url: string | null;
};

export default async function Dashboard() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Puthu check: User login pannalana, avangala login page-ku anupidalam
  if (!user) {
    return redirect('/login');
  }

  const { data: products, error } = await supabase.from('products').select('*');

  if (error) {
    console.error('Error fetching products:', error);
    return <main className="container mx-auto p-4"><p>Error: Porutkalai edukka mudiyavillai. Page-a refresh panni paarunga.</p></main>;
  }

  return (
    <main className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Engal Porutkal</h1>
      </header>
      
      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: Product) => (
            <Card key={product.id} className="flex flex-col">
              <CardHeader>
                {product.image_url ? (
                  <div className="relative w-full h-48 mb-4">
                    <Image 
                      src={product.image_url} 
                      alt={product.name} 
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: 'cover' }}
                      className="rounded-t-lg"
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-48 mb-4 bg-secondary rounded-t-lg flex items-center justify-center">
                    <span className="text-muted-foreground">No Image</span>
                  </div>
                )}
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>₹{product.price}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p>{product.description}</p>
              </CardContent>
              {user && user.id === product.user_id && (
                <CardFooter className="flex justify-end gap-2">
                  <Link href={`/products/edit/${product.id}`} className={buttonVariants({ variant: "outline" })}>
                    Edit
                  </Link>
                  <DeleteButton productId={product.id} />
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Innum entha porulum serkapadavillai.</p>
        </div>
      )}
    </main>
  );
}
