import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import {Button} from "@/components/ui/button";
import Link from "next/link";



export default async function AdminPage() {

    const session = await auth();






    return (
        <div
            className="flex justify-center items-center w-full lg:w-1/2 gap-4">

            <Button type={'button'} variant={'default'}>
                <Link href="/admin/products/category">
                    Brand & Category & SubCategory
                </Link>
            </Button>
            <Button type={'button'} variant={'default'}>
                <Link href="/admin/products/specifications">
                    Specification & Features
                </Link>
            </Button>
            <Button type={'button'} variant={'default'}>
                <Link href="/admin/products">
                    Productos
                </Link>
            </Button>

            <Button type={'button'} variant={'default'}>
                <Link href="/admin/users">
                    Users
                </Link>
            </Button>



        </div>

    );
}
