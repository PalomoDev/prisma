import {getAllProducts} from "@/lib/actions/product.actions";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import { prismaToJson } from "@/lib/utils/prisma-serializer";
import ProductTable from "@/components/admin/tables/product-table";

export default async function AdminProductPage(props: {
    searchParams: Promise<{
        page: string;
        query: string;
        category: string
    }>
}) {

    const searchParams = await props.searchParams;
    const page = Number(searchParams.page) || 1;

    // Получаем и сериализуем данные
    const rawProducts = await getAllProducts({ page });
    const products = prismaToJson(rawProducts);

    return (
        <div className={'space-y-2'}>
            <div className={'flex-between'}>
                <h1 className={'h2-bold'}>Products</h1>
                <Button asChild variant={'default'}>
                    <Link href="/admin/products/create">
                        Create Product
                    </Link>
                </Button>
            </div>

            <ProductTable products={products} page={page} />
        </div>
    );
}