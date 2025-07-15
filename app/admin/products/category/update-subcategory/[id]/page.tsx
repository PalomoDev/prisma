import { Metadata } from "next";
import { getSubcategoryById } from "@/lib/actions/new/subcategory/manage.actions";
import { getCategoriesFull } from "@/lib/actions/new/category/get.actions";
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
    const categoriesResponse = await getCategoriesFull();
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