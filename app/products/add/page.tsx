'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function AddProductPage() {
  const supabase = createClient();
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      toast.error('Login seithaal mattume porulai serka mudiyum.');
      router.push('/login');
      setIsSubmitting(false);
      return;
    }

    let imageUrl = null;
    if (imageFile) {
      const filePath = `${user.id}/${Date.now()}_${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('product_images')
        .upload(filePath, imageFile);

      if (uploadError) {
        toast.error('Error: Padathai upload seiya mudiyavillai.', {
          description: uploadError.message,
        });
        setIsSubmitting(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('product_images')
        .getPublicUrl(filePath);
      
      imageUrl = publicUrlData.publicUrl;
    }

    const { error: insertError } = await supabase.from('products').insert({
      name,
      description,
      price: Number(price),
      user_id: user.id,
      image_url: imageUrl,
    });

    if (insertError) {
      toast.error('Error: Porulai serka mudiyavillai.', {
        description: insertError.message,
      });
    } else {
      toast.success('Porul vetrigaramaga serkapattathu!');
      router.push('/dashboard');
      router.refresh();
    }
    setIsSubmitting(false);
  };

  return (
    <main className="container mx-auto p-4 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Puthu Porulai Uruvaku</CardTitle>
          <CardDescription>Keela irukum thagavalgalai nirapavum.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label htmlFor="image">Porulin Padam</Label>
              <Input id="image" type="file" onChange={handleImageChange} accept="image/*" disabled={isSubmitting} />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Sertukondirukirathu...' : 'Serka'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
