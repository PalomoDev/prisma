// components/shared/layout/header/menu/mega-menu.tsx
// Главный компонент мега-меню

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MenuCategory, MenuProps, MenuItem } from "@/types/menu.type";
import ImageMenuGrid from "./image-menu-grid";
import TextMenuGrid from "./text-menu-grid";

// Данные меню
const menuData: MenuItem[] = [
  {
    title: "PRODUCTOS",
    href: "/products",
    categories: [] as MenuCategory[],
    displayType: "text-menu",
  },
  {
    title: "ACTIVIDADES",
    href: "/actividades",
    categories: [],
    displayType: "image-grid",
  },
  {
    title: "SERVICIO",
    href: "/servicio",
    categories: [
      {
        title: "Atención al cliente",
        items: [
          { name: "Contacto", href: "/servicio/contacto" },
          { name: "Cambios y devoluciones", href: "/servicio/cambios" },
          { name: "Garantía", href: "/servicio/garantia" },
        ],
      },
      {
        title: "Servicios técnicos",
        items: [
          { name: "Reparaciones", href: "/servicio/reparaciones" },
          { name: "Mantenimiento", href: "/servicio/mantenimiento" },
          { name: "Asesoramiento técnico", href: "/servicio/asesoramiento" },
        ],
      },
    ],
    displayType: "text-menu",
  },
  {
    title: "ALEXIKA",
    href: "/alexika",
    categories: [
      {
        title: "Sobre la marca",
        items: [
          { name: "Historia", href: "/alexika/historia" },
          { name: "Tecnología", href: "/alexika/tecnologia" },
          { name: "Sostenibilidad", href: "/alexika/sostenibilidad" },
        ],
      },
      {
        title: "Colecciones",
        items: [
          { name: "Climbing Collection", href: "/alexika/climbing" },
          { name: "Trail Collection", href: "/alexika/trail" },
          { name: "Alpine Collection", href: "/alexika/alpine" },
        ],
      },
    ],
    displayType: "text-menu",
  },
];

const CustomMegaMenu = ({ categories, actividades }: MenuProps) => {
  // Состояние для отслеживания активного меню
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Преобразование menuData - заменяем categories для PRODUCTOS
  const transformedMenuData = menuData.map((item) => {
    if (item.title === "PRODUCTOS") {
      return {
        ...item,
        categories: categories,
      };
    }
    return item;
  });

  // Проверяем структуру преобразованного массива
  console.log("Transformed menuData:", transformedMenuData);
  console.log(
    "Categories for PRODUCTOS:",
    transformedMenuData.find((item) => item.title === "PRODUCTOS")?.categories
  );

  const handleMenuEnter = (menuTitle: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveMenu(menuTitle);
  };

  const handleMenuLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Находим активный элемент меню
  const activeMenuItem = transformedMenuData.find(
    (item) => item.title === activeMenu
  );

  return (
    <div className="mega-menu-root hidden lg:flex relative">
      {/* ГОРИЗОНТАЛЬНОЕ МЕНЮ - основные кнопки (PRODUCTOS, ACTIVIDADES и т.д.) */}
      <nav className="main-menu-nav flex items-end font-medium">
        {transformedMenuData.map((item) => (
          // КОНТЕЙНЕР ОДНОЙ КНОПКИ МЕНЮ
          <div
            key={item.title}
            className="menu-item-wrapper relative"
            onMouseEnter={() => handleMenuEnter(item.title)}
            onMouseLeave={handleMenuLeave}
          >
            {/* КНОПКА МЕНЮ (PRODUCTOS, ACTIVIDADES и т.д.) */}
            <Link
              href={item.href}
              className="menu-item-button text-sm font-semibold text-gray-900 hover:text-red-600 transition-colors tracking-wider px-4 block"
            >
              {item.title}
            </Link>
          </div>
        ))}
      </nav>

      {/* ВЫПАДАЮЩЕЕ МЕНЮ - показывается только при activeMenu */}
      {activeMenu && activeMenuItem && (
        <div
          className="dropdown-menu-container absolute top-full mt-4 w-[110vw] bg-white opacity-100 shadow-lg  z-50"
          style={{
            left: "50%",
            transform: "translateX(-52%)",
          }}
          onMouseEnter={() => handleMenuEnter(activeMenu)}
          onMouseLeave={handleMenuLeave}
        >
          {/* КОНТЕЙНЕР КОНТЕНТА - центрирует содержимое */}
          <div className="dropdown-content-wrapper max-w-7xl mx-auto px-8 py-8">
            {/* УСЛОВНЫЙ РЕНДЕРИНГ НА ОСНОВЕ displayType */}
            {activeMenuItem.displayType === "image-grid" ? (
              /* МЕНЮ С КАРТИНКАМИ */
              <ImageMenuGrid items={actividades} />
            ) : (
              /* ОБЫЧНОЕ ТЕКСТОВОЕ МЕНЮ */
              <TextMenuGrid categories={activeMenuItem.categories} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomMegaMenu;

/*
=== ОБНОВЛЕНИЯ В СТРУКТУРЕ ===

1. Добавлен импорт типа MenuItem
2. menuData теперь имеет тип MenuItem[] с полем displayType
3. Логика условного рендеринга теперь использует activeMenuItem.displayType
4. Убрана привязка к конкретному названию "ACTIVIDADES"

=== ПРЕИМУЩЕСТВА НОВОГО ПОДХОДА ===

- Гибкость: можно легко изменить тип отображения для любого меню
- Расширяемость: легко добавить новые типы отображения ("mixed", "carousel", и т.д.)
- Читаемость: явно указан тип отображения в данных
- Типобезопасность: TypeScript проверяет корректность displayType

=== СТРУКТУРА СТИЛЕЙ ===

1. .mega-menu-root - главный контейнер всего мега-меню
2. .main-menu-nav - горизонтальное меню с кнопками
3. .menu-item-wrapper - контейнер одной кнопки меню
4. .menu-item-button - сама кнопка меню (PRODUCTOS и т.д.)
5. .dropdown-menu-container - полноэкранный контейнер выпадающего меню
6. .dropdown-content-wrapper - центрирует контент внутри выпадающего меню
7. .categories-grid - сетка категорий (flexbox)
8. .category-column - одна колонка категории
9. .category-title - заголовок категории
10. .category-items - список подкатегорий
11. .category-item - одна подкатегория
12. .category-link - ссылка на подкатегорию

=== ОСНОВНЫЕ СТИЛИ ДЛЯ НАСТРОЙКИ ===

- Выравнивание основных кнопок: .main-menu-nav (items-end, items-center, items-start)
- Ширина выпадающего меню: .dropdown-menu-container (w-[110vw])
- Центрирование контента: .dropdown-content-wrapper (max-w-7xl mx-auto)
- Расположение категорий: .categories-grid (justify-center, justify-start, justify-between)
- Отступы кнопок: .menu-item-button (px-4, py-4)
- Позиционирование меню: style={{left: '50%', transform: 'translateX(-52%)'}}
*/
