import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Удаляем все существующие продукты (опционально)
    await prisma.product.deleteMany({})

    // Создаем тестовые продукты
    const product1 = await prisma.product.create({
        data: {
            name: 'Смартфон Galaxy S23',
            imageUrl: 'https://example.com/images/galaxy-s23.jpg'
        },
    })

    const product2 = await prisma.product.create({
        data: {
            name: 'Ноутбук MacBook Pro',
            imageUrl: 'https://example.com/images/macbook-pro.jpg'
        },
    })

    const product3 = await prisma.product.create({
        data: {
            name: 'Наушники Sony WH-1000XM5',
            imageUrl: 'https://example.com/images/sony-headphones.jpg'
        },
    })

    console.log({ product1, product2, product3 })
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })