import CreateCategoryForm from "@/components/admin/forms/category-form";
import {getSubcategories} from "@/lib/actions/subcategory.actions";


const CreateCategoryPage = async () => {

    const activeSubcategories = await getSubcategories(true);

    return (
        <div>

            {activeSubcategories.data && <CreateCategoryForm subcategories={activeSubcategories.data}/>}
        </div>
    )
}

export default CreateCategoryPage;