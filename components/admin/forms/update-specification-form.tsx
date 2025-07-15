"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SPECIFICATION_TYPES } from "@/lib/constants";
import { updateSpecification } from "@/lib/actions/new/specification/manage.actions";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { CategoryLight } from "@/lib/validations/new/category.validation";
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { UploadButton } from "@/lib/uploadthing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import {
  UpdateSpecificationInput,
  UpdateSpecificationSchema,
  SpecificationFull,
} from "@/lib/validations/new/specification.validation";

interface UpdateSpecificationFormProps {
  specification: SpecificationFull;
  categories: CategoryLight[];
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

const UpdateSpecificationForm = ({
  specification,
  categories,
}: UpdateSpecificationFormProps) => {
  const [serverError, setServerError] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadKey, setUploadKey] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  // Определяем значения по умолчанию из переданной спецификации
  const defaultValues: UpdateSpecificationInput = {
    id: specification.id,
    name: specification.name,
    key: specification.key,
    description: specification.description || null,
    unit: specification.unit || null,
    type: specification.type as
      | "number"
      | "text"
      | "select"
      | "boolean"
      | "range",
    iconImage: specification.icon || "", // icon из БД идет в iconImage
    isActive: specification.isActive,
    sortOrder: specification.sortOrder,
    categoryIds:
      specification.categorySpecs?.map((cs: any) => cs.categoryId) || [],
    isGlobal:
      specification.categorySpecs?.length ===
      categories.filter((cat) => cat.isActive).length,
  };

  const form = useForm<UpdateSpecificationInput>({
    resolver: zodResolver(UpdateSpecificationSchema),
    defaultValues,
    mode: "onChange",
  });

  // Watch для iconImage
  const iconImage = form.watch("iconImage");

  // Безопасная очистка состояния при размонтировании
  useEffect(() => {
    return () => {
      setIsUploading(false);
    };
  }, []);

  // Функция для обработки успешной загрузки изображения
  const handleImageUploadComplete = useCallback(
    (res: { url: string }[]) => {
      try {
        if (res && res[0] && res[0].url) {
          form.setValue("iconImage", res[0].url, {
            shouldValidate: true,
            shouldDirty: true,
          });
          setUploadKey((prev) => prev + 1); // Принудительно обновляем ключ
          toast.success("Imagen subida con éxito!");
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
    toast.error(`Error al subir imagen: ${error.message}`);
    setIsUploading(false);
  }, []);

  // Функция для начала загрузки
  const handleUploadBegin = useCallback(() => {
    setIsUploading(true);
  }, []);

  // Функция для удаления изображения
  const handleRemoveImage = useCallback(() => {
    try {
      form.setValue("iconImage", "", {
        shouldValidate: true,
        shouldDirty: true,
      });
      setUploadKey((prev) => prev + 1); // Обновляем ключ при удалении
      toast.info("Imagen eliminada");
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Error removing image");
    }
  }, [form]);

  const handleNameChange = (value: string) => {
    // Генерация key только если поле key пустое или совпадает с автогенерированным
    const currentKey = form.getValues("key");
    const autoGeneratedKey = specification.name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    // Обновляем key только если он был автогенерированный или пустой
    if (!currentKey || currentKey === autoGeneratedKey) {
      const generatedKey = value
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .trim()
        .replace(/\s+/g, "-");

      form.setValue("key", generatedKey, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const handleSubmit = async (values: UpdateSpecificationInput) => {
    try {
      setServerError("");
      console.log("🚀 Form submitting with values:", values);

      const res = await updateSpecification(values);
      console.log("📝 Response from server:", res);

      if (res.success) {
        toast.success(res.message || "Especificación actualizada con éxito");
        // Сброс uploadKey и переход на страницу списка
        setUploadKey((prev) => prev + 1);
        router.push("/admin/products/specifications");
      } else {
        setServerError(
          res.message || "Ocurrió un error al actualizar la especificación"
        );
        toast.error(
          res.message || "Ocurrió un error al actualizar la especificación"
        );
      }
    } catch (error) {
      console.error("❌ Client error updating specification:", error);
      const errorMessage = "Ocurrió un error al actualizar la especificación";
      setServerError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleCancelForm = () => {
    router.push("/admin/products/specifications");
  };

  const isGlobal = form.watch("isGlobal");

  // Обновляем categoryIds при изменении isGlobal
  useEffect(() => {
    if (isGlobal) {
      const allActiveCategoryIds = categories
        .filter((cat) => cat.isActive)
        .map((cat) => cat.id);
      form.setValue("categoryIds", allActiveCategoryIds, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [isGlobal, categories, form]);

  return (
    <div className="mx-auto py-6" translate="no">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          <span>Editar especificación</span>
        </h1>
        <p className="text-muted-foreground">
          <span>Actualice los datos de la especificación del producto</span>
        </p>
      </div>

      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-8"
          noValidate
          translate="no"
        >
          {/* Показываем ошибку сервера */}
          {serverError && (
            <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200">
              {serverError}
            </div>
          )}

          {/* Hidden ID field */}
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => <Input type="hidden" {...field} />}
          />

          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <span>Nombre de la especificación</span>{" "}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ingrese el nombre de la especificación"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      handleNameChange(e.target.value);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  <span>
                    Por ejemplo: Número de plazas, Temperatura de confort, Peso
                  </span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Key */}
          <FormField
            control={form.control}
            name="key"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <span>Clave</span> <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Clave de la especificación" {...field} />
                </FormControl>
                <FormDescription>
                  <span>Clave única para acceso programático</span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Type and Unit */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>
                    <span>Tipo</span> <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione el tipo de especificación" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SPECIFICATION_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <span>{type.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    <span>Tipo de datos para esta especificación</span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>
                    <span>Unidad de medida</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="kg, cm, °C, l"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    <span>Unidad de medida (opcional)</span>
                  </FormDescription>
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
                  <span>Descripción</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ingrese la descripción de la especificación (opcional)"
                    className="resize-none min-h-24"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  <span>
                    Descripción detallada de la especificación para los usuarios
                  </span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Icon Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>
                <span>Imagen del icono</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="iconImage"
                render={() => (
                  <FormItem>
                    <FormLabel>
                      <span>Imagen del icono (Opcional)</span>
                    </FormLabel>
                    <div
                      className="space-y-4"
                      key={`icon-section-${uploadKey}`}
                    >
                      {iconImage && iconImage.trim() !== "" ? (
                        <div className="relative w-fit group">
                          <Image
                            src={iconImage}
                            alt="Icono de especificación"
                            className="w-32 h-32 object-cover rounded-md border"
                            width={128}
                            height={128}
                            unoptimized
                            key={`icon-image-${iconImage
                              .split("/")
                              .pop()}-${uploadKey}`}
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
                            <span>Subir imagen del icono (opcional)</span>
                            {isUploading && <span> - Subiendo...</span>}
                          </p>
                        </div>
                      )}
                    </div>
                    <FormDescription>
                      <span>
                        Imagen para el icono de la especificación. Ej:
                        "weight.png", "thermometer.jpg"
                      </span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Is Global Checkbox */}
          <FormField
            control={form.control}
            name="isGlobal"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-label="Global para todas las categorías"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    <span>Global para todas las categorías</span>
                  </FormLabel>
                  <FormDescription>
                    <span>
                      Esta especificación estará disponible para todas las
                      categorías de productos activas
                    </span>
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Categories Selection (показываем только если не isGlobal) */}
          {!isGlobal && (
            <FormField
              control={form.control}
              name="categoryIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <span>Categorías de productos</span>
                  </FormLabel>
                  <FormDescription>
                    <span>
                      Seleccione las categorías para las que estará disponible
                      esta especificación
                    </span>
                  </FormDescription>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          checked={field.value?.includes(category.id) || false}
                          onCheckedChange={(checked) => {
                            const currentValue = field.value || [];
                            if (checked) {
                              field.onChange([...currentValue, category.id]);
                            } else {
                              field.onChange(
                                currentValue.filter((id) => id !== category.id)
                              );
                            }
                          }}
                          aria-label={`Categoría ${category.name}`}
                        />
                        <label className="text-sm font-medium leading-none cursor-pointer">
                          <span>{category.name}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Sort Order */}
          <FormField
            control={form.control}
            name="sortOrder"
            render={({ field }) => (
              <FormItem className="max-w-xs">
                <FormLabel>
                  <span>Orden de clasificación</span>{" "}
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
                    Los números menores se muestran primero. Use 0 para la
                    máxima prioridad.
                  </span>
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
                    aria-label="Especificación activa"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    <span>Especificación activa</span>
                  </FormLabel>
                  <FormDescription>
                    <span>
                      Esta especificación estará disponible para usar en
                      productos
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
              onClick={handleCancelForm}
              disabled={form.formState.isSubmitting || isUploading}
            >
              <span>Cancelar</span>
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={form.formState.isSubmitting || isUploading}
              className="flex-1"
            >
              <span>
                {form.formState.isSubmitting
                  ? "Actualizando..."
                  : isUploading
                  ? "Subiendo imagen..."
                  : "Actualizar especificación"}
              </span>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UpdateSpecificationForm;
