'use client'

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFeatureSchema } from '@/lib/validations/category.validation';
import { featureDefaultValues } from "@/lib/constants";
import { createFeature } from "@/lib/actions/spec-features.actions";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { useRouter } from "next/navigation";

type CreateFeatureInput = z.infer<typeof createFeatureSchema>

const CreateFeatureForm = () => {
    const form = useForm<CreateFeatureInput>({
        resolver: zodResolver(createFeatureSchema),
        defaultValues: featureDefaultValues,
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

        // Генерация icon (просто название как есть)
        const generatedIcon = value;

        form.setValue('key', generatedKey, {
            shouldValidate: true,
            shouldDirty: true
        });

        form.setValue('icon', generatedIcon, {
            shouldValidate: true,
            shouldDirty: true
        });
    };

    const handleSubmit = async (values: CreateFeatureInput) => {
        try {
            const res = await createFeature(values);

            if (res.success) {
                form.reset(featureDefaultValues);
                router.push('/admin/products/specifications');
            }
        } catch (error) {
            console.error('Error creating feature:', error);
            // Здесь можно показать ошибку пользователю через toast
        }
    };

    const handleCancelForm = () => {
        router.push('/admin/products/specifications');
    };

    return (
        <div className="mx-auto py-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Создать новую особенность</h1>
                <p className="text-muted-foreground">Заполните детали для создания новой особенности товара</p>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className='space-y-8'
                    noValidate
                >
                    {/* Name */}
                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Название особенности <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='Введите название особенности'
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            handleNameChange(e.target.value);
                                        }}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Например: "Водостойкий", "Легкий", "Ветрозащитный"
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Key and Icon (read-only, auto-generated) */}
                    <div className='flex flex-col md:flex-row gap-6 items-start'>
                        <FormField
                            control={form.control}
                            name='key'
                            render={({ field }) => (
                                <FormItem className='flex-1'>
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

                        <FormField
                            control={form.control}
                            name='icon'
                            render={({ field }) => (
                                <FormItem className='flex-1'>
                                    <FormLabel>
                                        Иконка <span className="text-red-500">*</span>
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
                                        Автоматически копируется из названия
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
                                        placeholder='Введите описание особенности (необязательно)'
                                        className='resize-none min-h-24'
                                        {...field}
                                        value={field.value || ''}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Подробное описание особенности для пользователей
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Icon Image URL */}
                    <FormField
                        control={form.control}
                        name='iconImage'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    URL изображения иконки
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='Введите URL изображения иконки (необязательно)'
                                        {...field}
                                        value={field.value || ''}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Альтернативное изображение вместо текстовой иконки
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

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
                                        aria-label="Активная особенность"
                                    />
                                </FormControl>
                                <div className='space-y-1 leading-none'>
                                    <FormLabel>
                                        Активная особенность
                                    </FormLabel>
                                    <FormDescription>
                                        Эта особенность будет доступна для использования в товарах
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
                            {form.formState.isSubmitting ? 'Создание особенности...' : 'Создать особенность'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default CreateFeatureForm;