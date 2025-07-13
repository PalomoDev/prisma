// components/shared/layout/header/menu/text-menu-grid.tsx
// Компонент для отображения текстового меню с категориями

import Link from "next/link";
import { MenuCategory } from "@/types/menu.type";

type TextMenuGridProps = {
  categories: MenuCategory[];
};

const TextMenuGrid = ({ categories }: TextMenuGridProps) => {
  return (
    <div className="categories-grid flex justify-center gap-8">
      {categories.map((category) => (
        // ОДНА КАТЕГОРИЯ (например, "Zapatillas")
        <div key={category.title} className="category-column space-y-4">
          {/* ЗАГОЛОВОК КАТЕГОРИИ */}
          <h4 className="category-title font-semibold text-lg text-gray-900 border-b border-gray-200 pb-3">
            {category.title}
          </h4>

          {/* СПИСОК ПОДКАТЕГОРИЙ */}
          <ul className="category-items space-y-3">
            {category.items.map((subItem) => (
              <li key={subItem.name} className="category-item">
                {/* ССЫЛКА НА ПОДКАТЕГОРИЮ */}
                <Link
                  href={subItem.href}
                  className="category-link block p-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 rounded transition-colors"
                >
                  {subItem.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TextMenuGrid;

/*
=== СТРУКТУРА КОМПОНЕНТА ===

1. .categories-grid - flexbox контейнер для категорий
2. .category-column - одна колонка категории
3. .category-title - заголовок категории
4. .category-items - список подкатегорий
5. .category-item - одна подкатегория
6. .category-link - ссылка на подкатегорию

=== ПРЕИМУЩЕСТВА ИСПОЛЬЗОВАНИЯ ОБЩИХ ТИПОВ ===

- Нет дублирования типов
- Единый источник истины для структуры меню
- Автоматическая синхронизация при изменении типов
- Лучшая типобезопасность по всему проекту
- Переиспользование: можно использовать в других местах
- Читаемость: основной компонент становится проще
- Тестируемость: можно тестировать отдельно
*/
