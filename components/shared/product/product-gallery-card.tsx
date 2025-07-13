import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ProductGalleryCardProps {
    product: {
        id: string | number;
        slug: string;
        name: string;
        images?: string[];
        price?: number;
        description?: string;
    };
    className?: string;
    imageClassName?: string;
    titleClassName?: string;
    showPrice?: boolean;
    showDescription?: boolean;
}

const ProductGalleryCard: React.FC<ProductGalleryCardProps> = ({
                                                                   product,
                                                                   className = '',
                                                                   imageClassName = '',
                                                                   titleClassName = '',
                                                                   showPrice = false,
                                                                   showDescription = false,
                                                               }) => {
    console.log(product);

    return (
        <Link href={`/product/${product.slug}`} key={product.id}>
            <div className={`${className}`}>
                {product.images && product.images.length > 0 && (
                    <div className={`relative w-full h-0 pb-[117%] mb-3 ${imageClassName}`}>
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover rounded"
                        />
                    </div>
                )}

                <div>
                    <div className=" flex items-end justify-between mb-2">
                        <h2 className={`text-base font-semibold ${titleClassName}`}>
                            {product.name}
                        </h2>
                        {showPrice && product.price && (
                            <p className="text-base font-bold ">
                                €{product.price}
                            </p>
                        )}
                    </div>
                    {showDescription && product.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                            {product.description}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductGalleryCard;