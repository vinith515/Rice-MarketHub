"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, Loader2, Box, Film, ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  saveProductImageAction,
  saveProduct3DAssetAction,
  saveBrandLogoAction,
  saveGalleryItemAction,
} from "@/app/admin/media-actions";

type Bucket = "product-images" | "product-models" | "gallery" | "site-media";

type Props = {
  bucket: Bucket;
  accept: string;
  label: string;
  hint?: string;
  productId?: string;
  brandId?: string;
  mode:
    | "product-image"
    | "product-3d"
    | "product-video"
    | "product-poster"
    | "brand-logo"
    | "gallery";
  currentUrl?: string | null;
  onSuccess?: (url: string) => void;
};

export function MediaUploader({
  bucket,
  accept,
  label,
  hint,
  productId,
  brandId,
  mode,
  currentUrl,
  onSuccess,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setSuccess(null);
    setUploading(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Please log in again to upload files.");
      }

      const ext = file.name.split(".").pop() ?? "bin";
      const folder =
        productId ?? brandId ?? "general";
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: true, cacheControl: "3600" });

      if (uploadError) throw new Error(uploadError.message);

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(path);

      if (mode === "product-image" && productId) {
        const res = await saveProductImageAction(productId, publicUrl, file.name);
        if (res.error) throw new Error(res.error);
      } else if (mode === "product-3d" && productId) {
        const res = await saveProduct3DAssetAction(productId, { glb_url: publicUrl });
        if (res.error) throw new Error(res.error);
      } else if (mode === "product-video" && productId) {
        const res = await saveProduct3DAssetAction(productId, { video_url: publicUrl });
        if (res.error) throw new Error(res.error);
      } else if (mode === "product-poster" && productId) {
        const res = await saveProduct3DAssetAction(productId, { poster_url: publicUrl });
        if (res.error) throw new Error(res.error);
      } else if (mode === "brand-logo" && brandId) {
        const res = await saveBrandLogoAction(brandId, publicUrl);
        if (res.error) throw new Error(res.error);
      } else if (mode === "gallery") {
        const res = await saveGalleryItemAction(publicUrl, file.name);
        if (res.error) throw new Error(res.error);
      }

      setPreview(publicUrl);
      setSuccess("Uploaded successfully");
      onSuccess?.(publicUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const Icon =
    mode === "product-3d" ? Box : mode === "product-video" ? Film : ImageIcon;

  return (
    <div className="admin-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-4 w-4" style={{ color: "#2d5a3d" }} />
        <span className="font-semibold text-sm" style={{ color: "#1a1a1a" }}>
          {label}
        </span>
      </div>

      {preview && (mode === "product-image" || mode === "brand-logo" || mode === "gallery") && (
        <div className="relative aspect-video max-h-40 rounded-lg overflow-hidden mb-3 border border-[#e5dfd4]">
          <Image src={preview} alt="Preview" fill className="object-cover" sizes="300px" />
        </div>
      )}

      {preview && (mode === "product-3d" || mode === "product-video") && (
        <p className="text-xs mb-3 truncate" style={{ color: "#5c5c5c" }}>
          {preview}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="admin-btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Upload className="h-4 w-4" />
        )}
        {uploading ? "Uploading..." : "Choose file & upload"}
      </button>

      {hint && (
        <p className="text-xs mt-2" style={{ color: "#888" }}>
          {hint}
        </p>
      )}
      {error && <p className="text-xs mt-2 text-red-600">{error}</p>}
      {success && <p className="text-xs mt-2 text-green-700">{success}</p>}
    </div>
  );
}
