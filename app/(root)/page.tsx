/**
 * @fileoverview Главная страница приложения
 * 
 * Эта страница отображает карусель баннеров и список рекомендуемых (featured) продуктов.
 * Страница использует серверные компоненты Next.js для получения данных о продуктах
 * с помощью функции getFeaturedProducts.
 * 
 * @module HomePage
 */

import {getFeaturedProducts, getProducts} from "@/lib/actions/product.actions";
import { prismaToJson } from "@/lib/utils/prisma-serializer"
import Image from "next/image";
import Link from "next/link";
import ProductCarousel from "@/components/shared/layout/homepage/carousel";
import ProductGalleryCard from "@/components/shared/product/product-gallery-card";
import {descriptor} from "effect/Effect";


/**
 * Массив данных для баннеров в карусели на главной странице
 * @type {Array<{
 *   src: string,      // Путь к изображению баннера
 *   slug: string,     // Уникальный идентификатор для URL
 *   label: string,    // Текстовая метка баннера
 *   id: string,       // Уникальный идентификатор
 *   name: string      // Имя баннера (опционально)
 * }>}
 */
const slides = [
    {
        src: '/slides/banner_1.png',
        slug: 'banner1',
        label: 'banner1',
        id: 'rt123r5',
        name: '',
    },
    {
        src: '/slides/banner_2.png',
        slug: 'banner2',
        label: 'banner2',
        id: 'rt123r6',
        name: '',
    },
]

const articles = [
    {
        src: '/articles/article_1.png',
        slug: 'article-1',
        label: 'article-1',
        id: 'rt123r10',
        title: 'Cómo mantener el calor durante el trekking invernal',
        shortDescriptor: 'Consejos prácticos para mantener el calor corporal durante expediciones de trekking en condiciones invernales extremas'
    },
    {
        src: '/articles/article_2.png',
        slug: 'article-2',
        label: 'article-2',
        id: 'rt123r11',
        title: 'Equipo esencial para acampada de montaña',
        shortDescriptor: 'Guía completa del equipamiento indispensable para una experiencia segura en campamentos de alta montaña'
    },
    {
        src: '/articles/article_3.png',
        slug: 'article-3',
        label: 'article-3',
        id: 'rt123r12',
        title: 'Técnicas de orientación sin GPS en la naturaleza',
        shortDescriptor: 'Aprende métodos tradicionales de navegación usando brújula, mapa y elementos naturales para orientarte en terreno salvaje'
    },
    {
        src: '/articles/article_4.png',
        slug: 'article-4',
        label: 'article-4',
        id: 'rt123r13',
        title: 'Preparación física para expediciones de alta montaña',
        shortDescriptor: 'Rutina de entrenamiento específica y consejos nutricionales para preparar tu cuerpo ante desafíos de altitud extrema'
    }

]


    /**
     * Компонент главной страницы сайта
     * 
     * @returns {Promise<JSX.Element>} Компонент React для отображения главной страницы
     */
    export default async function Home() {
    // Получение рекомендуемых продуктов с помощью серверного действия
    const {success, data, error
    } = await getFeaturedProducts();
    // Преобразование данных Prisma в JSON формат для корректного использования в UI
    const products = success ? prismaToJson(data) : [];




    // Отображение компонента главной страницы
    return (
        <div className="flex flex-col items-center min-h-screen pb-20 gap-12  font-[family-name:var(--font-geist-sans)] " >
            <ProductCarousel data={slides} />
            <h1 className="text-3xl font-bold uppercase">Novedades y tendencias</h1>

            {/* Отображение ошибки при неудачном получении данных */}
            {error && <p className="text-red-500">Ошибка: {error}</p>}

            {/* Условное отображение: сообщение об отсутствии продуктов или галерея продуктов */}
            {!products || products.length
            === 0 ? (
                <p>Нет доступных продуктов</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-[1420px] gap-4 mx-auto">
                    {products.map((product: any) => (
                        <ProductGalleryCard
                            key={product.id}
                            product={product}
                            showPrice={true}
                            showDescription = {true}
                        />
                    ))}
                </div>
            )}
            <h1 className="text-3xl font-bold uppercase">Viajes y Consejos</h1>

            {/* Блок статей */}
            <div className="grid grid-cols-2 w-full max-w-[1420px] gap-4 mx-auto">
                {articles.map((article) => (
                    <Link href={`/article/${article.slug}`} key={article.id}>
                        <div className="relative w-full aspect-square cursor-pointer overflow-hidden rounded">
                            <Image
                                src={article.src}
                                alt={article.title}
                                fill
                                sizes="(max-width: 768px) 50vw, 25vw"
                                className="object-cover"
                            />

                            {/* Текст по центру */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                <h3 className="text-6xl font-bold mb-4 text-white uppercase text-shadow-[0_2px_4px_rgba(0,0,0,0.4)] ">
                                    {article.title}
                                </h3>
                                <p className="w-2/3 text-3xl text-white text-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
                                    {article.shortDescriptor}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

        </div>

    );
}
