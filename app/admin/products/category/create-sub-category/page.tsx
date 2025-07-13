import CreateSubcategoryForm from "@/components/admin/forms/subcategory-form";
import {getCategories} from "@/lib/actions/category.actions";


const CreateSubCategoryPage = async () => {

    const categories = await getCategories()

    return (
        <div>
            Create SubCategory
            <CreateSubcategoryForm categories={categories}/>
        </div>
    )
}

export default CreateSubCategoryPage;