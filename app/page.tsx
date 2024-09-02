"use client";

import { useState } from "react";
import { TbPhotoPlus } from "react-icons/tb";

export default function Home() {
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("imageFileData", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setUrl(data.url);
      } else {
        console.error("Upload failed.");
      }
    } catch (error) {
      console.error("An error occurred while uploading the image:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="relative bg-white p-4 border rounded-lg shadow-lg max-w-lg w-full">
        {url ? (
          <>
            <h2 className="text-lg font-semibold mb-4 text-center">
              アップロードされた画像
            </h2>
            <div className="flex justify-center">
              <img
                src={url}
                alt="Uploaded"
                className="object-cover max-h-80 max-w-full"
              />
            </div>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold mb-4 text-center">
              画像をアップロード
            </h2>
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="file-input"
              accept="image/*"
            />
            <label htmlFor="file-input">
              <div
                className={`relative flex h-80 cursor-pointer flex-col items-center justify-center gap-4 border-2 border-dashed border-neutral-300 transition hover:opacity-70 ${
                  uploading ? "opacity-50" : ""
                }`}
              >
                <TbPhotoPlus size={50} />
              </div>
            </label>
          </>
        )}
      </div>
    </div>
  );
}
