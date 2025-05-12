"use server"

import { prisma } from "@/db/prisma"



export async function getProducts() {

    try {
        const products = await prisma.product.findMany()
        return { success: true, data: products }
    } catch (error) {
        console.error('Ошибка при получении продуктов:', error)
        return { success: false, error: 'Не удалось загрузить продукты' }
    }
}

// Get single product by it's slug
export async function getProductBySlug(slug: string) {
    return prisma.product.findFirst({
        where: {slug: slug},
    });
}