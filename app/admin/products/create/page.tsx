import { Metadata } from "next";
import CreateProductForm from "@/components/admin/forms/product-form";
import { requireAdmin } from "@/lib/auth-guard";
import {
  getAllFeatures,
  getAllSpecifications,
} from "@/lib/actions/spec-features.actions";
import { getCategories } from "@/lib/actions/category.actions";
import { getSubcategoriesFull } from "@/lib/actions/new/subcategory/get.actions";
import { getBrands } from "@/lib/actions/new/brand/brand.actions";

export const metadata: Metadata = {
  title: "Create Product",
};

const CreateProductPage = async () => {
  await requireAdmin();
  try {
    // Получаем все необходимые данные параллельно
    const [categories, subcategories, brands, features, specifications] =
      await Promise.all([
        getCategories(true),
        getSubcategoriesFull(true),
        getBrands(true),
        getAllFeatures(true),
        getAllSpecifications(true),
      ]);

    console.log("📋 Categories result:", {
      success: categories.success,
      count: categories.data?.length || 0,
      data: categories.data?.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
      })),
    });

    console.log("📋 Subcategories result:", {
      success: subcategories.success,
      count: subcategories.data?.length || 0,
      data: subcategories.data?.map((sub) => ({
        id: sub.id,
        name: sub.name,
        slug: sub.slug,
      })),
    });

    console.log("🏷️ Brands result:", {
      success: brands.success,
      count: brands.data?.length || 0,
      data: brands.data?.map((brand) => ({
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
      })),
    });

    console.log("⭐ Features result:", {
      success: features.success,
      count: features.data?.length || 0,
      data: features.data?.map((feature) => ({
        id: feature.id,
        name: feature.name,
        key: feature.key,
        icon: feature.icon,
      })),
    });

    console.log("📊 Specifications result:", {
      success: specifications.success,
      count: specifications.data?.length || 0,
      data: specifications.data?.map((spec) => ({
        id: spec.id,
        name: spec.name,
        key: spec.key,
        type: spec.type,
        unit: spec.unit,
      })),
    });

    // Проверяем на ошибки
    if (!categories.success) {
      console.error("❌ Error loading categories:", categories.message);
    }

    if (!subcategories.success) {
      console.error("❌ Error loading subcategories:", subcategories.message);
    }

    if (!brands.success) {
      console.error("❌ Error loading brands:", brands.message);
    }

    if (!features.success) {
      console.error("❌ Error loading features:", features.message);
    }

    if (!specifications.success) {
      console.error("❌ Error loading specifications:", specifications.message);
    }

    console.log("✅ CreateProductPage: Все данные загружены успешно");

    return (
      <div className="my-8">
        <CreateProductForm
          categories={categories}
          subcategories={subcategories}
          brands={brands}
          features={features}
          specifications={specifications}
        />
      </div>
    );
  } catch (error) {
    console.error(
      "💥 CreateProductPage: Критическая ошибка при загрузке данных:",
      error
    );

    return (
      <div className="my-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-red-600">
            Error Loading Data
          </h1>
          <p className="text-red-500 mt-2">
            Произошла ошибка при загрузке данных. Проверьте консоль для деталей.
          </p>
        </div>
      </div>
    );
  }
};

export default CreateProductPage;
