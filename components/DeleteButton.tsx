// components/DeleteButton.tsx
'use client';

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function DeleteButton({ productId }: { productId: number }) {
  const supabase = createClient();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm('Indha porulai neekividava?')) {
      setIsDeleting(true);
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) {
        alert('Error: Porulai neeka mudiyavillai. ' + error.message);
      } else {
        alert('Porul vetrigaramaga neekapattathu!');
        router.refresh();
      }
      setIsDeleting(false);
    }
  };

  return (
    <Button onClick={handleDelete} variant="destructive" disabled={isDeleting}>
      {isDeleting ? 'Neekukirathu...' : 'Delete'}
    </Button>
  );
}
