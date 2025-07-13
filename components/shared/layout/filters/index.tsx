'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import {CategoryForFiltersResponse} from "@/lib/validations/category.actions.validation";

// Типы


type ProductFilterProps = {
    categories: CategoryForFiltersResponse | undefined;
};

const ProductFilter = ({ categories }: ProductFilterProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Фильтруем и сортируем категории (с проверкой на undefined)
    const activeCategories = (categories?.data || [])
        .filter(cat => cat.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder);

    // Получаем текущие выбранные категории из URL (используем слаги)
    const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
        const categoryParam = searchParams.get('categories');
        return categoryParam ? categoryParam.split(',') : [];
    });

    // Обработчик изменения категории (работаем со слагами)
    const handleCategoryChange = useCallback((categorySlug: string, isChecked: boolean) => {
        setSelectedCategories(prev => {
            if (isChecked) {
                return [...prev, categorySlug];
            }
            return prev.filter(slug => slug !== categorySlug);
        });
    }, []);

    // Обновляем URL при изменении выбранных категорий
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());

        if (selectedCategories.length > 0) {
            params.set('categories', selectedCategories.join(','));
        } else {
            params.delete('categories');
        }

        // Обновляем URL без перезагрузки страницы
        router.push(`?${params.toString()}`, { scroll: false });
    }, [selectedCategories, searchParams, router]);

    // Сброс всех фильтров
    const handleReset = () => {
        setSelectedCategories([]);
        router.push('?', { scroll: false });
    };

    return (
        <div className="w-full">
            <h3 className="text-lg font-normal mb-4">FILTROS</h3>

            {/* Фильтр категорий */}
            <div className="mb-6">
                <h4 className="font-medium mb-3">Categorías del producto</h4>
                <div className="space-y-2">
                    {activeCategories.map((category) => {
                        const productCount = category._count?.products;

                        return (
                            <label
                                key={category.id}
                                className="flex items-center cursor-pointer hover:text-gray-700"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(category.slug)}
                                    onChange={(e) => handleCategoryChange(category.slug, e.target.checked)}
                                    className="mr-2 cursor-pointer"
                                    aria-label={`Filtrar por ${category.name}`}
                                />
                                <span className="text-sm">
                  {category.name}
                                    {productCount !== undefined && productCount > 0 && (
                                        <span className="text-gray-500 ml-1">({productCount})</span>
                                    )}
                </span>
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* Кнопки управления */}
            <div className="space-y-2">
                <button
                    onClick={handleReset}
                    disabled={selectedCategories.length === 0}
                    className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Limpiar todos los filtros"
                >
                    Limpiar filtros
                </button>
            </div>

            {/* Показываем активные фильтры */}
            {selectedCategories.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded">
                    <p className="text-sm text-blue-700">
                        Filtros activos: {selectedCategories.length}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProductFilter;