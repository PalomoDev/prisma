import { PrismaClient } from '@/prisma/generated/client'
import {mockTourismProducts} from '@/db/sample-date';


const prisma = new PrismaClient()

async function main() {
    console.log("=== Starting database seeding ===");

    // Очищаем только таблицу продуктов
    console.log("Cleaning products table...");
    await prisma.product.deleteMany();
    console.log("Products table cleaned successfully!");

    // Добавляем продукты
    console.log("\n=== Creating products ===");
    for (const product of mockTourismProducts) {
        await prisma.product.create({
            data: product
        });
        console.log(`Product created: ${product.name}`);
    }

    console.log('\nProducts seeded successfully!');
}

main()
    .catch((e) => {
        console.error('Seeding error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });