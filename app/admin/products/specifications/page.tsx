// app/admin/products/specifications/page.tsx
import { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth-guard';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getSpecificationsFull } from "@/lib/actions/new/specification/get.actions";
import { getFeaturesFull } from "@/lib/actions/new/feature/get.actions";
import SpecificationsTable from "@/components/admin/tables/specifications-table";
import FeaturesTable from "@/components/admin/tables/features-table";

export const metadata: Metadata = {
    title: 'Especificaciones y Características',
};

const SpecificationsAndFeaturesPage = async () => {
    await requireAdmin();

    const specs = await getSpecificationsFull();
    const features = await getFeaturesFull();

    return (
        <div className="flex flex-col gap-10">
            <div>
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Especificaciones</h1>
                    <Button asChild>
                        <Link href="/admin/products/specifications/create">
                            Agregar especificación
                        </Link>
                    </Button>
                </div>

                {specs.success ? (
                    <SpecificationsTable specifications={specs.data || []} />
                ) : (
                    <div className="text-red-500 mt-4">Error: {specs.message}</div>
                )}
            </div>

            <div>
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Características</h1>
                    <Button asChild>
                        <Link href="/admin/products/features/create">
                            Agregar característica
                        </Link>
                    </Button>
                </div>

                {features.success ? (
                    <FeaturesTable features={features.data || []} />
                ) : (
                    <div className="text-red-500 mt-4">Error: {features.message}</div>
                )}
            </div>
        </div>
    );
};

export default SpecificationsAndFeaturesPage;