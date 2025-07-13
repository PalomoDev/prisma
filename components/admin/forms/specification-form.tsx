'use client'

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { specificationDefaultValues, SPECIFICATION_TYPES } from "@/lib/constants";
import { createSpecification } from "@/lib/actions/spec-features.actions";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Category } from "@/types";
import { useState } from "react";
import { toast } from "sonner";
import {
    CreateSpecificationWithCategoriesInput,
    createSpecificationWithCategoriesSchema
} from "@/lib/validations/specs-features.validation"; // или используйте ваш toast компонент





interface CreateSpecificationFormProps {
    categories: Category[];
}

const CreateSpecificationForm = ({ categories }: CreateSpecificationFormProps) => {
    const [serverError, setServerError] = useState<string>('');

    const form = useForm<CreateSpecificationWithCategoriesInput>({
        resolver: zodResolver(createSpecificationWithCategoriesSchema),
        defaultValues: specificationDefaultValues,
        mode: 'onChange'
    });

    const router = useRouter();

    const handleNameChange = (value: string) => {
        // Генерация key
        const generatedKey = value
            .toLowerCase()
            .replace(/[^a-zA-Z0-9\s]/g, '') // убираем спецсимволы
            .trim()
            .replace(/\s+/g, '-'); // заменяем пробелы на дефисы

        form.setValue('key', generatedKey, {
            shouldValidate: true,
            shouldDirty: true
        });
    };

    const handleSubmit = async (values: CreateSpecificationWithCategoriesInput) => {
        try {
            setServerError(''); // Очищаем предыдущие ошибки
            console.log('🚀 Form submitting with values:', values);

            const res = await createSpecification(values);
            console.log('📝 Response from server:', res);

            if (res.success) {
                toast.success(res.message || 'Спецификация успешно создана');
                form.reset(specificationDefaultValues);
                router.push('/admin/products/specifications');
            } else {
                // Показываем ошибку от сервера
                setServerError(res.message || 'Произошла ошибка при создании спецификации');
                toast.error(res.message || 'Произошла ошибка при создании спецификации');
            }
        } catch (error) {
            console.error('❌ Client error creating specification:', error);
            const errorMessage = 'Произошла ошибка при создании спецификации';
            setServerError(errorMessage);
            toast.error(errorMessage);
        }
    };

    const handleCancelForm = () => {
        router.push('/admin/products/specifications');
    };

    const isGlobal = form.watch('isGlobal');

    return (
        <div className="mx-auto py-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Создать новую спецификацию</h1>
                <p className="text-muted-foreground">Заполните детали для создания новой спецификации товара</p>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className='space-y-8'
                    noValidate
                >
                    {/* Показываем ошибку сервера */}
                    {serverError && (
                        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200">
                            {serverError}
                        </div>
                    )}
                    {/* Name */}
                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Название спецификации <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='Введите название спецификации'
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            handleNameChange(e.target.value);
                                        }}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Например: "Количество мест", "Температура комфорта", "Вес"
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Key (read-only, auto-generated) */}
                    <FormField
                        control={form.control}
                        name='key'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Ключ <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='Генерируется автоматически'
                                        {...field}
                                        readOnly
                                        className="bg-muted"
                                    />
                                </FormControl>
                                <FormDescription>
                                    Автоматически генерируется из названия
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Type and Unit */}
                    <div className='flex flex-col md:flex-row gap-6 items-start'>
                        <FormField
                            control={form.control}
                            name='type'
                            render={({ field }) => (
                                <FormItem className='flex-1'>
                                    <FormLabel>
                                        Тип <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Выберите тип спецификации" />
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
                                        Тип данных для этой спецификации
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='unit'
                            render={({ field }) => (
                                <FormItem className='flex-1'>
                                    <FormLabel>
                                        Единица измерения
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='кг, см, °C, л'
                                            {...field}
                                            value={field.value || ''}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Единица измерения (необязательно)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Description */}
                    <FormField
                        control={form.control}
                        name='description'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Описание
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder='Введите описание спецификации (необязательно)'
                                        className='resize-none min-h-24'
                                        {...field}
                                        value={field.value || ''}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Подробное описание спецификации для пользователей
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Icon Path */}
                    <FormField
                        control={form.control}
                        name='icon'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Путь к иконке
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='users, thermometer, weight, ruler'
                                        {...field}
                                        value={field.value || ''}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Имя иконки (Lucide, Heroicons) или путь к файлу
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Is Global Checkbox */}
                    <FormField
                        control={form.control}
                        name='isGlobal'
                        render={({ field }) => (
                            <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        aria-label="Общая для всех категорий"
                                    />
                                </FormControl>
                                <div className='space-y-1 leading-none'>
                                    <FormLabel>
                                        Общая для всех категорий
                                    </FormLabel>
                                    <FormDescription>
                                        Эта спецификация будет доступна для всех активных категорий товаров
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
                            name='categoryIds'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Категории товаров
                                    </FormLabel>
                                    <FormDescription>
                                        Выберите категории, для которых будет доступна эта спецификация
                                    </FormDescription>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                                        {categories.map((category) => (
                                            <div key={category.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    checked={field.value?.includes(category.id) || false}
                                                    onCheckedChange={(checked) => {
                                                        const currentValue = field.value || [];
                                                        if (checked) {
                                                            field.onChange([...currentValue, category.id]);
                                                        } else {
                                                            field.onChange(currentValue.filter(id => id !== category.id));
                                                        }
                                                    }}
                                                    aria-label={`Категория ${category.name}`}
                                                />
                                                <label className="text-sm font-medium leading-none cursor-pointer">
                                                    {category.name}
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
                        name='sortOrder'
                        render={({ field }) => (
                            <FormItem className='max-w-xs'>
                                <FormLabel>
                                    Порядок сортировки <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type='number'
                                        placeholder='0'
                                        {...field}
                                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Меньшие числа отображаются первыми. Используйте 0 для высшего приоритета.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Is Active Checkbox */}
                    <FormField
                        control={form.control}
                        name='isActive'
                        render={({ field }) => (
                            <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        aria-label="Активная спецификация"
                                    />
                                </FormControl>
                                <div className='space-y-1 leading-none'>
                                    <FormLabel>
                                        Активная спецификация
                                    </FormLabel>
                                    <FormDescription>
                                        Эта спецификация будет доступна для использования в товарах
                                    </FormDescription>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Submit Button */}
                    <div className='flex gap-4'>
                        <Button
                            type='button'
                            variant='outline'
                            size='lg'
                            className='flex-1'
                            onClick={handleCancelForm}
                            disabled={form.formState.isSubmitting}
                        >
                            Отмена
                        </Button>
                        <Button
                            type='submit'
                            size='lg'
                            disabled={form.formState.isSubmitting}
                            className='flex-1'
                        >
                            {form.formState.isSubmitting ? 'Создание спецификации...' : 'Создать спецификацию'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default CreateSpecificationForm;