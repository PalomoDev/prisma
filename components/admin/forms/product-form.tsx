'use client';

import { productDefaultValues } from '@/lib/constants';
import { insertProductSchema } from '@/lib/validations/product.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../../ui/form';
import slugify from 'slugify';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';
import { createProduct } from '@/lib/actions/product.actions';
import { UploadButton } from '@/lib/uploadthing';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import Image from 'next/image';
import { Checkbox } from '../../ui/checkbox';
import { Badge } from '../../ui/badge';
import { X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import {
    GetCategoriesResponse,
    GetSubcategoriesResponse,
    GetBrandsResponse,
    GetFeaturesResponse,
    GetSpecificationsResponse
} from "@/types";
import { useCallback, useState } from 'react';

type CreateFormData = z.infer<typeof insertProductSchema>;

interface CreateProductFormProps {
    categories: GetCategoriesResponse;
    subcategories: GetSubcategoriesResponse;
    brands: GetBrandsResponse;
    features: GetFeaturesResponse;
    specifications: GetSpecificationsResponse;
}

const CreateProductForm = ({
                               categories,
                               subcategories,
                               brands,
                               features,
                               specifications
                           }: CreateProductFormProps) => {
    const router = useRouter();
    const [isUploading, setIsUploading] = useState(false);
    const [uploadKey, setUploadKey] = useState(0);

    const form = useForm<CreateFormData>({
        resolver: zodResolver(insertProductSchema),
        defaultValues: productDefaultValues
    });

    const onSubmit = async (values: CreateFormData) => {
        console.log('🚀 Submitting product values:', values);

        try {
            const res = await createProduct(values);
            console.log('📝 Create product result:', res);

            if (res.success) {
                toast.success('Product created successfully!');
                router.push('/admin/products');
            } else {
                toast.error(res.message || 'Failed to create product');
            }
        } catch (error) {
            console.error('💥 Error creating product:', error);
            toast.error('An unexpected error occurred');
        }
    };

    const images = form.watch('images');
    const isFeatured = form.watch('isFeatured');
    const banner = form.watch('banner');
    const selectedSubcategories = form.watch('subcategoryIds') || [];
    const selectedFeatures = form.watch('featureIds') || [];
    const productSpecifications = form.watch('specifications') || [];

    // Функция для добавления новой спецификации
    const handleAddSpecification = useCallback((specificationId: string, specificationData: any) => {
        const currentSpecs = form.getValues('specifications') || [];

        // Проверяем, не добавлена ли уже эта спецификация
        const existingSpec = currentSpecs.find(spec => spec.key === specificationData.key);
        if (existingSpec) {
            toast.warning('This specification is already added');
            return;
        }

        const newSpec = {
            name: specificationData.name,
            key: specificationData.key,
            value: '',
            unit: specificationData.unit || null,
            type: specificationData.type as 'number' | 'text' | 'select' | 'boolean',
            sortOrder: currentSpecs.length,
        };

        form.setValue('specifications', [...currentSpecs, newSpec]);
        toast.success(`Specification "${specificationData.name}" added`);
    }, [form]);

    // Функция для удаления спецификации
    const handleRemoveSpecification = useCallback((index: number) => {
        const currentSpecs = form.getValues('specifications') || [];
        const removedSpec = currentSpecs[index];
        form.setValue('specifications', currentSpecs.filter((_, i) => i !== index));
        toast.info(`Specification "${removedSpec.name}" removed`);
    }, [form]);

    // Функция для обновления значения спецификации
    const handleSpecificationValueChange = useCallback((index: number, value: string) => {
        const currentSpecs = form.getValues('specifications') || [];
        const updatedSpecs = [...currentSpecs];
        updatedSpecs[index] = { ...updatedSpecs[index], value };
        form.setValue('specifications', updatedSpecs);
    }, [form]);

    // Функция для удаления изображения
    const handleRemoveImage = useCallback((indexToRemove: number) => {
        const currentImages = form.getValues('images') || [];
        const newImages = currentImages.filter((_, i) => i !== indexToRemove);
        form.setValue('images', newImages);
        form.trigger('images');
    }, [form]);

    // Функция для обработки успешной загрузки изображения
    const handleImageUploadComplete = useCallback((res: { url: string }[]) => {
        if (res && res[0] && res[0].url) {
            const currentImages = form.getValues('images') || [];
            const newImages = [...currentImages, res[0].url];
            form.setValue('images', newImages);
            setUploadKey(prev => prev + 1); // Принудительно обновляем ключ
            toast.success('Image uploaded successfully!');
        }
        setIsUploading(false);
    }, [form]);

    // Функция для обработки ошибки загрузки изображения
    const handleImageUploadError = useCallback((error: Error) => {
        console.error('Upload error:', error.message);
        toast.error(`Upload failed: ${error.message}`);
        setIsUploading(false);
    }, []);

    return (
        <div className="mx-auto py-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Create New Product</h1>
                <p className="text-muted-foreground">Fill in the details to create a new product</p>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-8'
                    noValidate
                >
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Name, Slug and SKU */}
                            <div className='grid grid-cols-1 md:grid-cols-4 gap-6 items-start'>
                                <FormField
                                    control={form.control}
                                    name='name'
                                    render={({ field }) => (
                                        <FormItem className='md:col-span-2'>
                                            <FormLabel>Product Name *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='Enter product name'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='slug'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Slug *</FormLabel>
                                            <FormControl>
                                                <div className='space-y-2'>
                                                    <Input
                                                        placeholder='Enter product slug'
                                                        {...field}
                                                    />
                                                    <Button
                                                        type='button'
                                                        variant='secondary'
                                                        size='sm'
                                                        onClick={() => {
                                                            const name = form.getValues('name');
                                                            if (name) {
                                                                form.setValue('slug', slugify(name, { lower: true }));
                                                            }
                                                        }}
                                                    >
                                                        Generate from Name
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='sku'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>SKU (Article) *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='Enter unique SKU'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Category and Brand */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <FormField
                                    control={form.control}
                                    name='categoryId'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category *</FormLabel>
                                            <FormControl>
                                                <select
                                                    {...field}
                                                    className='w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                                                >
                                                    <option value="">Select a category...</option>
                                                    {categories.success && categories.data?.map((category) => (
                                                        <option key={category.id} value={category.id}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='brandId'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Brand *</FormLabel>
                                            <FormControl>
                                                <select
                                                    {...field}
                                                    className='w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                                                >
                                                    <option value="">Select a brand...</option>
                                                    {brands.success && brands.data?.map((brand) => (
                                                        <option key={brand.id} value={brand.id}>
                                                            {brand.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Price and Stock */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <FormField
                                    control={form.control}
                                    name='price'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Price *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='Enter product price (e.g., 19.99)'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='stock'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Stock Quantity *</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    placeholder='Enter stock quantity'
                                                    min={0}
                                                    {...field}
                                                />
                                            </FormControl>
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
                                        <FormLabel>Description *</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder='Enter detailed product description'
                                                className='resize-none min-h-32'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Subcategories */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Subcategories</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FormField
                                control={form.control}
                                name='subcategoryIds'
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Select Subcategories</FormLabel>
                                        <div className="space-y-4">
                                            {selectedSubcategories.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedSubcategories.map((subcatId) => {
                                                        const subcat = subcategories.success ?
                                                            subcategories.data?.find(s => s.id === subcatId) : null;
                                                        return subcat ? (
                                                            <Badge key={subcatId} variant="secondary" className="flex items-center gap-1">
                                                                {subcat.name}
                                                                <X
                                                                    className="w-3 h-3 cursor-pointer"
                                                                    onClick={() => {
                                                                        const newIds = selectedSubcategories.filter(id => id !== subcatId);
                                                                        form.setValue('subcategoryIds', newIds);
                                                                    }}
                                                                />
                                                            </Badge>
                                                        ) : null;
                                                    })}
                                                </div>
                                            )}

                                            <select
                                                className='w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                                                onChange={(e) => {
                                                    const subcatId = e.target.value;
                                                    if (subcatId && !selectedSubcategories.includes(subcatId)) {
                                                        form.setValue('subcategoryIds', [...selectedSubcategories, subcatId]);
                                                    }
                                                    e.target.value = '';
                                                }}
                                            >
                                                <option value="">Add subcategory...</option>
                                                {subcategories.success && subcategories.data
                                                    ?.filter(subcat => !selectedSubcategories.includes(subcat.id))
                                                    .map((subcat) => (
                                                        <option key={subcat.id} value={subcat.id}>
                                                            {subcat.name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Features */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Features</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FormField
                                control={form.control}
                                name='featureIds'
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Select Features</FormLabel>
                                        <div className="space-y-4">
                                            {selectedFeatures.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedFeatures.map((featureId) => {
                                                        const feature = features.success ?
                                                            features.data?.find(f => f.id === featureId) : null;
                                                        return feature ? (
                                                            <Badge key={featureId} variant="outline" className="flex items-center gap-1">
                                                                {feature.name}
                                                                <X
                                                                    className="w-3 h-3 cursor-pointer"
                                                                    onClick={() => {
                                                                        const newIds = selectedFeatures.filter(id => id !== featureId);
                                                                        form.setValue('featureIds', newIds);
                                                                    }}
                                                                />
                                                            </Badge>
                                                        ) : null;
                                                    })}
                                                </div>
                                            )}

                                            <select
                                                className='w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                                                onChange={(e) => {
                                                    const featureId = e.target.value;
                                                    if (featureId && !selectedFeatures.includes(featureId)) {
                                                        form.setValue('featureIds', [...selectedFeatures, featureId]);
                                                    }
                                                    e.target.value = '';
                                                }}
                                            >
                                                <option value="">Add feature...</option>
                                                {features.success && features.data
                                                    ?.filter(feature => !selectedFeatures.includes(feature.id))
                                                    .map((feature) => (
                                                        <option key={feature.id} value={feature.id}>
                                                            {feature.name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Product Specifications */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                Product Specifications
                                <div className="text-sm text-muted-foreground">
                                    {productSpecifications.length} specification{productSpecifications.length !== 1 ? 's' : ''} added
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Dropdown to add specifications */}
                                <div>
                                    <FormLabel>Add Specification</FormLabel>
                                    <select
                                        className='w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                                        onChange={(e) => {
                                            const specId = e.target.value;
                                            if (specId && specifications.success) {
                                                const selectedSpec = specifications.data?.find(spec => spec.id === specId);
                                                if (selectedSpec) {
                                                    handleAddSpecification(specId, selectedSpec);
                                                }
                                            }
                                            e.target.value = '';
                                        }}
                                    >
                                        <option value="">Choose a specification to add...</option>
                                        {specifications.success && specifications.data
                                            ?.filter(spec => !productSpecifications.some(ps => ps.key === spec.key))
                                            .map((spec) => (
                                                <option key={spec.id} value={spec.id}>
                                                    {spec.name} ({spec.type}) {spec.unit ? `- ${spec.unit}` : ''}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                {/* Added specifications */}
                                {productSpecifications.map((spec, index) => (
                                    <div key={`${spec.key}-${index}`} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-gray-50">
                                        <div>
                                            <FormLabel className="text-sm font-medium">{spec.name}</FormLabel>
                                            <p className="text-xs text-muted-foreground">
                                                Type: {spec.type} {spec.unit && `• Unit: ${spec.unit}`}
                                            </p>
                                        </div>

                                        <div className="md:col-span-2">
                                            <FormLabel>Value *</FormLabel>
                                            <FormControl>
                                                {spec.type === 'boolean' ? (
                                                    <select
                                                        value={spec.value}
                                                        onChange={(e) => handleSpecificationValueChange(index, e.target.value)}
                                                        className='w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                                                    >
                                                        <option value="">Select value...</option>
                                                        <option value="true">Yes</option>
                                                        <option value="false">No</option>
                                                    </select>
                                                ) : spec.type === 'number' ? (
                                                    <Input
                                                        type="number"
                                                        placeholder={`Enter ${spec.name.toLowerCase()}${spec.unit ? ` in ${spec.unit}` : ''}`}
                                                        value={spec.value}
                                                        onChange={(e) => handleSpecificationValueChange(index, e.target.value)}
                                                    />
                                                ) : (
                                                    <Input
                                                        placeholder={`Enter ${spec.name.toLowerCase()}`}
                                                        value={spec.value}
                                                        onChange={(e) => handleSpecificationValueChange(index, e.target.value)}
                                                    />
                                                )}
                                            </FormControl>
                                        </div>

                                        <div className="flex items-end">
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleRemoveSpecification(index)}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                {productSpecifications.length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-8">
                                        No specifications added yet. Choose from the dropdown above to add specifications.
                                    </p>
                                )}
                            </div>
                            <FormMessage />
                        </CardContent>
                    </Card>

                    {/* Product Images */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Images</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FormField
                                control={form.control}
                                name='images'
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Product Images * ({images?.length || 0} uploaded)</FormLabel>
                                        <div className='space-y-4'>
                                            {images && images.length > 0 && (
                                                <div className='grid grid-cols-2 md:grid-cols-4 gap-4' key={`images-${uploadKey}`}>
                                                    {images.map((image: string, index: number) => (
                                                        <div key={`img-${image.split('/').pop()}-${index}`} className='relative group'>
                                                            <Image
                                                                src={image}
                                                                alt={`Product image ${index + 1}`}
                                                                className='w-full h-24 object-cover rounded-md border-2 border-dashed border-gray-300'
                                                                width={200}
                                                                height={96}
                                                                unoptimized
                                                            />
                                                            <Button
                                                                type='button'
                                                                variant='destructive'
                                                                size='sm'
                                                                className='absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity'
                                                                onClick={() => handleRemoveImage(index)}
                                                                disabled={isUploading}
                                                            >
                                                                ×
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className='flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-md'>
                                                <UploadButton
                                                    key={`upload-${uploadKey}`}
                                                    className={'border'}
                                                    endpoint='imageUploader'
                                                    onClientUploadComplete={handleImageUploadComplete}
                                                    onUploadError={handleImageUploadError}
                                                    onUploadBegin={() => setIsUploading(true)}
                                                    disabled={isUploading}
                                                />
                                                <p className='text-sm text-muted-foreground mt-2'>
                                                    Upload product images (at least 1 required)
                                                    {isUploading && ' - Uploading...'}
                                                </p>
                                            </div>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Featured Product Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Featured Product Settings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='space-y-4'>
                                <FormField
                                    control={form.control}
                                    name='isFeatured'
                                    render={({ field }) => (
                                        <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className='space-y-1 leading-none'>
                                                <FormLabel>Featured Product</FormLabel>
                                                <p className='text-sm text-muted-foreground'>
                                                    Mark this product as featured to display it prominently
                                                </p>
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                {isFeatured && (
                                    <div className='space-y-4 border-t pt-4'>
                                        <div>
                                            <h4 className='text-sm font-medium mb-2'>Featured Banner Image</h4>
                                            {banner ? (
                                                <div className='relative'>
                                                    <Image
                                                        src={banner}
                                                        alt='Featured banner'
                                                        className='w-full max-h-48 object-cover rounded-md border'
                                                        width={800}
                                                        height={192}
                                                    />
                                                    <Button
                                                        type='button'
                                                        variant='destructive'
                                                        size='sm'
                                                        className='absolute top-2 right-2'
                                                        onClick={() => {
                                                            form.setValue('banner', null);
                                                        }}
                                                    >
                                                        Remove Banner
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className='flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-md'>
                                                    <UploadButton
                                                        endpoint='imageUploader'
                                                        onClientUploadComplete={(res: { url: string }[]) => {
                                                            if (res && res[0] && res[0].url) {
                                                                form.setValue('banner', res[0].url);
                                                                toast.success('Banner uploaded successfully!');
                                                            }
                                                        }}
                                                        onUploadError={(error: Error) => {
                                                            console.error('Banner upload error:', error.message);
                                                            toast.error(`Banner upload failed: ${error.message}`);
                                                        }}
                                                    />
                                                    <p className='text-sm text-muted-foreground mt-2'>
                                                        Upload a banner image for the featured product
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className='flex gap-4'>
                        <Button
                            type='button'
                            variant='outline'
                            size='lg'
                            className='flex-1'
                            onClick={() => router.push('/admin/products')}
                        >
                            Cancel
                        </Button>
                        <Button
                            type='submit'
                            size='lg'
                            disabled={form.formState.isSubmitting}
                            className='flex-1'
                        >
                            {form.formState.isSubmitting ? 'Creating Product...' : 'Create Product'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default CreateProductForm;