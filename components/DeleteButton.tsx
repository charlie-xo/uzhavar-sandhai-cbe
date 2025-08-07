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
