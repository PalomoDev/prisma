// components/shared/layout/header/menu/image-menu-grid.tsx
// Компонент для отображения меню с картинками (активности)

"use client";

import Link from "next/link";
import Image from "next/image";
import { ImageMenuItem } from "@/types/menu.type";

interface ImageMenuGridProps {
  items: ImageMenuItem[];
}

const ImageMenuGrid = ({ items }: ImageMenuGridProps) => {
  return (
    <div className="image-menu-grid grid grid-cols-5 gap-6 max-w-6xl mx-auto">
      {items.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className="image-menu-card block bg-white overflow-hidden shadow-sm"
        >
          <div className="image-container relative aspect-[4/3] overflow-hidden">
            <Image
              src={item.image}
              alt={item.alt || item.name}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 20vw, 16vw"
            />

            {/* Название активности */}
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-white font-extrabold tracking-wide uppercase text-xl drop-shadow-md text-center">
                {item.name}
              </h3>
            </div>

            {/* Стрелочка в правом нижнем углу */}
            <div className="absolute bottom-3 right-3">
              <div className="text-white drop-shadow-md">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ImageMenuGrid;
