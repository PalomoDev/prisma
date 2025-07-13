import { getFeatureById } from "@/lib/actions/spec-features.actions";
import { redirect } from "next/navigation";
import UpdateFeatureForm from "@/components/admin/forms/update-feature-form";

const FeatureEditPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    // Получаем особенность по ID
    const featureResult = await getFeatureById(id);

    // Проверяем результат получения особенности
    if (!featureResult.success || !featureResult.data) {
        redirect('/admin/products/features');
    }

    return (
        <div>
            <UpdateFeatureForm feature={featureResult.data} />
        </div>
    );
}

export default FeatureEditPage;