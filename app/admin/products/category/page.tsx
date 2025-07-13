import { Metadata } from 'next';

import { requireAdmin } from '@/lib/auth-guard';
import CategoryTable from "@/components/admin/tables/category-table";
import SubCategoryTable from "@/components/admin/tables/subcategory-table";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import BrandTable from "@/components/admin/tables/brand-table";
import {getSubcategories} from "@/lib/actions/subcategory.actions";
import {getCategories} from "@/lib/actions/category.actions";
import {getBrands} from "@/lib/actions/brand.actions";

export const metadata: Metadata = {
    title: 'Category',
};

const CreateCategoryPage = async () => {
    await requireAdmin();

    const subcategories = await getSubcategories();
    const categories = await getCategories();
    const brands = await getBrands();
    console.log(subcategories)
    console.log(categories)
    return (
        <div className={'flex flex-col gap-4'}>

            <div className='my-2'>
                <div className={'flex justify-between'}>
                    <h2 className={'h2-bold uppercase'}>Brands list</h2>
                    <Button asChild className={'bg-amber-600 uppercase w-56'}>
                        <Link href="/admin/products/category/create-brand">Create New Brand</Link>
                    </Button>
                </div>

                <BrandTable brands={brands} />


            </div>


            <div className='my-2'>
                <div className={'flex justify-between'}>
                    <h2 className={'h2-bold uppercase'}>Categories list</h2>
                    <Button asChild className={'bg-amber-600 uppercase w-56'}>
                        <Link href="/admin/products/category/create-category">Create New Category</Link>
                    </Button>
                </div>

                <CategoryTable categories={categories} />


            </div>

            <div className='my-2'>
                <div className={'flex justify-between'}>
                    <h2 className={'h2-bold uppercase'}>Subcategories list</h2>
                    <Button asChild className={'bg-amber-600 uppercase w-56'}>
                        <Link href="/admin/products/category/create-sub-category">Create New SubCategory</Link>
                    </Button>
                </div>

                <SubCategoryTable subCategories={subcategories} />

            </div>
        </div>
    );
};

export default CreateCategoryPage;