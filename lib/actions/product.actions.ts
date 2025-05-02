"use server"
// import { PrismaClient } from "@/prisma/generated/client"
import { prisma } from "@/db/prisma"

// const prisma = new PrismaClient()

export async function getProducts() {

    try {
        const products = await prisma.product.findMany()
        return { success: true, data: products }
    } catch (error) {
        console.error('Ошибка при получении продуктов:', error)
        return { success: false, error: 'Не удалось загрузить продукты' }
    }
}