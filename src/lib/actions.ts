'use server';

import PocketBase from 'pocketbase';
import { revalidatePath } from 'next/cache';

export async function addComment(formData: FormData) {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_API_URL);
  const data = {
    username: formData.get('username'),
    content: formData.get('content'),
  };
  await pb.collection('home_comments_tbl').create(data);
  revalidatePath('/');
}
