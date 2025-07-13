'use client';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';

import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import Image from 'next/image';

type Banner = {
    src: string;
    slug: string;
    label: string;
    id: string;
    name: string;
}

interface CarouselProps {
    data: Banner[]
}

const ProductCarousel = ({ data }: CarouselProps) => {
    return (
        <Carousel
            className='w-full'
            opts={{
                loop: true,
            }}
            plugins={[
                Autoplay({
                    delay: 8000,
                    stopOnInteraction: true,
                    stopOnMouseEnter: true,
                }),
            ]}
        >
            <CarouselContent>
                {data.map((banner: Banner) => (
                    <CarouselItem key={banner.id}>
                        <Link href={`/product/${banner.slug}`}>
                            <div className='relative mx-auto'>
                                <Image
                                    src={banner.src!}
                                    alt={banner.label}
                                    height='0'
                                    width='0'
                                    sizes='100vw'
                                    className='w-full h-auto'
                                />
                                <div className='absolute inset-0 flex items-end justify-center'>
                                    <h2 className='bg-gray-900 bg-opacity-50 text-2xl font-bold px-2 text-white'>
                                        {banner.name}
                                    </h2>
                                </div>
                            </div>
                        </Link>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
};

export default ProductCarousel;