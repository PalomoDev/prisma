import CreateSpecificationForm from "@/components/admin/forms/specification-form";
import { getCategories } from "@/lib/actions/product.actions";
import { redirect } from "next/navigation";

const CreateSpecificationPage = async () => {
    // Получаем все активные категории для формы
    const categoriesResult = await getCategories(true); // activeOnly = true

    // Если не удалось получить категории, перенаправляем обратно
    if (!categoriesResult.success || !categoriesResult.data) {
        redirect('/admin/products/specifications');
    }

    return (
        <div>
            <CreateSpecificationForm categories={categoriesResult.data} />
        </div>
    );
};

export default CreateSpecificationPage;