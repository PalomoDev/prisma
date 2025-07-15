"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  specificationDefaultValues,
  SPECIFICATION_TYPES,
} from "@/lib/constants";
import { createSpecification } from "@/lib/actions/new/specification/manage.actions";
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
import { toast } from "sonner";
import {
  CreateSpecificationInput,
  CreateSpecificationSchema,
} from "@/lib/validations/new/specification.validation";
import { z } from "zod";

// Создаем тип формы на основе схемы
type SpecificationFormData = z.infer<typeof CreateSpecificationSchema>;
import { UploadButton } from "@/lib/uploadthing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useState, useCallback, useEffect, useRef } from "react";

interface CreateSpecificationFormProps {
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

const CreateSpecificationForm = ({
  categories,
}: CreateSpecificationFormProps) => {
  const [serverError, setServerError] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadKey, setUploadKey] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<SpecificationFormData>({
    resolver: zodResolver(CreateSpecificationSchema),
    defaultValues: specificationDefaultValues,
    mode: "onChange",
  });

  const router = useRouter();

  // Watch для iconImage
  const iconImage = form.watch("iconImage");
  const isGlobal = form.watch("isGlobal");

  // Безопасная очистка состояния при размонтировании
  useEffect(() => {
    return () => {
      setIsUploading(false);
    };
  }, []);

  const handleNameChange = (value: string) => {
    // Генерация key
    const generatedKey = value
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, "") // убираем спецсимволы
      .trim()
      .replace(/\s+/g, "-"); // заменяем пробелы на дефисы

    form.setValue("key", generatedKey, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // Функция для обработки успешной загрузки изображения
  const handleImageUploadComplete = useCallback(
    (res: { url: string }[]) => {
      try {
        if (res && res[0] && res[0].url) {
          form.setValue("iconImage", res[0].url, {
            shouldValidate: true,
            shouldDirty: true,
          });
          setUploadKey((prev) => prev + 1);
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
      setUploadKey((prev) => prev + 1);
      toast.info("Imagen eliminada");
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Error removing image");
    }
  }, [form]);

  const handleSubmit = async (values: SpecificationFormData) => {
    try {
      setServerError(""); // Очищаем предыдущие ошибки
      console.log("🚀 Form submitting with values:", values);
      console.log("🖼️ iconImage field:", values.iconImage);

      const res = await createSpecification(values);
      console.log("📝 Response from server:", res);

      if (res.success) {
        toast.success(res.message || "Especificación creada con éxito");
        form.reset(specificationDefaultValues);
        setUploadKey((prev) => prev + 1);
        router.push("/admin/products/specifications");
      } else {
        // Показываем ошибку от сервера
        setServerError(res.message || "Error al crear la especificación");
        toast.error(res.message || "Error al crear la especificación");
      }
    } catch (error) {
      console.error("❌ Client error creating specification:", error);
      const errorMessage = "Error al crear la especificación";
      setServerError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleCancelForm = () => {
    // Безопасная очистка перед переходом
    setIsUploading(false);
    form.reset();
    router.push("/admin/products/specifications");
  };

  return (
    <div className="mx-auto py-6" translate="no">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          <span>Crear nueva especificación</span>
        </h1>
        <p className="text-muted-foreground">
          <span>
            Complete los detalles para crear una nueva especificación de
            producto
          </span>
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
              <span>{serverError}</span>
            </div>
          )}

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
                    Por ejemplo: "Número de plazas", "Temperatura de confort",
                    "Peso"
                  </span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Key (read-only, auto-generated) */}
          <FormField
            control={form.control}
            name="key"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <span>Clave</span> <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Se genera automáticamente"
                    {...field}
                    readOnly
                    className="bg-muted"
                  />
                </FormControl>
                <FormDescription>
                  <span>Se genera automáticamente a partir del nombre</span>
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
                          {type.label}
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
                      {iconImage && (
                        <div className="relative w-fit group">
                          <Image
                            src={iconImage}
                            alt="Icono de especificación"
                            className="w-16 h-16 object-cover rounded-md border"
                            width={64}
                            height={64}
                            unoptimized
                            key={`icon-${iconImage
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
                      )}

                      {!iconImage && (
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
                            {isUploading && <span> - Uploading...</span>}
                          </p>
                        </div>
                      )}
                    </div>
                    <FormDescription>
                      <span>
                        Imagen alternativa para el icono de la especificación
                      </span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Global Specification Checkbox */}
          <FormField
            control={form.control}
            name="isGlobal"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-label="Especificación global"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    <span>Especificación global</span>
                  </FormLabel>
                  <FormDescription>
                    <span>
                      Esta especificación estará disponible para todas las
                      categorías
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
                  ? "Creando especificación..."
                  : isUploading
                  ? "Uploading Image..."
                  : "Crear especificación"}
              </span>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateSpecificationForm;
