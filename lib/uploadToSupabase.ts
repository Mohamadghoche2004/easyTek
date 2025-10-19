import { supabase } from './supabaseClient';

/**
 * Upload a File to Supabase Storage and return its public URL.
 * Bucket must be public or configured to generate signed URLs separately.
 */
export async function uploadToSupabase(
  file: File,
  options?: { bucket?: string; folder?: string; cacheControlSeconds?: number }
): Promise<string> {
  const bucket = options?.bucket || process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'images';
  const folder = options?.folder || 'cds';
  const cacheControl = String(options?.cacheControlSeconds ?? 3600);

  const filePath = `${folder}/${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from(bucket as string)
    .upload(filePath, file, { upsert: false, cacheControl });

  if (error) {
    throw error;
  }

  const { data: pub } = supabase.storage.from(bucket as string).getPublicUrl(data.path);
  return pub.publicUrl;
}


