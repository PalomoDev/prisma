'use client';
import Image from 'next/image';

interface ProductGalleryGridProps {
    images: string[];
}

const ProductGalleryGrid = ({ images }: ProductGalleryGridProps) => {
    // Показываем до 4 изображений в сетке 2x2
    const displayImages = images.slice(0, 4);

    return (
        <div className="grid grid-cols-2 gap-4">
            {displayImages.map((image, index) => (
                <div
                    key={index}
                    className="aspect-[3/2] overflow-hidden rounded-lg bg-gray-100"
                >
                    <Image
                        src={image}
                        alt={`Product image ${index + 1}`}
                        width={400}
                        height={267}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                </div>
            ))}
        </div>
    );
};

export default ProductGalleryGrid;