"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createCategorySchema,
  SubcategorySchema,
} from "@/lib/validations/category.validation";
import { categoryDefaultValues } from "@/lib/constants";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import slugify from "slugify";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { createCategory } from "@/lib/actions/new/category/manage.actions";

type CreateCategoryInput = z.infer<typeof createCategorySchema>;
type SubCategory = z.infer<typeof SubcategorySchema>;
interface CreateCategoryFormProps {
  subcategories: SubCategory[];
}

const CreateCategoryForm = ({ subcategories }: CreateCategoryFormProps) => {
  const form = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: categoryDefaultValues,
    mode: "onChange",
  });

  const router = useRouter();

  const handleSubmit = async (values: CreateCategoryInput) => {
    try {
      const res = await createCategory(values);

      if (res.success) {
        form.reset(categoryDefaultValues);
        router.push("/admin/products/category");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      // Здесь можно показать ошибку пользователю через toast
    }
  };

  const handleGenerateSlug = () => {
    const name = form.getValues("name");
    if (name) {
      const generatedSlug = slugify(name, { lower: true, strict: true });
      form.setValue("slug", generatedSlug, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const handleCancelForm = () => {
    router.push("/admin/products/category");
  };

  return (
    <div className="mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create New Category</h1>
        <p className="text-muted-foreground">
          Fill in the details to create a new category
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-8"
          noValidate
        >
          {/* Name and Slug */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>
                    Category Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>
                    Slug <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input placeholder="Enter category slug" {...field} />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleGenerateSlug}
                      >
                        Generate from Name
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter category description (optional)"
                    className="resize-none min-h-24"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  Optional description for the category
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Sort Order */}
          <FormField
            control={form.control}
            name="sortOrder"
            render={({ field }) => (
              <FormItem className="max-w-xs">
                <FormLabel>
                  Sort Order <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseInt(e.target.value) : 0
                      )
                    }
                  />
                </FormControl>
                <FormDescription>
                  Lower numbers appear first. Use 0 for highest priority.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Subcategories Selection */}
          <FormField
            control={form.control}
            name="subcategoryIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subcategories</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    {/* Выпадающий список для выбора */}
                    <select
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value && !field.value?.includes(value)) {
                          field.onChange([...(field.value || []), value]);
                        }
                      }}
                      value=""
                    >
                      <option value="">Select subcategory...</option>
                      {subcategories.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}
                        </option>
                      ))}
                    </select>

                    {/* Отображение выбранных подкатегорий */}
                    {field.value && field.value.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Selected subcategories:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {field.value.map((id) => {
                            const sub = subcategories.find((s) => s.id === id);
                            return (
                              <div
                                key={id}
                                className="inline-flex items-center gap-1 rounded-md bg-secondary px-2.5 py-1 text-sm"
                              >
                                <span>{sub?.name || "Unknown"}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    field.onChange(
                                      field.value?.filter((v) => v !== id)
                                    );
                                  }}
                                  className="ml-1 rounded-sm hover:bg-secondary-foreground/20"
                                  aria-label={`Remove ${sub?.name}`}
                                >
                                  <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 14 14"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="text-muted-foreground"
                                  >
                                    <path
                                      d="M11.5 3.5L3.5 11.5M3.5 3.5L11.5 11.5"
                                      stroke="currentColor"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  Select subcategories that belong to this category
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Is Active Checkbox */}
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-label="Active Category"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Active Category</FormLabel>
                  <FormDescription>
                    This category will be visible to customers when active
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={handleCancelForm}
              disabled={form.formState.isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={form.formState.isSubmitting}
              className="flex-1"
            >
              {form.formState.isSubmitting
                ? "Creating Category..."
                : "Create Category"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateCategoryForm;
