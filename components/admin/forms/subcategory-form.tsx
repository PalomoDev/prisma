"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateSubcategorySchema,
  CreateSubcategoryInput,
} from "@/lib/validations/new/subcategory.validation";
import { newSubcategoryDefaultValues } from "@/lib/constants";
import { createSubcategory } from "@/lib/actions/new/subcategory/manage.actions";
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
import { Category } from "@/types";
import { useRouter } from "next/navigation";
import { GetCategoriesFullResponse } from "@/lib/validations/new/category.validation";
import { UploadButton } from "@/lib/uploadthing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { toast } from "sonner";
import { useCallback, useState, useEffect, useRef } from "react";

interface CategoryTableProps {
  categories: GetCategoriesFullResponse;
}

// Изолированный компонент для безопасной загрузки изображений
const SafeImageUploader = ({
  onComplete,
  onError,
  onBegin,
  disabled,
  uploadKey,
}: {
  onComplete: (res: { url: string }[]) => void;
  onError: (error: Error) => void;
  onBegin: () => void;
  disabled: boolean;
  uploadKey: number;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Принудительная перерисовка через useEffect при изменении ключа
  useEffect(() => {
    // Это поможет React правильно отследить изменения
    if (containerRef.current) {
      // Добавляем атрибут для предотвращения Google Translate
      containerRef.current.setAttribute("translate", "no");
    }
  }, [uploadKey]);

  return (
    <div
      ref={containerRef}
      className="upload-container"
      key={`upload-wrapper-${uploadKey}`}
      translate="no"
    >
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={onComplete}
        onUploadError={onError}
        onUploadBegin={onBegin}
        disabled={disabled}
        className="border"
        appearance={{
          button:
            "ut-ready:bg-blue-500 ut-uploading:cursor-not-allowed ut-uploading:bg-gray-500",
          allowedContent: "text-sm text-gray-600",
          container: "w-full",
        }}
      />
    </div>
  );
};

const CreateSubcategoryForm = ({ categories }: CategoryTableProps) => {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadKey, setUploadKey] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<CreateSubcategoryInput>({
    resolver: zodResolver(CreateSubcategorySchema),
    defaultValues: newSubcategoryDefaultValues,
    mode: "onChange",
  });

  const image = form.watch("image");

  // Безопасная очистка состояния при размонтировании
  useEffect(() => {
    return () => {
      setIsUploading(false);
    };
  }, []);

  const handleSubmit = async (values: CreateSubcategoryInput) => {
    try {
      const res = await createSubcategory(values);

      if (res.success) {
        toast.success("Subcategory created successfully!");
        // Сброс формы после успешного создания
        form.reset(newSubcategoryDefaultValues);
        setUploadKey((prev) => prev + 1);
        router.push("/admin/products/category");
      } else {
        toast.error(res.message || "Failed to create subcategory");
      }
    } catch (error) {
      console.error("Error creating subcategory:", error);
      toast.error("An unexpected error occurred");
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

  const handleCancel = () => {
    // Безопасная очистка перед переходом
    setIsUploading(false);
    form.reset();
    router.push("/admin/products/category");
  };

  // Функция для обработки успешной загрузки изображения
  const handleImageUploadComplete = useCallback(
    (res: { url: string }[]) => {
      try {
        if (res && res[0] && res[0].url) {
          form.setValue("image", res[0].url, {
            shouldValidate: true,
            shouldDirty: true,
          });
          setUploadKey((prev) => prev + 1); // Принудительно обновляем ключ
          toast.success("Image uploaded successfully!");
        } else {
          toast.error("Upload failed: No valid image URL received");
        }
      } catch (error) {
        console.error("Error processing upload:", error);
        toast.error("Error processing uploaded image");
      } finally {
        setIsUploading(false);
      }
    },
    [form]
  );

  // Функция для обработки ошибки загрузки изображения
  const handleImageUploadError = useCallback((error: Error) => {
    console.error("Upload error:", error.message);
    toast.error(`Upload failed: ${error.message}`);
    setIsUploading(false);
  }, []);

  // Функция для начала загрузки
  const handleUploadBegin = useCallback(() => {
    setIsUploading(true);
  }, []);

  // Функция для удаления изображения
  const handleRemoveImage = useCallback(() => {
    try {
      form.setValue("image", null, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setUploadKey((prev) => prev + 1); // Обновляем ключ при удалении
      toast.info("Image removed");
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Error removing image");
    }
  }, [form]);

  return (
    <div className="mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          <span>Create New Subcategory</span>
        </h1>
        <p className="text-muted-foreground">
          <span>Fill in the details to create a new subcategory</span>
        </p>
      </div>

      <Form {...form}>
        <form
          ref={formRef}
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
                    <span>Subcategory Name</span>{" "}
                    <span className="text-red-500">*</span>
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
                    <span>Slug</span> <span className="text-red-500">*</span>
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
                        <span>Generate from Name</span>
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
                <FormLabel>
                  <span>Description</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter subcategory description (optional)"
                    className="resize-none min-h-24"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  <span>Optional description for the subcategory</span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>
                <span>Subcategory Image</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormLabel>
                      <span>Image (Optional)</span>
                    </FormLabel>
                    <div
                      className="space-y-4"
                      key={`image-section-${uploadKey}`}
                    >
                      {image ? (
                        <div className="relative w-fit group">
                          <Image
                            src={image}
                            alt="Subcategory image"
                            className="w-32 h-32 object-cover rounded-md border"
                            width={128}
                            height={128}
                            unoptimized
                            key={`image-${image.split("/").pop()}-${uploadKey}`}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={handleRemoveImage}
                            disabled={isUploading}
                            aria-label="Remove image"
                          >
                            <span>×</span>
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-md">
                          <SafeImageUploader
                            onComplete={handleImageUploadComplete}
                            onError={handleImageUploadError}
                            onBegin={handleUploadBegin}
                            disabled={isUploading}
                            uploadKey={uploadKey}
                          />
                          <p className="text-sm text-muted-foreground mt-2">
                            <span>Upload subcategory image (optional)</span>
                            {isUploading && <span> - Uploading...</span>}
                          </p>
                        </div>
                      )}
                    </div>
                    <FormDescription>
                      <span>
                        Optional image for the subcategory. Recommended size:
                        400x400 pixels.
                      </span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Categories Selection */}
          <FormField
            control={form.control}
            name="categoryIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <span>Categories</span>
                </FormLabel>
                <FormControl>
                  <div className="space-y-4">
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
                      {categories.data?.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>

                    {/* Отображение выбранных категорий */}
                    {field.value && field.value.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          <span>Selected categories:</span>
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {field.value.map((id) => {
                            const category = categories.data?.find(
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
                                      field.value?.filter((v) => v !== id)
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
                  <span>
                    Select categories that this subcategory belongs to
                  </span>
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
                  <span>Sort Order</span>{" "}
                  <span className="text-red-500">*</span>
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
                  <span>
                    Lower numbers appear first. Use 0 for highest priority.
                  </span>
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
                  <FormLabel>
                    <span>Activity Subcategory</span>
                  </FormLabel>
                  <FormDescription>
                    <span>
                      Mark this subcategory as an activity (for activity menu
                      display)
                    </span>
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
                  <FormLabel>
                    <span>Active Subcategory</span>
                  </FormLabel>
                  <FormDescription>
                    <span>
                      This subcategory will be visible to customers when active
                    </span>
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
              onClick={handleCancel}
              disabled={form.formState.isSubmitting || isUploading}
            >
              <span>Cancel</span>
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={form.formState.isSubmitting || isUploading}
              className="flex-1"
            >
              <span>
                {form.formState.isSubmitting
                  ? "Creating Subcategory..."
                  : isUploading
                  ? "Uploading Image..."
                  : "Create Subcategory"}
              </span>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateSubcategoryForm;
