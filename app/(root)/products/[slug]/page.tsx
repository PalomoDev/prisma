import { SlugParam } from '@/types';
import { notFound } from 'next/navigation';
import Breadcrumbs from "@/components/ui/breadcrumps";

interface ProductsPageProps {
    params: SlugParam;
}



export default async function ProductsPage({ params }: ProductsPageProps) {
    const { slug } = params;
    const breadcrumbItems = [
        { label: "INICIO", href: "/" },
        { label: "EQUIPO", href: `/products` },
        {label: "TIENDAS DE COMPAÑA", href: `/products/tiendas-de-compana`}
    ];

    try {
        const products = slug;

        if (!products) {
            notFound();
        }

        return (
            <div className="container mx-auto py-8 px-4">
                <Breadcrumbs items={breadcrumbItems}/>
                <article>
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">{products}</h1>

                    </header>


                </article>
            </div>
        );
    } catch (error) {
        console.error('Ошибка при получении статьи:', error);
        notFound();
    }
}

