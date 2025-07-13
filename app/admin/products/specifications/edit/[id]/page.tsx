import { getSpecificationById } from "@/lib/actions/spec-features.actions";
import { getCategories } from "@/lib/actions/product.actions";
import { redirect } from "next/navigation";
import UpdateSpecificationForm from "@/components/admin/forms/update-specification-form";

const SpecificationEditPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    // Параллельно получаем спецификацию и категории
    const [specificationResult, categoriesResult] = await Promise.all([
        getSpecificationById(id),
        getCategories(true) // activeOnly = true
    ]);

    // Проверяем результат получения спецификации
    if (!specificationResult.success || !specificationResult.data) {
        redirect('/admin/products/specifications');
    }

    // Проверяем результат получения категорий
    if (!categoriesResult.success || !categoriesResult.data) {
        redirect('/admin/products/specifications');
    }

    return (
        <div>
            <UpdateSpecificationForm
                specification={specificationResult.data}
                categories={categoriesResult.data}
            />
        </div>
    );
}

export default SpecificationEditPage;