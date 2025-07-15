import CreateSubcategoryForm from "@/components/admin/forms/subcategory-form";
import { getCategoriesFull } from "@/lib/actions/new/category/get.actions";

const CreateSubCategoryPage = async () => {
  const categories = await getCategoriesFull();

  return (
    <div>
      Create SubCategory
      <CreateSubcategoryForm categories={categories} />
    </div>
  );
};

export default CreateSubCategoryPage;
