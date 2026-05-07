"use client";

import { useState } from "react";
import { Save, Info, Type, Image as ImageIcon, User, Layout } from "lucide-react";
import Image from "next/image";
import CMSImageUpload from "./CMSImageUpload";

const ICON_MAP: Record<string, any> = {
  info: Info,
  type: Type,
  image: ImageIcon,
  user: User,
  layout: Layout
};

export default function CMSItemForm({ 
  item, 
  saveAction 
}: { 
  item: any; 
  saveAction: (formData: FormData) => Promise<void> 
}) {
  const [value, setValue] = useState(item.value);
  const Icon = ICON_MAP[item.config.icon] || Layout;

  return (
    <div className="bg-white p-8 rounded-[24px] shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left: Info */}
        <div className="lg:w-1/3 space-y-3">
          <div className="flex items-center gap-2 text-[#b48a66]">
            <Icon size={16} />
            <span className="text-xs font-black uppercase tracking-wider">{item.key}</span>
          </div>
          <h3 className="text-lg font-bold text-[#2c2825]">{item.config.label}</h3>
          <p className="text-sm text-gray-400 font-medium">
            {item.type === 'IMAGE' ? 'قم برفع صورة جديدة أو تعديل الرابط مباشرة' : 'قم بتعديل النص كما سيظهر للمستخدمين'}
          </p>
          
          {item.type === 'IMAGE' && value && (
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-gray-100 mt-4 shadow-inner bg-gray-50">
              <Image src={value} alt={item.key} fill className="object-cover" unoptimized />
            </div>
          )}

          {item.type === 'IMAGE' && (
            <CMSImageUpload 
              currentValue={value} 
              onUploadComplete={(url) => setValue(url)} 
            />
          )}
        </div>

        {/* Right: Form */}
        <div className="lg:w-2/3">
          <form action={saveAction} className="h-full flex flex-col">
            <input type="hidden" name="id" value={item.id} />
            <div className="flex-1">
              {item.type === 'TEXT' ? (
                <textarea 
                  name="value" 
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  rows={item.key.includes('description') ? 6 : 2}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-base font-medium focus:ring-2 focus:ring-[#b48a66]/20 focus:border-[#b48a66] outline-none transition-all resize-none"
                />
              ) : (
                <input 
                  name="value" 
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-[#b48a66]/20 focus:border-[#b48a66] outline-none transition-all text-left" 
                  dir="ltr"
                />
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button type="submit" className="flex items-center gap-2 bg-[#2c2825] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#b48a66] transition-all shadow-lg shadow-black/5 active:scale-95">
                <Save size={18} />
                حفظ التعديلات
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
