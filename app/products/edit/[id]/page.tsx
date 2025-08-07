// app/products/edit/[id]/page.tsx - Puthu UI-oda
'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function EditProductPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProduct = useCallback(async () => {
    if (id) {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (error) {
        alert('Porulin thagavalai edukka mudiyavillai.');
        router.push('/dashboard');
      } else if (data) {
        setName(data.name);
        setDescription(data.description || '');
        setPrice(String(data.price));
      }
      setLoading(false);
    }
  }, [id, supabase, router]);

  useEffect(() => { fetchProduct(); }, [fetchProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('products').update({ name, description, price: Number(price) }).eq('id', id);
    if (error) alert('Error: Porulai thirutha mudiyavillai. ' + error.message);
    else {
      alert('Porul vetrigaramaga thiruthapattathu!');
      router.push('/dashboard');
    }
  };

  if (loading) return <div className="container mx-auto p-4 text-center">Loading...</div>;

  return (
    <div className="container mx-auto p-4 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Porulai Thiruthu</CardTitle>
          <CardDescription>Keela irukum thagavalgalai maatri amaikavum.</CardDescription>
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
            <Button type="submit" className="w-full">Update Seiyavum</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}