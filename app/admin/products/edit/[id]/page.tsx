import { getProductById } from "@/lib/actions/product.actions";
import { getAllFeatures, getAllSpecifications } from "@/lib/actions/spec-features.actions";
import { prismaToJson } from "@/lib/utils/prisma-serializer";
import { notFound } from "next/navigation";
import EditProductForm from "@/components/admin/forms/edit-product-form";
import {getCategories} from "@/lib/actions/category.actions";
import {getSubcategories} from "@/lib/actions/subcategory.actions";
import {getBrands} from "@/lib/actions/brand.actions";

export default async function EditProductPage({
                                                  params,
                                              }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    try {
        // Сначала загружаем основные данные продукта
        const rawProduct = await getProductById(id);

        if (!rawProduct.success) {
            notFound();
        }

        // Затем загружаем вспомогательные данные с обработкой ошибок
        const results = await Promise.allSettled([
            getCategories(true),
            getSubcategories(true),
            getBrands(true),
            getAllFeatures(true),
            getAllSpecifications(true)
        ]);

        // Обрабатываем результаты с правильной типизацией
        const [categoriesResult, subcategoriesResult, brandsResult, featuresResult, specificationsResult] = results;

        // Создаем fallback объекты с правильной структурой
        const safeCategories = categoriesResult.status === 'fulfilled'
            ? categoriesResult.value
            : { success: true, data: [], message: 'Categories not loaded' };

        const safeSubcategories = subcategoriesResult.status === 'fulfilled'
            ? subcategoriesResult.value
            : { success: true, data: [], message: 'Subcategories not loaded' };

        const safeBrands = brandsResult.status === 'fulfilled'
            ? brandsResult.value
            : { success: true, data: [], message: 'Brands not loaded' };

        const safeFeatures = featuresResult.status === 'fulfilled'
            ? featuresResult.value
            : { success: true, data: [], message: 'Features not loaded' };

        const safeSpecifications = specificationsResult.status === 'fulfilled'
            ? specificationsResult.value
            : { success: true, data: [], message: 'Specifications not loaded' };

        // Собираем ошибки для отображения
        const errors: string[] = [];
        if (categoriesResult.status === 'rejected') errors.push('Не удалось загрузить категории');
        if (subcategoriesResult.status === 'rejected') errors.push('Не удалось загрузить подкатегории');
        if (brandsResult.status === 'rejected') errors.push('Не удалось загрузить бренды');
        if (featuresResult.status === 'rejected') errors.push('Не удалось загрузить особенности');
        if (specificationsResult.status === 'rejected') errors.push('Не удалось загрузить характеристики');

        // Сериализуем данные
        const product = prismaToJson(rawProduct);
        const serializedCategories = prismaToJson(safeCategories) as typeof safeCategories;
        const serializedSubcategories = prismaToJson(safeSubcategories) as typeof safeSubcategories;
        const serializedBrands = prismaToJson(safeBrands) as typeof safeBrands;
        const serializedFeatures = prismaToJson(safeFeatures) as typeof safeFeatures;
        const serializedSpecifications = prismaToJson(safeSpecifications) as typeof safeSpecifications;

        return (
            <div className="container mx-auto">
                {/* Показываем ошибки, если есть */}
                {errors.length > 0 && (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h3 className="text-lg font-semibold text-yellow-800">Частичная загрузка данных</h3>
                        <ul className="mt-2 text-yellow-700">
                            {errors.map((error, index) => (
                                <li key={index}>• {error}</li>
                            ))}
                        </ul>
                        <p className="mt-2 text-sm text-yellow-600">
                            Форма будет работать с ограниченной функциональностью
                        </p>
                    </div>
                )}

                <EditProductForm
                    productId={id}
                    initialData={product.data}
                    categories={serializedCategories}
                    subcategories={serializedSubcategories}
                    brands={serializedBrands}
                    features={serializedFeatures}
                    specifications={serializedSpecifications}
                />
            </div>
        );

    } catch (error) {
        console.error('Critical error loading product:', error);

        return (
            <div className="container mx-auto py-6">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h2 className="text-lg font-semibold text-red-600">Ошибка загрузки продукта</h2>
                    <p className="text-red-500 mt-2">
                        Не удалось загрузить данные продукта. Попробуйте обновить страницу.
                    </p>
                </div>
            </div>
        );
    }
}