"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateSubcategorySchema } from "@/lib/validations/new/subcategory.validation";
import { CategoryFullSchema } from "@/lib/validations/new/category.validation";
import { updateSubcategory } from "@/lib/actions/new/subcategory/manage.actions";
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
import { UploadButton } from "@/lib/uploadthing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { toast } from "sonner";
import { useCallback, useState } from "react";
import slugify from "slugify";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { SubcategoryWithRelations } from "@/types";

type UpdateSubcategoryInput = z.infer<typeof UpdateSubcategorySchema>;
type Category = z.infer<typeof CategoryFullSchema>;

interface UpdateSubcategoryFormProps {
  subcategory: SubcategoryWithRelations;
  categories: Category[];
}

const UpdateSubcategoryForm = ({
  subcategory,
  categories,
}: UpdateSubcategoryFormProps) => {
  // Извлекаем ID выбранных категорий из данных подкатегории
  const selectedCategoryIds = subcategory.categorySubcategories.map(
    (cs) => cs.category.id
  );

  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<UpdateSubcategoryInput>({
    resolver: zodResolver(UpdateSubcategorySchema),
    defaultValues: {
      id: subcategory.id,
      name: subcategory.name,
      slug: subcategory.slug,
      description: subcategory.description || "",
      image: subcategory.image || "",
      isActivity: subcategory.isActivity,
      isActive: subcategory.isActive,
      sortOrder: subcategory.sortOrder,
      categoryIds: selectedCategoryIds,
    },
    mode: "onChange",
  });

  const router = useRouter();

  const handleSubmit = async (values: UpdateSubcategoryInput) => {
    try {
      const res = await updateSubcategory(values);

      if (res.success) {
        router.push("/admin/products/category");
      }
    } catch (error) {
      console.error("Error updating subcategory:", error);
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

  const image = form.watch("image");

  // Функция для обработки успешной загрузки изображения
  const handleImageUploadComplete = useCallback(
    (res: { url: string }[]) => {
      if (res && res[0] && res[0].url) {
        form.setValue("image", res[0].url);
        toast.success("Image uploaded successfully!");
      }
      setIsUploading(false);
    },
    [form]
  );

  // Функция для обработки ошибки загрузки изображения
  const handleImageUploadError = useCallback((error: Error) => {
    console.error("Upload error:", error.message);
    toast.error(`Upload failed: ${error.message}`);
    setIsUploading(false);
  }, []);

  // Функция для удаления изображения
  const handleRemoveImage = useCallback(() => {
    form.setValue("image", null);
    toast.info("Image removed");
  }, [form]);

  const handleCancelForm = () => {
    router.push("/admin/products/category");
  };

  return (
    <div className="mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Update Subcategory</h1>
        <p className="text-muted-foreground">Update the subcategory details</p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-8"
          noValidate
        >
          {/* Hidden ID field */}
          <input type="hidden" {...form.register("id")} />

          {/* Name and Slug */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>
                    Subcategory Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter subcategory name" {...field} />
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
                      <Input placeholder="Enter subcategory slug" {...field} />
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
                    placeholder="Enter subcategory description (optional)"
                    className="resize-none min-h-24"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  Optional description for the subcategory
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Subcategory Image</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormLabel>Image (Optional)</FormLabel>
                    <div className="space-y-4">
                      {image ? (
                        <div className="relative w-fit">
                          <Image
                            src={image}
                            alt="Subcategory image"
                            className="w-32 h-32 object-cover rounded-md border"
                            width={128}
                            height={128}
                            unoptimized
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                            onClick={handleRemoveImage}
                            disabled={isUploading}
                          >
                            ×
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-md">
                          {!isUploading ? (
                            <UploadButton
                              key="upload-button"
                              endpoint="imageUploader"
                              onClientUploadComplete={handleImageUploadComplete}
                              onUploadError={handleImageUploadError}
                              onUploadBegin={() => setIsUploading(true)}
                            />
                          ) : (
                            <div className="text-sm text-muted-foreground">
                              Uploading...
                            </div>
                          )}
                          <p className="text-sm text-muted-foreground mt-2">
                            Upload subcategory image (optional)
                          </p>
                        </div>
                      )}
                    </div>
                    <FormDescription>
                      Optional image for the subcategory
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

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

          {/* Categories Selection */}
          <FormField
            control={form.control}
            name="categoryIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categories</FormLabel>
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
                      <option value="">Select category...</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>

                    {/* Отображение выбранных категорий */}
                    {field.value && field.value.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Selected categories:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {field.value.map((id: string) => {
                            const category = categories.find(
                              (c) => c.id === id
                            );
                            return (
                              <div
                                key={id}
                                className="inline-flex items-center gap-1 rounded-md bg-secondary px-2.5 py-1 text-sm"
                              >
                                <span>{category?.name || "Unknown"}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    field.onChange(
                                      field.value?.filter(
                                        (v: string) => v !== id
                                      )
                                    );
                                  }}
                                  className="ml-1 rounded-sm hover:bg-secondary-foreground/20"
                                  aria-label={`Remove ${category?.name}`}
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
                  Select categories that this subcategory belongs to
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Is Activity Checkbox */}
          <FormField
            control={form.control}
            name="isActivity"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-label="Activity Subcategory"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Activity Subcategory</FormLabel>
                  <FormDescription>
                    Mark this subcategory as an activity (for activity menu
                    display)
                  </FormDescription>
                </div>
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
                    aria-label="Active Subcategory"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Active Subcategory</FormLabel>
                  <FormDescription>
                    This subcategory will be visible to customers when active
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
              disabled={form.formState.isSubmitting || isUploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={form.formState.isSubmitting || isUploading}
              className="flex-1"
            >
              {form.formState.isSubmitting
                ? "Updating Subcategory..."
                : isUploading
                ? "Uploading Image..."
                : "Update Subcategory"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UpdateSubcategoryForm;
