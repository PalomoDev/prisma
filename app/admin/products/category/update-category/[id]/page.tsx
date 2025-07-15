import { Metadata } from "next";
import { getCategoryById } from "@/lib/actions/new/category/manage.actions";
import { getSubcategoriesFull } from "@/lib/actions/new/subcategory/get.actions";
import { notFound } from "next/navigation";
import { prismaToJson } from "@/lib/utils/prisma-serializer";
import UpdateCategoryForm from "@/components/admin/forms/update-category-form";

export const metadata: Metadata = {
  title: "Category Update",
};

const UpdateCategoryPage = async (props: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await props.params;

  // Получаем категорию
  const categoryResponse = await getCategoryById(id);
  if (!categoryResponse.success) {
    return notFound();
  }

  // Получаем все доступные подкатегории
  const subcategoriesResponse = await getSubcategoriesFull();
  if (!subcategoriesResponse.success) {
    return <div>Error loading subcategories</div>;
  }

  return (
    <div className="">
      <p>Update category {categoryResponse.data?.name}</p>
      <UpdateCategoryForm
        category={categoryResponse.data!}
        subcategories={subcategoriesResponse.data || []}
      />
    </div>
  );
};

export default UpdateCategoryPage;
