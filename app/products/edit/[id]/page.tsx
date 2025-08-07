// app/products/edit/[id]/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
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
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        setCurrentImageUrl(data.image_url);
      }
      setLoading(false);
    }
  }, [id, supabase, router]);

  useEffect(() => { fetchProduct(); }, [fetchProduct]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        alert('Login seiyavum.');
        setIsSubmitting(false);
        return;
    }

    let imageUrl = currentImageUrl;
    if (imageFile) {
      const filePath = `${user.id}/${Date.now()}_${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('product_images')
        .upload(filePath, imageFile);

      if (uploadError) {
        alert('Error: Puthu padathai upload seiya mudiyavillai. ' + uploadError.message);
        setIsSubmitting(false);
        return;
      }
      
      const { data: publicUrlData } = supabase.storage.from('product_images').getPublicUrl(filePath);
      imageUrl = publicUrlData.publicUrl;
    }

    const { error } = await supabase.from('products').update({ name, description, price: Number(price), image_url: imageUrl }).eq('id', id);
    if (error) {
      alert('Error: Porulai thirutha mudiyavillai. ' + error.message);
    } else {
      alert('Porul vetrigaramaga thiruthapattathu!');
      router.push('/dashboard');
      router.refresh();
    }
    setIsSubmitting(false);
  };

  if (loading) return <main className="container mx-auto p-4 text-center">Loading...</main>;

  return (
    <main className="container mx-auto p-4 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Porulai Thiruthu</CardTitle>
          <CardDescription>Keela irukum thagavalgalai maatri amaikavum.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {currentImageUrl && (
              <div className="relative w-full h-48 mb-4">
                <Image src={currentImageUrl} alt="Current product image" layout="fill" objectFit="cover" className="rounded-md" />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Porulin Peyar</Label>
              <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required disabled={isSubmitting} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Vivaram</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} disabled={isSubmitting} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Vilai (₹)</Label>
              <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required disabled={isSubmitting} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Puthu Padathai Maatru</Label>
              <Input id="image" type="file" onChange={handleImageChange} accept="image/*" disabled={isSubmitting} />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Update Seikirean...' : 'Update Seiyavum'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
