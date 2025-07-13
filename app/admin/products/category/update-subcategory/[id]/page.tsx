import { Metadata } from "next";
import { getSubcategoryById, getCategories } from "@/lib/actions/product.actions";
import { notFound } from "next/navigation";
import UpdateSubcategoryForm from "@/components/admin/forms/update-subcategory-form";

export const metadata: Metadata = {
    title: 'Subcategory Update',
};

const UpdateSubcategoryPage = async (props: {
    params: Promise<{ id: string }>
}) => {
    const { id } = await props.params;

    // Получаем подкатегорию
    const subcategoryResponse = await getSubcategoryById(id);
    if (!subcategoryResponse.success) {
        return notFound();
    }

    // Получаем все доступные категории
    const categoriesResponse = await getCategories();
    if (!categoriesResponse.success) {
        return <div>Error loading categories</div>;
    }

    return (
        <div className="">
            <p>
                Update subcategory {subcategoryResponse.data?.name}
            </p>
            <UpdateSubcategoryForm
                subcategory={subcategoryResponse.data!}
                categories={categoriesResponse.data || []}
            />
        </div>
    );
}

export default UpdateSubcategoryPage;