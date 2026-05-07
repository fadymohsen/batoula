"use client";

import { useState } from "react";
import { Upload, Loader2, Check } from "lucide-react";

export default function CMSImageUpload({ 
  currentValue, 
  onUploadComplete 
}: { 
  currentValue: string; 
  onUploadComplete: (url: string) => void 
}) {
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await fetch(
        `/api/upload?filename=${file.name}`,
        {
          method: 'POST',
          body: file,
        },
      );

      const newBlob = await response.json();
      onUploadComplete(newBlob.url);
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    } catch (error) {
      console.error("Upload failed", error);
      alert("فشل الرفع، يرجى المحاولة مرة أخرى");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mt-4">
      <label className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors w-fit shadow-sm">
        {uploading ? (
          <Loader2 size={18} className="animate-spin text-[#b48a66]" />
        ) : done ? (
          <Check size={18} className="text-green-600" />
        ) : (
          <Upload size={18} className="text-gray-400" />
        )}
        <span className="text-sm font-bold text-[#2c2825]">
          {uploading ? 'جاري الرفع...' : done ? 'تم الرفع بنجاح' : 'رفع صورة جديدة'}
        </span>
        <input type="file" className="hidden" onChange={handleUpload} accept="image/*" disabled={uploading} />
      </label>
    </div>
  );
}
