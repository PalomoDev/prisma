import CreateSpecificationForm from "@/components/admin/forms/specification-form";
import { getCategoriesLight } from "@/lib/actions/new/category/get.actions";
import { redirect } from "next/navigation";

const CreateSpecificationPage = async () => {
  // Получаем все активные категории для формы
  const categoriesResult = await getCategoriesLight(true); // activeOnly = true

  // Если не удалось получить категории, перенаправляем обратно
  if (!categoriesResult.success || !categoriesResult.data) {
    redirect("/admin/products/specifications");
  }

  return (
    <div>
      <CreateSpecificationForm categories={categoriesResult.data} />
    </div>
  );
};

export default CreateSpecificationPage;
