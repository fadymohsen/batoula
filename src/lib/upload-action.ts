"use server";

import { put } from "@vercel/blob";

export async function uploadFileAction(formData: FormData): Promise<{ success: true; url: string } | { success: false; error: string }> {
  try {
    const file = formData.get("file") as File;
    
    if (!file) {
      return { success: false, error: "لم يتم اختيار ملف" };
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return { success: false, error: "BLOB_READ_WRITE_TOKEN is missing in Vercel settings" };
    }

    const blob = await put(file.name, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return { success: true, url: blob.url };
  } catch (error: any) {
    console.error("Upload action failed:", error);
    return { success: false, error: error.message || "فشل الرفع إلى Vercel Blob" };
  }
}
