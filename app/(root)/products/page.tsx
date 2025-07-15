import Breadcrumbs from "@/components/ui/breadcrumps";
import ProductGalleryCard from "@/components/shared/product/product-gallery-card";
import {
  getAllProducts,
  getFeaturedProducts,
  getGalleryProducts,
  getProducts,
} from "@/lib/actions/product.actions";
import { prismaToJson } from "@/lib/utils/prisma-serializer";
import ProductFilter from "@/components/shared/layout/filters";
import { getCategoriesLight } from "@/lib/actions/new/category/get.actions";
import ProductsContainer from "@/components/shared/layout/product-container";

const ProductsPage = async () => {
  const breadcrumbItems = [
    { label: "INICIO", href: "/" },
    { label: "EQUIPO", href: `/products` },
  ];

  // Получение категорий для фильтра
  const categoriesResponse = await getCategoriesLight(true);
  const categories = categoriesResponse.data ?? [];

  // Получение рекомендуемых продуктов с помощью серверного действия
  const products = await getGalleryProducts();
  // Преобразование данных Prisma в JSON формат для корректного использования в UI

  return (
    <div className="container mx-auto py-8 px-4">
      <Breadcrumbs items={breadcrumbItems} />

      <h1 className="text-3xl font-bold mb-6">EQUIPO</h1>

      {/* Проверка наличия данных */}
      {!products || products.data?.length === 0 ? (
        <p className="text-center py-8">No hay productos disponibles</p>
      ) : (
        <ProductsContainer
          products={products.data ?? []}
          categories={categories}
        />
      )}
    </div>
  );
};

export default ProductsPage;
