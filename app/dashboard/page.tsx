// app/dashboard/page.tsx - Puthu UI-oda
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import DeleteButton from '@/components/DeleteButton';
import { Button, buttonVariants } from "@/components/ui/button"; // Puthusa import panrom
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // Puthusa import panrom

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  user_id: string;
};

export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  const { data: products, error } = await supabase.from('products').select('*');

  if (error) console.error('Error fetching products:', error);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Engal Porutkal</h1>
        <Link href="/products/add" className={buttonVariants({ variant: "default" })}>
          Puthu Porulai Serka
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product: Product) => (
          <Card key={product.id} className="flex flex-col">
            <CardHeader>
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
    </div>
  );
}