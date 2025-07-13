import { getProductBySlug } from "@/lib/actions/product.actions";
import { notFound } from 'next/navigation';
import ProductGalleryGrid from "@/components/shared/product/product-images";
import { PrismaToJson } from "@/lib/utils";
import { Badge } from '@/components/ui/badge';
import ProductPrice from "@/components/shared/product/product-price";
import { auth } from "@/auth";
import AddToCart from "@/components/shared/product/add-to-cart";
import { getMyCart } from "@/lib/actions/cart.actions";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const ProductDetailsPage = async (props: {
    params: Promise<{ slug: string }>;
}) => {
    const { slug } = await props.params;

    // Получаем ответ в стандартном формате проекта
    const response = await getProductBySlug(slug);
    if (!response.success || !response.data) {
        notFound();
    }

    // Делаем все преобразования здесь на странице
    const product = PrismaToJson({
        ...response.data,
        // Преобразуем для удобства использования в компонентах
        specifications: response.data.specificationValues.map(sv => ({
            id: sv.specification.id,
            name: sv.specification.name,
            key: sv.specification.key,
            value: sv.value,
            unit: sv.specification.unit,
            type: sv.specification.type,
            sortOrder: sv.specification.sortOrder,
        })),
        productFeatures: response.data.features,
        reviews: response.data.Review,
        // Убираем исходные поля чтобы не путаться
        specificationValues: undefined,
        features: undefined,
        Review: undefined,
    });

    const session = await auth();
    const userId = session?.user?.id;

    const cart = await getMyCart();

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Хлебные крошки */}
            <nav className="mb-8">
                <ol className="flex items-center space-x-2 text-sm text-gray-600 uppercase">
                    <li>
                        <Link href="/" className="hover:text-red-600 transition-colors">
                            INICIO
                        </Link>
                    </li>
                    <li className="text-red-600">•</li>
                    <li>
                        <Link href={`/categoria/${product.category.slug}`} className="hover:text-red-600 transition-colors">
                            {product.category.name.toUpperCase()}
                        </Link>
                    </li>
                    {product.productSubcategories && product.productSubcategories.length > 0 && (
                        <>
                            <li className="text-red-600">•</li>
                            <li>
                                <Link
                                    href={`/subcategoria/${product.productSubcategories[0].subcategory.slug}`}
                                    className="hover:text-red-600 transition-colors"
                                >
                                    {product.productSubcategories[0].subcategory.name.toUpperCase()}
                                </Link>
                            </li>
                        </>
                    )}
                    <li className="text-red-600">•</li>
                    <li className="text-gray-900 font-medium">
                        {product.name.toUpperCase()}
                    </li>
                </ol>
            </nav>

            {/* Основной контент */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Галерея изображений - 2/3 ширины */}
                <div className="lg:col-span-2">
                    <ProductGalleryGrid images={product.images} />
                </div>

                {/* Информация о товаре - 1/3 ширины */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Заголовок */}
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900 uppercase  mb-1">
                            {product.name}
                        </h1>
                        <h2 className="text-sm text-gray-600 uppercase tracking-wide">
                            {product.productSubcategories[0].subcategory.name}
                        </h2>
                    </div>

                    {/* Описание */}
                    <div className="text-gray-700 leading-relaxed text-sm">
                        <p>{product.description}</p>
                    </div>

                    {/* Логотип бренда - заготовка для будущего */}
                    <div className="py-2">
                        {/* TODO: Добавить логотип бренда */}
                        <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded inline-block">
                            {product.brand.name}
                        </div>
                    </div>

                    {/* Цена */}
                    <div className="space-y-1">
                        <div className="flex items-baseline space-x-2">
                            <ProductPrice
                                value={Number(product.price)}
                                className="text-2xl font-bold text-gray-900"
                            />
                            <span className="text-sm text-gray-500">(IVA incluido)</span>
                        </div>
                    </div>

                    {/* Артикул */}
                    <div className="text-sm text-gray-600">
                        <span className="font-medium">número de artículo:</span> {product.sku}
                    </div>

                    {/* Статус товара */}
                    <div className="flex items-center space-x-2">
                        {product.stock > 0 ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                En stock
                            </Badge>
                        ) : (
                            <Badge variant="destructive">
                                Agotado
                            </Badge>
                        )}
                    </div>

                    {/* Кнопка добавления в корзину */}
                    {product.stock > 0 && (
                        <div className="pt-4">
                            <AddToCart
                                cart={cart}
                                item={{
                                    productId: product.id,
                                    name: product.name,
                                    slug: product.slug,
                                    price: Number(product.price).toString(),
                                    qty: 1,
                                    image: product.images![0],
                                }}
                                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-8 rounded font-semibold uppercase tracking-wider transition-colors"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Секция COMMUNITY - заготовка для будущего */}
            <div className="mt-16 border-t pt-8">
                <div className="flex items-center justify-between cursor-pointer hover:text-red-600 transition-colors">
                    <h3 className="text-xl font-semibold uppercase tracking-wider">COMMUNITY</h3>
                    <ChevronRight className="w-5 h-5 transform transition-transform" />
                </div>
                {/* TODO: Добавить содержимое секции COMMUNITY */}
            </div>
        </div>
    );
};

export default ProductDetailsPage;