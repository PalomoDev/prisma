import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {formatId} from "@/lib/utils";
import {Check, Pencil, X} from "lucide-react";
import {Button} from "@/components/ui/button";
import DeleteDialog from "@/components/shared/delete-dialog";
import {GetCategoriesResponse} from "@/types";

import Link from "next/link";
import {deleteCategory} from "@/lib/actions/category.actions";

interface CategoryTableProps {
    categories: GetCategoriesResponse;
}

const CategoryTable = ({categories}: CategoryTableProps) => {
    // Если запрос не успешен или нет данных, показываем пустую таблицу или сообщение
    if (!categories.success || !categories.data) {
        return (
            <div className="text-center py-4">
                {categories.message || "No categories found"}
            </div>
        );
    }

    return (
        <Table className={'mt-4 border'}>
            <TableHeader>
                <TableRow>
                    <TableHead className='border-r border-l text-center w-[40px]'>ID</TableHead>
                    <TableHead className='border-r text-center'>CATEGORY</TableHead>
                    <TableHead className='border-r text-center'>SLUG</TableHead>
                    <TableHead className='border-r text-center'>DESCRIPTION</TableHead>
                    <TableHead className='border-r text-center'>IMAGE</TableHead>
                    <TableHead className='border-r text-center'>SUBCATEGORIES</TableHead>
                    <TableHead className='border-r text-center w-[60px]'>PRODUCTS</TableHead>
                    <TableHead className='border-r text-center w-[60px]'>ORDER</TableHead>
                    <TableHead className='border-r text-center w-[80px]'>ACTIVE</TableHead>
                    <TableHead className='border-r text-center w-[120px]'>ACTION</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {categories.data.map((category) => (
                    <TableRow key={category.id}>
                        <TableCell className='border-r border-l text-center'>{formatId(category.id)}</TableCell>
                        <TableCell className='border-r border-l text-center'>{category.name}</TableCell>
                        <TableCell className='border-r border-l text-center'>{category.slug}</TableCell>
                        <TableCell className='border-r border-l text-center'>{category.description || '–'}</TableCell>
                        <TableCell className='border-r border-l text-center'>{category.image || '–'}</TableCell>
                        <TableCell className='border-r border-l text-center'>
                           <span
                               className='cursor-help'
                               title={
                                   category.categorySubcategories && category.categorySubcategories.length > 0
                                       ? category.categorySubcategories.map(cs => cs.subcategory.name).join(', ')
                                       : 'No subcategories'
                               }
                           >
                               {category.categorySubcategories && category.categorySubcategories.length > 0 ? (
                                   <>
                                       {category.categorySubcategories
                                           .slice(0, 2)
                                           .map((cs: { subcategory: { name: any; }; }) => cs.subcategory.name)
                                           .join(', ')}
                                       {category.categorySubcategories.length > 2 && '...'}
                                   </>
                               ) : (
                                   '–'
                               )}
                           </span>
                        </TableCell>
                        <TableCell className='border-r border-l text-center'>{category._count.products}</TableCell>
                        <TableCell className='border-r border-l text-center'>{category.sortOrder}</TableCell>
                        <TableCell className='border-r border-l text-center'>
                            {category.isActive ? (
                                <Check className='w-4 h-4 text-green-600 mx-auto' />
                            ) : (
                                <X className='w-4 h-4 text-red-600 mx-auto' />
                            )}
                        </TableCell>
                        <TableCell className='flex items-center justify-center gap-1'>
                            <Button asChild variant='ghost' size='sm'>
                                <Link href={`/admin/products/category/update-category/${category.id}`}>
                                    <Pencil className="w-4 h-4" />
                                </Link>
                            </Button>
                            {category._count.products > 0 ? (
                                <Button
                                    variant='outline'
                                    size='sm'
                                    disabled
                                    title={`Cannot delete: category contains ${category._count.products} products`}
                                >
                                    Delete
                                </Button>
                            ) : (
                                <DeleteDialog id={category.id} action={deleteCategory} />
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default CategoryTable;