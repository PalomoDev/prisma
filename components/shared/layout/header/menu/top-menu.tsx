// components/shared/layout/header/menu/top-menu.tsx
// Главный компонент адаптивной навигации

"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Plus } from "lucide-react";
import Logo from "@/components/shared/logo";
import CustomMegaMenu from "./mega-menu";
import { MenuCategory, ImageMenuItem } from "@/types/menu.type";

interface MenuItem {
  title: string;
  href: string;
  hasSubmenu?: boolean;
}

interface TopMenuProps {
  products: MenuCategory[];
  actividades: ImageMenuItem[];
}

const menuItems: MenuItem[] = [
  { title: "PRODUCTOS", href: "/productos", hasSubmenu: true },
  { title: "ACTIVIDADES", href: "/actividades", hasSubmenu: true },
  { title: "SERVICIO", href: "/servicio", hasSubmenu: true },
  { title: "ALEXIKA", href: "/alexika", hasSubmenu: true },
];

const AdaptiveNavigation = ({ products, actividades }: TopMenuProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between h-16">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            {/* Desktop Custom Mega Menu */}
            <CustomMegaMenu categories={products} actividades={actividades} />

            {/* Spacer for mobile to center logo */}
            <div className="lg:hidden w-10"></div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay - остается без изменений */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={closeMenu}
          />
          <div className="fixed top-0 left-0 right-0 bg-white shadow-lg">
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
              <button
                onClick={closeMenu}
                className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
              <Link href="/" onClick={closeMenu}>
                <Logo size="medium" />
              </Link>
              <div className="w-10"></div>
            </div>
            <div className="py-6">
              {menuItems.map((item) => (
                <div
                  key={item.title}
                  className="px-6 py-4 border-b border-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className="text-lg font-medium text-gray-900 tracking-wider flex-1"
                    >
                      {item.title}
                    </Link>
                    {item.hasSubmenu && (
                      <Plus className="w-5 h-5 text-red-600 flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdaptiveNavigation;
