import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {formatId} from "@/lib/utils";
import {Check, X, Pencil, ExternalLink} from "lucide-react";
import {Button} from "@/components/ui/button";
import DeleteDialog from "@/components/shared/delete-dialog";
import {GetBrandsResponse} from "@/types";
import Link from "next/link";
import {deleteBrand} from "@/lib/actions/brand.actions";


interface BrandTableProps {
    brands: GetBrandsResponse;
}

const BrandTable = ({brands}: BrandTableProps) => {
    if (!brands.success || !brands.data) {
        return (
            <div className="text-center py-4">
                {brands.message || "No brands found"}
            </div>
        );
    }

    return (
        <Table className={'mt-4 border'}>
            <TableHeader>
                <TableRow>
                    <TableHead className='border-r border-l text-center w-[40px]'>ID</TableHead>
                    <TableHead className='border-r text-center w-[150px]'>BRAND</TableHead>
                    <TableHead className='border-r text-center'>SLUG</TableHead>
                    <TableHead className='border-r text-center'>DESCRIPTION</TableHead>
                    <TableHead className='border-r text-center w-[80px]'>LOGO</TableHead>
                    <TableHead className='border-r text-center w-[100px]'>WEBSITE</TableHead>
                    <TableHead className='border-r text-center w-[80px]'>PRODUCTS</TableHead>
                    <TableHead className='border-r text-center w-[60px]'>ORDER</TableHead>
                    <TableHead className='border-r text-center w-[80px]'>ACTIVE</TableHead>
                    <TableHead className='border-r text-center w-[120px]'>ACTION</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {brands.data.map((brand) => (
                    <TableRow key={brand.id}>
                        <TableCell className='border-r border-l text-center'>{formatId(brand.id)}</TableCell>
                        <TableCell className='border-r border-l text-center font-medium'>{brand.name}</TableCell>
                        <TableCell className='border-r border-l text-center'>{brand.slug}</TableCell>
                        <TableCell className='border-r border-l text-center'>
                            {brand.description ? (
                                <span
                                    className='cursor-help'
                                    title={brand.description}
                                >
                                    {brand.description.length > 50
                                        ? `${brand.description.substring(0, 50)}...`
                                        : brand.description
                                    }
                                </span>
                            ) : '–'}
                        </TableCell>
                        <TableCell className='border-r border-l text-center'>
                            {brand.logo ? (
                                <img
                                    src={brand.logo}
                                    alt={brand.name}
                                    className="w-8 h-8 object-contain mx-auto"
                                />
                            ) : '–'}
                        </TableCell>
                        <TableCell className='border-r border-l text-center'>
                            {brand.website ? (
                                <Button asChild variant='ghost' size='sm'>
                                    <a
                                        href={brand.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title={brand.website}
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </Button>
                            ) : '–'}
                        </TableCell>
                        <TableCell className='border-r border-l text-center'>{brand._count?.products || 0}</TableCell>
                        <TableCell className='border-r border-l text-center'>{brand.sortOrder}</TableCell>
                        <TableCell className='border-r border-l text-center'>
                            {brand.isActive ? (
                                <Check className='w-4 h-4 text-green-600 mx-auto' />
                            ) : (
                                <X className='w-4 h-4 text-red-600 mx-auto' />
                            )}
                        </TableCell>
                        <TableCell className='flex justify-center gap-1'>
                            <Button asChild variant='ghost' size='sm'>
                                <Link href={`/admin/products/category/update-brand/${brand.id}`}>
                                    <Pencil className="w-4 h-4" />
                                </Link>
                            </Button>
                            {brand._count?.products > 0 ? (
                                <Button
                                    variant='outline'
                                    size='sm'
                                    disabled
                                    title={`Cannot delete: brand has ${brand._count.products} products`}
                                >
                                    Delete
                                </Button>
                            ) : (
                                <DeleteDialog id={brand.id} action={deleteBrand} />
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default BrandTable;