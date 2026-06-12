"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Upload, X, Loader2, AlertCircle } from "lucide-react";

type Props = {
  vehicleId?: string;
  images: string[];
  onChange: (urls: string[]) => void;
};

export default function ImageUploader({ vehicleId, images, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFiles = async (files: FileList) => {
    if (files.length === 0) return;
    if (images.length + files.length > 20) {
      alert("Máximo 20 imágenes por vehículo");
      return;
    }

    setUploading(true);
    setErrors([]);
    const newUrls: string[] = [];
    const newErrors: string[] = [];
    const folder = vehicleId ?? `tmp_${Date.now()}`;

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (!["jpg", "jpeg", "png", "webp", "gif"].includes(ext ?? "")) {
        newErrors.push(`${file.name}: formato no soportado`);
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        newErrors.push(`${file.name}: supera 10 MB`);
        continue;
      }

      const path = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabase.storage.from("fotos").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

      if (error) {
        newErrors.push(`${file.name}: ${error.message}`);
      } else {
        const { data } = supabase.storage.from("fotos").getPublicUrl(path);
        newUrls.push(data.publicUrl);
      }
    }

    onChange([...images, ...newUrls]);
    setErrors(newErrors);
    setUploading(false);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) uploadFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) uploadFiles(e.dataTransfer.files);
  };

  const remove = (url: string) => {
    onChange(images.filter((u) => u !== url));
  };

  const moveFirst = (url: string) => {
    onChange([url, ...images.filter((u) => u !== url)]);
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          dragOver ? "border-accent bg-accent/5" : "border-gray-200 hover:border-accent hover:bg-gray-50"
        }`}
      >
        {uploading ? (
          <div className="flex items-center justify-center gap-2 text-accent">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm font-medium">Subiendo imágenes...</span>
          </div>
        ) : (
          <>
            <Upload size={24} className="text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">
              Arrastra imágenes o pulsa para seleccionar
            </p>
            <p className="text-xs text-gray-400 mt-1">
              JPG, PNG, WEBP · Máx 10 MB por imagen · {images.length}/20 subidas
            </p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleInput}
        />
      </div>

      {/* Upload errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-1">
          {errors.map((e, i) => (
            <div key={i} className="flex items-center gap-2 text-red-600 text-xs">
              <AlertCircle size={13} />
              {e}
            </div>
          ))}
        </div>
      )}

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {images.map((url, i) => (
            <div key={url} className="relative group rounded-lg overflow-hidden aspect-square bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Imagen ${i + 1}`} className="w-full h-full object-cover" />

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                {i !== 0 && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); moveFirst(url); }}
                    className="bg-white/90 text-gray-800 text-xs px-1.5 py-1 rounded font-medium hover:bg-white"
                  >
                    Principal
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); remove(url); }}
                  className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              </div>

              {i === 0 && (
                <span className="absolute top-1 left-1 bg-accent text-white text-xs px-1.5 py-0.5 rounded font-semibold">
                  Principal
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
