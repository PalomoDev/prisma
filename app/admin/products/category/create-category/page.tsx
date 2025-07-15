import CreateCategoryForm from "@/components/admin/forms/category-form";
import { getSubcategoriesFull } from "@/lib/actions/new/subcategory/get.actions";

const CreateCategoryPage = async () => {
  const activeSubcategories = await getSubcategoriesFull(true);

  return (
    <div>
      {activeSubcategories.data && (
        <CreateCategoryForm subcategories={activeSubcategories.data} />
      )}
    </div>
  );
};

export default CreateCategoryPage;
