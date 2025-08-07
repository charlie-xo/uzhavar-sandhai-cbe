// app/products/add/page.tsx - Puthu UI-oda
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'; // Puthusa import panrom
import { Input } from '@/components/ui/input'; // Puthusa import panrom
import { Label } from '@/components/ui/label'; // Puthusa import panrom
import { Textarea } from '@/components/ui/textarea'; // Puthusa import panrom
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AddProductPage() {
  const supabase = createClient();
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase.from('products').insert({
        name, description, price: Number(price), user_id: user.id,
      });
      if (error) alert('Error: Porulai serka mudiyavillai. ' + error.message);
      else {
        alert('Porul vetrigaramaga serkapattathu!');
        router.push('/dashboard');
      }
    } else {
      alert('Login seithaal mattume porulai serka mudiyum.');
      router.push('/login');
    }
  };

  return (
    <div className="container mx-auto p-4 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Puthu Porulai Uruvaku</CardTitle>
          <CardDescription>Keela irukum thagavalgalai nirapavum.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Porulin Peyar</Label>
              <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Vivaram</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Vilai (₹)</Label>
              <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full">
              Serka
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

6.3 - Porulai Thiruthuvathu & Neekuvathu (Edit & Delete)
6.3.1 - Delete Button Component
components/DeleteButton.tsx file-la, variant="destructive" use panni button-a red color-la kaatrom.

// components/DeleteButton.tsx - Puthu UI-oda
'use client';

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // Puthusa import panrom

export default function DeleteButton({ productId }: { productId: number }) {
  const supabase = createClient();
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm('Indha porulai neekividava?')) {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) alert('Error: Porulai neeka mudiyavillai. ' + error.message);
      else {
        alert('Porul vetrigaramaga neekapattathu!');
        router.refresh();
      }
    }
  };

  return (
    <Button onClick={handleDelete} variant="destructive">
      Delete
    </Button>
  );
}
