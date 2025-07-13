import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Check, X, Pencil} from "lucide-react";
import {Button} from "@/components/ui/button";
import DeleteDialog from "@/components/shared/delete-dialog";
import Link from "next/link";
import Pagination from "@/components/shared/pagination";
import {deleteProduct, getAllProducts} from "@/lib/actions/product.actions";

type GetAllProductsResponse = Awaited<ReturnType<typeof getAllProducts>>;

interface ProductTableProps {
    products: GetAllProductsResponse;
    page: number;
}

const ProductTable = ({products, page}: ProductTableProps) => {
    return (
        <div>
            <Table className={'mt-4 border'}>
                <TableHeader>
                    <TableRow>
                        <TableHead className='border-r border-l text-center w-[100px]'>SKU</TableHead>
                        <TableHead className='border-r text-center'>NAME</TableHead>
                        <TableHead className='border-r text-center'>BRAND</TableHead>
                        <TableHead className='border-r text-center'>CATEGORY</TableHead>
                        <TableHead className='border-r text-center'>SUBCATEGORIES</TableHead>
                        <TableHead className='border-r text-center w-[80px]'>PRICE</TableHead>
                        <TableHead className='border-r text-center w-[60px]'>STOCK</TableHead>
                        <TableHead className='border-r text-center w-[80px]'>RATING</TableHead>
                        <TableHead className='border-r text-center w-[80px]'>REVIEWS</TableHead>
                        <TableHead className='border-r text-center w-[80px]'>FEATURED</TableHead>
                        <TableHead className='border-r text-center w-[80px]'>ACTIVE</TableHead>
                        <TableHead className='border-r text-center w-[120px]'>ACTIONS</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.data?.map((product) => {
                        // Подготавливаем данные для отображения
                        const subcategoriesText = product.productSubcategories?.map(ps => ps.subcategory.name).join(', ') || '–';
                        const subcategoriesTooltip = product.productSubcategories?.map(ps => ps.subcategory.name).join('\n') || 'No subcategories';

                        return (
                            <TableRow key={product.id}>
                                <TableCell className='border-r border-l text-center font-mono text-sm'>
                                    {product.sku}
                                </TableCell>

                                <TableCell className='border-r border-l text-center max-w-[200px] truncate' title={product.name}>
                                    {product.name}
                                </TableCell>

                                <TableCell className='border-r border-l text-center'>
                                    {product.brand.name}
                                </TableCell>

                                <TableCell className='border-r border-l text-center'>
                                    <span
                                        className='cursor-help'
                                        title={`${product.category.name}`}
                                    >
                                        {product.category.name}
                                    </span>
                                </TableCell>

                                <TableCell className='border-r border-l text-center max-w-[150px]'>
                                    <span
                                        className='cursor-help truncate block'
                                        title={subcategoriesTooltip}
                                    >
                                        {subcategoriesText}
                                    </span>
                                </TableCell>

                                <TableCell className='border-r border-l text-center font-medium'>
                                    ${Number(product.price).toFixed(2)}
                                </TableCell>

                                <TableCell className='border-r border-l text-center'>
                                    <span className={product.stock <= 10 ? 'text-red-600 font-medium' : ''}>
                                        {product.stock}
                                    </span>
                                </TableCell>

                                <TableCell className='border-r border-l text-center'>
                                    <span className='flex items-center justify-center gap-1'>
                                        {Number(product.rating).toFixed(1)}
                                        <span className='text-yellow-500'>★</span>
                                    </span>
                                </TableCell>

                                <TableCell className='border-r border-l text-center'>
                                    {product.numReviews}
                                </TableCell>

                                <TableCell className='border-r border-l text-center'>
                                    {product.isFeatured ? (
                                        <Check className='w-4 h-4 text-green-600 mx-auto' />
                                    ) : (
                                        <X className='w-4 h-4 text-gray-400 mx-auto' />
                                    )}
                                </TableCell>

                                <TableCell className='border-r border-l text-center'>
                                    {product.isActive ? (
                                        <Check className='w-4 h-4 text-green-600 mx-auto' />
                                    ) : (
                                        <X className='w-4 h-4 text-red-600 mx-auto' />
                                    )}
                                </TableCell>

                                <TableCell className='border-r border-l'>
                                    <div className='flex gap-1 justify-center'>
                                        <Button asChild variant='outline' size='sm'>
                                            <Link href={`/admin/products/edit/${product.id}`}>
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                        </Button>
                                        <DeleteDialog id={product.id} action={deleteProduct} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

            {products.totalPages && products.totalPages > 1 && (
                <Pagination page={page} totalPages={products.totalPages} />
            )}
        </div>
    );
};

export default ProductTable;