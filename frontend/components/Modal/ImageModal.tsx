"use client";

import React from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface Props {
  title: string;
  images: string[];
  onClose: () => void;
}

export default function ImageModal({ title, images, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-xl p-4 w-full max-w-2xl shadow-lg relative">
        
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold mb-4">{title}</h2>

        {images.length === 0 ? (
          <p className="text-center text-gray-500 py-10">ไม่มีรูปภาพ</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
            {images.map((img, i) => (
              <div key={i} className="rounded-lg overflow-hidden border">
                <img
                  src={img}
                  alt={`image-${i}`}
                  className="w-full h-40 object-cover cursor-pointer hover:opacity-80"
                  onClick={() => window.open(img, "_blank")}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
