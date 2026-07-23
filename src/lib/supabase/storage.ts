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

  // Always send Blob/Uint8Array — passing Node Buffer can be stringified as
  // UTF-8 by storage-js, corrupting binary (U+FFFD / ef bf bd in the file).
  const bytes = new Uint8Array(file);
  const body = new Blob([bytes], { type: contentType });

  const { error } = await supabase.storage.from(bucket).upload(path, body, {
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
