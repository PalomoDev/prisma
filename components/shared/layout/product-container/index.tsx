'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductFilter from '@/components/shared/layout/filters';
import ProductGalleryCard from '@/components/shared/product/product-gallery-card';

import {Category, GetCategoriesResponse, ProductFromGallery} from '@/types';
import type { CategoryWithRelations } from '@/types';

type ProductsContainerProps = {
    products: ProductFromGallery[];
    categories: GetCategoriesResponse;
};

const ProductsContainer = ({ products, categories }: ProductsContainerProps) => {
    const searchParams = useSearchParams();

    // Получаем выбранные категории из URL
    const selectedCategorySlugs = useMemo(() => {
        const categoriesParam = searchParams.get('categories');
        return categoriesParam ? categoriesParam.split(',') : [];
    }, [searchParams]);

    // Фильтруем продукты
    const filteredProducts = useMemo(() => {
        // Если фильтры не выбраны - показываем все
        if (selectedCategorySlugs.length === 0) {
            return products;
        }

        // Фильтруем по выбранным категориям
        return products.filter(product =>
            selectedCategorySlugs.includes(product.category.slug)
        );
    }, [products, selectedCategorySlugs]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-[1420px] mx-auto border-t pt-4">
            {/* Боковая панель фильтров - скрыта на мобильных */}
            <div className="hidden lg:block">
                <div className="pr-4">
                    <ProductFilter categories={categories} />
                </div>
            </div>

            {/* Область с товарами - занимает 2 колонки на lg+ */}
            <div className="lg:col-span-2">
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No se encontraron productos con los filtros seleccionados</p>
                        {selectedCategorySlugs.length > 0 && (
                            <p className="text-sm text-gray-400 mt-2">
                                Intenta seleccionar otras categorías
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filteredProducts.map((product) => (
                            <ProductGalleryCard
                                key={product.id}
                                product={product}
                                showPrice={true}
                                showDescription={true}
                            />
                        ))}
                    </div>
                )}

                {/* Счетчик продуктов */}
                <div className="mt-6 text-sm text-gray-500 text-center">
                    Mostrando {filteredProducts.length} de {products.length} productos
                </div>
            </div>
        </div>
    );
};

export default ProductsContainer;