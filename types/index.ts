// noinspection JSUnusedLocalSymbols
import { z } from "zod";
import { Control } from "react-hook-form";

// ========================================
// CART IMPORTS AND TYPES
// ========================================
import {
  cartItemSchema,
  insertCartSchema,
  updateCartSchema,
  getCartByIdSchema,
  getCartBySessionSchema,
  addToCartSchema,
  updateCartItemSchema,
  removeFromCartSchema,
  clearCartSchema,
  cartResponseSchema,
  cartActionResponseSchema,
} from "@/lib/validations/cart.validation";

// Cart types
export type CartItem = z.infer<typeof cartItemSchema>;
export type Cart = z.infer<typeof insertCartSchema>;
export type InsertCart = z.infer<typeof insertCartSchema>;
export type UpdateCart = z.infer<typeof updateCartSchema>;
export type GetCartById = z.infer<typeof getCartByIdSchema>;
export type GetCartBySession = z.infer<typeof getCartBySessionSchema>;
export type AddToCart = z.infer<typeof addToCartSchema>;
export type UpdateCartItem = z.infer<typeof updateCartItemSchema>;
export type RemoveFromCart = z.infer<typeof removeFromCartSchema>;
export type ClearCart = z.infer<typeof clearCartSchema>;
export type CartResponse = z.infer<typeof cartResponseSchema>;
export type CartActionResponse = z.infer<typeof cartActionResponseSchema>;

// ========================================
// CATEGORY AND SUBCATEGORY IMPORTS AND TYPES
// ========================================
import {
  createCategorySchema,
  CategorySchema,
  updateCategorySchema,
  getCategoryByIdSchema,
  getCategoryBySlugSchema,
  deleteCategorySchema,
  createSubcategorySchema,
  SubcategorySchema,
  updateSubcategorySchema,
  getSubcategoryByIdSchema,
  getSubcategoriesByCategoryIdSchema,
  deleteSubcategorySchema,
  createCategorySubcategorySchema,
  createMultipleCategorySubcategorySchema,
  deleteCategorySubcategorySchema,
  GetCategoriesResponseSchema,
  GetSubcategoriesResponseSchema,
  idsArraySchema,
  slugSchema,
  paginationSchema,
  categoryWithRelationsSchema,
  getCategoryByIdResponseSchema,
  brandWithRelationsSchema,
  getBrandByIdResponseSchema,
  subcategoryWithRelationsSchema,
  getSubcategoryByIdResponseSchema,
} from "@/lib/validations/category.validation";

// Category types
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type Category = z.infer<typeof CategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type GetCategoryByIdInput = z.infer<typeof getCategoryByIdSchema>;
export type GetCategoryBySlugInput = z.infer<typeof getCategoryBySlugSchema>;
export type DeleteCategoryInput = z.infer<typeof deleteCategorySchema>;
export type CategoryWithRelations = z.infer<typeof categoryWithRelationsSchema>;
export type GetCategoryByIdResponse = z.infer<
  typeof getCategoryByIdResponseSchema
>;

// Subcategory types
export type CreateSubcategoryInput = z.infer<typeof createSubcategorySchema>;
export type Subcategory = z.infer<typeof SubcategorySchema>;
export type UpdateSubcategoryInput = z.infer<typeof updateSubcategorySchema>;
export type GetSubcategoryByIdInput = z.infer<typeof getSubcategoryByIdSchema>;
export type GetSubcategoriesByCategoryIdInput = z.infer<
  typeof getSubcategoriesByCategoryIdSchema
>;
export type DeleteSubcategoryInput = z.infer<typeof deleteSubcategorySchema>;

export type SubcategoryWithRelations = z.infer<
  typeof subcategoryWithRelationsSchema
>;
export type GetSubcategoryByIdResponse = z.infer<
  typeof getSubcategoryByIdResponseSchema
>;

// Category-Subcategory relation types
export type CreateCategorySubcategoryInput = z.infer<
  typeof createCategorySubcategorySchema
>;
export type CreateMultipleCategorySubcategoryInput = z.infer<
  typeof createMultipleCategorySubcategorySchema
>;
export type DeleteCategorySubcategoryInput = z.infer<
  typeof deleteCategorySubcategorySchema
>;

// Response types
export type GetCategoriesResponse = z.infer<typeof GetCategoriesResponseSchema>;
export type GetSubcategoriesResponse = z.infer<
  typeof GetSubcategoriesResponseSchema
>;

// Utility types from category validation
export type IdsArray = z.infer<typeof idsArraySchema>;
export type Slug = z.infer<typeof slugSchema>;
export type Pagination = z.infer<typeof paginationSchema>;

// ========================================
// BRAND IMPORTS AND TYPES
// ========================================
import {
  createBrandSchema,
  brandSchema,
  updateBrandSchema,
  getBrandByIdSchema,
  getBrandBySlugSchema,
  deleteBrandSchema,
  brandsResponseSchema,
  brandResponseSchema,
} from "@/lib/validations/category.validation";

export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export type Brand = z.infer<typeof brandSchema>;
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;
export type GetBrandByIdInput = z.infer<typeof getBrandByIdSchema>;
export type GetBrandBySlugInput = z.infer<typeof getBrandBySlugSchema>;
export type DeleteBrandInput = z.infer<typeof deleteBrandSchema>;
export type BrandsResponse = z.infer<typeof brandsResponseSchema>;
export type BrandResponse = z.infer<typeof brandResponseSchema>;
export type BrandWithRelations = z.infer<typeof brandWithRelationsSchema>;
export type GetBrandByIdResponse = z.infer<typeof getBrandByIdResponseSchema>;

// Simple response type for components
export type GetBrandsResponse = z.infer<typeof brandsResponseSchema>;

// ========================================
// FEATURE IMPORTS AND TYPES
// ========================================
import {
  createFeatureSchema,
  featureSchema,
  updateFeatureSchema,
  getFeatureByIdSchema,
  getFeatureByKeySchema,
  deleteFeatureSchema,
  featuresResponseSchema,
  featureResponseSchema,
} from "@/lib/validations/category.validation";

export type CreateFeatureInput = z.infer<typeof createFeatureSchema>;
export type Feature = z.infer<typeof featureSchema>;
export type UpdateFeatureInput = z.infer<typeof updateFeatureSchema>;
export type GetFeatureByIdInput = z.infer<typeof getFeatureByIdSchema>;
export type GetFeatureByKeyInput = z.infer<typeof getFeatureByKeySchema>;
export type DeleteFeatureInput = z.infer<typeof deleteFeatureSchema>;
export type FeaturesResponse = z.infer<typeof featuresResponseSchema>;
export type FeatureResponse = z.infer<typeof featureResponseSchema>;

// Simple response type for components
export type GetFeaturesResponse = {
  success: boolean;
  data?: Feature[];
  message?: string;
};

// ========================================
// PRODUCT IMPORTS AND TYPES
// ========================================
import {
  insertProductSchema,
  updateProductSchema,
  getProductByIdSchema,
  deleteProductSchema,
  productSpecificationResponseSchema,
  productFeatureResponseSchema,
  productSubcategoryResponseSchema,
  productCategoryResponseSchema,
  productBrandResponseSchema,
  productResponseSchema,
  getAllProductsResponseSchema,
  getProductResponseSchema,
  productActionResponseSchema,
  getGalleryProductResponseSchema,
  productShortResponseSchema,
} from "@/lib/validations/product.validation";

export type InsertProductSchema = z.infer<typeof insertProductSchema>;
export type UpdateProductSchema = z.infer<typeof updateProductSchema>;
export type GetProductByIdInput = z.infer<typeof getProductByIdSchema>;
export type DeleteProductInput = z.infer<typeof deleteProductSchema>;
export type ProductSpecification = z.infer<
  typeof productSpecificationResponseSchema
>;
export type ProductFeature = z.infer<typeof productFeatureResponseSchema>;
export type ProductSubcategory = z.infer<
  typeof productSubcategoryResponseSchema
>;
export type ProductCategory = z.infer<typeof productCategoryResponseSchema>;
export type ProductBrand = z.infer<typeof productBrandResponseSchema>;
export type ProductResponse = z.infer<typeof productResponseSchema>;
export type GetAllProductsResponse = z.infer<
  typeof getAllProductsResponseSchema
>;
export type GetProductResponse = z.infer<typeof getProductResponseSchema>;
export type ProductActionResponse = z.infer<typeof productActionResponseSchema>;
export type ProductsGalleryResponse = z.infer<
  typeof getGalleryProductResponseSchema
>;
export type ProductFromGallery = z.infer<typeof productShortResponseSchema>;

// Legacy product type (if needed for compatibility)
export type Product = z.infer<typeof updateProductSchema> & {
  id: string;
  rating: string;
  numReviews: number;
  createdAt: Date;
};

// ========================================
// USER AND SHIPPING IMPORTS AND TYPES
// ========================================
import {
  UserRoleEnum,
  createUserSchema,
  updateUserSchema,
  loginUserSchema,
  changePasswordSchema,
  getUserByIdSchema,
  shippingAddressSchema,
  signUpFormSchema,
  paymentMethodSchema,
} from "@/lib/validations/user.validation";

export type UserRole = z.infer<typeof UserRoleEnum>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type GetUserByIdInput = z.infer<typeof getUserByIdSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type SignUpFormInput = z.infer<typeof signUpFormSchema>;
export type PaymentMethodInput = z.infer<typeof paymentMethodSchema>;

// ========================================
// UNIT VALIDATION IMPORTS AND TYPES
// ========================================
import { currency } from "@/lib/validations/unit.validation";
import {
  bulkImportSpecificationsSchema,
  categorySpecificationSchema,
  categorySpecificationsResponseSchema,
  createCategorySpecificationSchema,
  createMultipleCategorySpecificationSchema,
  createMultipleProductSpecificationValueSchema,
  createProductSpecificationValueSchema,
  createSpecificationSchema,
  deleteCategorySpecificationSchema,
  deleteProductSpecificationValueSchema,
  deleteSpecificationSchema,
  getProductSpecificationValuesByProductIdSchema,
  getSpecificationByIdSchema,
  getSpecificationByKeySchema,
  getSpecificationsByCategoryIdSchema,
  groupedProductSpecificationValuesResponseSchema,
  productSpecificationFilterSchema,
  productSpecificationValueSchema,
  productSpecificationValuesResponseSchema,
  specificationCategorySchema,
  specificationFilterSchema,
  specificationResponseSchema,
  specificationsByCategoryResponseSchema,
  specificationSchema,
  specificationsResponseSchema,
  specificationTypeSchema,
  updateCategorySpecificationSchema,
  updateMultipleProductSpecificationValueSchema,
  updateProductSpecificationValueSchema,
  updateSpecificationSchema,
  validateSpecificationValueSchema,
} from "@/lib/validations/specification.validation";

export type Currency = z.infer<typeof currency>;

// ========================================
// FORM COMPONENT TYPES
// ========================================

// Shipping address form field configuration
export interface ShippingAddressFormFieldConfig {
  name: keyof ShippingAddress;
  label: string;
  placeholder?: string;
  type?: string;
  className?: string;
}

// Shipping address form field props
export interface ShippingAddressFormFieldProps {
  key: string;
  name: keyof ShippingAddress;
  label: string;
  placeholder?: string;
  control: Control<ShippingAddress>;
  className?: string;
  type?: string;
}

// ========================================
// UTILITY TYPES
// ========================================

// Generic API response type
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Pagination parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Search parameters
export interface SearchParams extends PaginationParams {
  query?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
}

// Form submission states
export interface FormState {
  isSubmitting: boolean;
  isValid: boolean;
  errors: Record<string, string>;
}

// Generic ID parameter
export interface IdParam {
  id: string;
}

// Generic slug parameter
export interface SlugParam {
  slug: string;
}

// ========================================
// SPECIFICATION TYPES - Типы для спецификаций
// ========================================

// Основные типы
type CreateSpecification = z.infer<typeof createSpecificationSchema>;
type Specification = z.infer<typeof specificationSchema>;
type UpdateSpecification = z.infer<typeof updateSpecificationSchema>;
type GetSpecificationById = z.infer<typeof getSpecificationByIdSchema>;
type GetSpecificationByKey = z.infer<typeof getSpecificationByKeySchema>;
type DeleteSpecification = z.infer<typeof deleteSpecificationSchema>;

// Связи категорий и спецификаций
type CreateCategorySpecification = z.infer<
  typeof createCategorySpecificationSchema
>;
type CategorySpecification = z.infer<typeof categorySpecificationSchema>;
type CreateMultipleCategorySpecification = z.infer<
  typeof createMultipleCategorySpecificationSchema
>;
type UpdateCategorySpecification = z.infer<
  typeof updateCategorySpecificationSchema
>;
type DeleteCategorySpecification = z.infer<
  typeof deleteCategorySpecificationSchema
>;
type GetSpecificationsByCategory = z.infer<
  typeof getSpecificationsByCategoryIdSchema
>;

// Значения спецификаций товаров
type CreateProductSpecificationValue = z.infer<
  typeof createProductSpecificationValueSchema
>;
type ProductSpecificationValue = z.infer<
  typeof productSpecificationValueSchema
>;
type CreateMultipleProductSpecificationValue = z.infer<
  typeof createMultipleProductSpecificationValueSchema
>;
type UpdateProductSpecificationValue = z.infer<
  typeof updateProductSpecificationValueSchema
>;
type UpdateMultipleProductSpecificationValue = z.infer<
  typeof updateMultipleProductSpecificationValueSchema
>;
type DeleteProductSpecificationValue = z.infer<
  typeof deleteProductSpecificationValueSchema
>;
type GetProductSpecificationValues = z.infer<
  typeof getProductSpecificationValuesByProductIdSchema
>;

// Ответы API
type SpecificationsResponse = z.infer<typeof specificationsResponseSchema>;
type SpecificationResponse = z.infer<typeof specificationResponseSchema>;
type CategorySpecificationsResponse = z.infer<
  typeof categorySpecificationsResponseSchema
>;
type SpecificationsByCategoryResponse = z.infer<
  typeof specificationsByCategoryResponseSchema
>;
type ProductSpecificationValuesResponse = z.infer<
  typeof productSpecificationValuesResponseSchema
>;
type GroupedProductSpecificationValuesResponse = z.infer<
  typeof groupedProductSpecificationValuesResponseSchema
>;

// Фильтрация
type SpecificationFilter = z.infer<typeof specificationFilterSchema>;
type ProductSpecificationFilter = z.infer<
  typeof productSpecificationFilterSchema
>;

// Утилиты
type ValidateSpecificationValue = z.infer<
  typeof validateSpecificationValueSchema
>;
type SpecificationType = z.infer<typeof specificationTypeSchema>;
type SpecificationCategory = z.infer<typeof specificationCategorySchema>;
type BulkImportSpecifications = z.infer<typeof bulkImportSpecificationsSchema>;

export interface GetSpecificationsResponse {
  success: boolean;
  data?: Array<{
    id: string;
    name: string;
    key: string;
    description: string | null;
    unit: string | null;
    type: string;
    options: string[];
    icon: string | null;
    category: string | null;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
    categorySpecs: Array<{
      category: {
        id: string;
        name: string;
        slug: string;
      };
    }>;
    _count: {
      productSpecifications: number;
    };
  }>;
  message?: string;
}

// Тип для фильтрации продуктов (облегчённая категория с подкатегориями)
export type CategoryLightWithSubcategories = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  sortOrder: number;
  categorySubcategories: Array<{
    id: string;
    categoryId: string;
    subcategoryId: string;
    sortOrder: number;
    subcategory: {
      id: string;
      name: string;
      slug: string;
      description: string | null;
      image: string | null;
      isActivity: boolean;
      isActive: boolean;
      sortOrder: number;
    };
  }>;
  _count: { products: number };
};
