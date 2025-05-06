import {getProducts} from "@/lib/actions/product.actions";
import { prismaToJson } from "@/lib/utils/prisma-serializer"
import Image from "next/image";
import {auth} from "@/auth";


export default async function Home() {
    const {success, data, error
    } = await getProducts();
    const products = success ? prismaToJson(data) : [];






    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">

            <h1 className="text-3xl font-bold">Продукты</h1>

            {error && <p className="text-red-500">Ошибка: {error}</p>}

            {!products || products.length
            === 0 ? (
                <p>Нет доступных продуктов</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="border rounded-lg p-4 shadow hover:shadow-md transition-shadow">
                            {product.imageUrl && (
                                <Image
                                    src={`/${product.imageUrl}`}
                                    alt={product.name}
                                    width={400}
                                    height={160}
                                    className="w-full h-40 object-cover rounded mb-3"
                                />

                            )}
                            <h2 className="text-xl font-semibold">{product.name}</h2>
                        </div>
                    ))}
                </div>
            )}



        </div>

    );
}
