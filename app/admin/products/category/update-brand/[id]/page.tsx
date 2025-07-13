import { Metadata } from "next";
import { getBrandById } from "@/lib/actions/product.actions";
import { notFound } from "next/navigation";
import UpdateBrandForm from "@/components/admin/forms/update-brand-form";

export const metadata: Metadata = {
    title: 'Brand Update',
};

const UpdateBrandPage = async (props: {
    params: Promise<{ id: string }>
}) => {
    const { id } = await props.params;

    // Получаем бренд
    const brandResponse = await getBrandById(id);
    if (!brandResponse.success) {
        return notFound();
    }

    return (
        <div className="">
            <p>
                Update brand {brandResponse.data?.name}
            </p>
            <UpdateBrandForm brand={brandResponse.data!} />
        </div>
    );
}

export default UpdateBrandPage;