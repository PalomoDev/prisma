'use client'

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateFeature } from "@/lib/actions/spec-features.actions";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { UpdateFeatureInput } from "@/types";
import { updateFeatureSchema } from "@/lib/validations/category.validation";
import { useState } from "react";
import { toast } from "sonner";

interface UpdateFeatureFormProps {
    feature: any; // Типизировать позже
}

const UpdateFeatureForm = ({ feature }: UpdateFeatureFormProps) => {
    const [serverError, setServerError] = useState<string>('');
    const router = useRouter();

    // Определяем значения по умолчанию из переданной особенности
    const defaultValues: UpdateFeatureInput = {
        id: feature.id,
        name: feature.name,
        key: feature.key,
        icon: feature.icon,
        iconImage: feature.iconImage || null,
        description: feature.description || null,
        isActive: feature.isActive,
        sortOrder: feature.sortOrder,
    };

    const form = useForm<UpdateFeatureInput>({
        resolver: zodResolver(updateFeatureSchema),
        defaultValues,
        mode: 'onChange'
    });

    const handleNameChange = (value: string) => {
        // Генерация key только если поле key пустое или совпадает с автогенерированным
        const currentKey = form.getValues('key');
        const autoGeneratedKey = feature.name
            .toLowerCase()
            .replace(/[^a-zA-Z0-9\s]/g, '')
            .trim()
            .replace(/\s+/g, '-');

        // Обновляем key только если он был автогенерированный или пустой
        if (!currentKey || currentKey === autoGeneratedKey) {
            const generatedKey = value
                .toLowerCase()
                .replace(/[^a-zA-Z0-9\s]/g, '')
                .trim()
                .replace(/\s+/g, '-');

            form.setValue('key', generatedKey, {
                shouldValidate: true,
                shouldDirty: true
            });
        }

        // Обновляем icon (название как есть)
        form.setValue('icon', value, {
            shouldValidate: true,
            shouldDirty: true
        });
    };

    const handleSubmit = async (values: UpdateFeatureInput) => {
        try {
            setServerError('');
            console.log('🚀 Form submitting with values:', values);

            const res = await updateFeature(values);
            console.log('📝 Response from server:', res);

            if (res.success) {
                toast.success(res.message || 'Особенность успешно обновлена');
                router.push('/admin/products/specifications');
            } else {
                setServerError(res.message || 'Произошла ошибка при обновлении особенности');
                toast.error(res.message || 'Произошла ошибка при обновлении особенности');
            }
        } catch (error) {
            console.error('❌ Client error updating feature:', error);
            const errorMessage = 'Произошла ошибка при обновлении особенности';
            setServerError(errorMessage);
            toast.error(errorMessage);
        }
    };

    const handleCancelForm = () => {
        router.push('/admin/products/specifications');
    };

    return (
        <div className="mx-auto py-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Редактировать особенность</h1>
                <p className="text-muted-foreground">Обновите данные особенности товара</p>
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

                    {/* Hidden ID field */}
                    <FormField
                        control={form.control}
                        name='id'
                        render={({ field }) => (
                            <Input type="hidden" {...field} />
                        )}
                    />

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
                                            placeholder='Ключ особенности'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Уникальный ключ для программного доступа
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
                                            placeholder='Название иконки'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Название иконки (обычно совпадает с названием)
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
                            {form.formState.isSubmitting ? 'Обновление...' : 'Обновить особенность'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default UpdateFeatureForm;