import { createClient } from "@supabase/supabase-js";

export function createStorageClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

export async function uploadToStorage(
  file: Buffer,
  path: string,
  contentType: string
): Promise<{ url: string; path: string }> {
  const supabase = createStorageClient();
  const bucket = "media";

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType,
    upsert: true,
  });

  if (error) throw new Error(error.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);

  return { url: publicUrl, path };
}

export async function deleteFromStorage(path: string): Promise<void> {
  const supabase = createStorageClient();
  await supabase.storage.from("media").remove([path]);
}
