"use server";

import { put } from "@vercel/blob";

export async function uploadFileAction(formData: FormData) {
  const file = formData.get("file") as File;
  
  if (!file) {
    throw new Error("لم يتم اختيار ملف");
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is missing");
  }

  try {
    const blob = await put(file.name, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return { url: blob.url };
  } catch (error: any) {
    console.error("Upload action failed:", error);
    throw new Error(error.message || "فشل الرفع إلى Vercel Blob");
  }
}
