import { PrismaClient } from '@/prisma/generated/client'
import sampleData from '@/db/sample-date';
import { hash, compare } from '@/lib/encrypt'; // Импортируем также функцию compare

const prisma = new PrismaClient()

async function main() {
    console.log("=== Starting database seeding ===");

    // Проверяем наличие ENCRYPTION_KEY
    if (!process.env.ENCRYPTION_KEY) {
        console.error("ERROR: ENCRYPTION_KEY environment variable is not set!");
        process.exit(1);
    }

    console.log(`ENCRYPTION_KEY exists and has length: ${process.env.ENCRYPTION_KEY.length}`);

    // Очищаем базу данных
    console.log("Cleaning database...");
    await prisma.product.deleteMany();
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    await prisma.verificationToken.deleteMany();
    await prisma.user.deleteMany();
    console.log("Database cleaned successfully!");

    // Проверка стабильности хеширования
    console.log("\n=== Testing hash function stability ===");
    const testPassword = "test123";
    const hash1 = await hash(testPassword);
    const hash2 = await hash(testPassword);
    console.log(`Test password: ${testPassword}`);
    console.log(`Hash 1: ${hash1}`);
    console.log(`Hash 2: ${hash2}`);
    console.log(`Hashes match: ${hash1 === hash2}`);

    if (hash1 !== hash2) {
        console.error("ERROR: Hash function is not stable! This will cause login problems.");
        process.exit(1);
    }

    // Подготавливаем пользователей
    console.log("\n=== Creating users ===");
    const users = [];
    for (let i = 0; i < sampleData.users.length; i++) {
        const plainPassword = sampleData.users[i].password;
        const hashedPassword = await hash(plainPassword);

        users.push({
            ...sampleData.users[i],
            password: hashedPassword,
        });

        console.log(`User ${i+1}: ${sampleData.users[i].email}`);
        console.log(`  Password: ${plainPassword}`);
        console.log(`  Hashed: ${hashedPassword}`);

        // Проверяем, что пароль можно проверить
        const isMatch = await compare(plainPassword, hashedPassword);
        console.log(`  Password verification test: ${isMatch ? 'PASSED' : 'FAILED'}`);

        if (!isMatch) {
            console.error(`ERROR: Password verification failed for user ${sampleData.users[i].email}!`);
            process.exit(1);
        }
    }

    // Создаем пользователей
    console.log("\n=== Saving users to database ===");
    await prisma.user.createMany({ data: users });

    // Проверяем созданных пользователей
    console.log("\n=== Verifying created users ===");
    for (let i = 0; i < sampleData.users.length; i++) {
        const user = await prisma.user.findUnique({
            where: { email: sampleData.users[i].email }
        });

        if (user) {
            console.log(`User ${user.email} created successfully`);

            // Проверяем, что пароль верифицируется
            const isMatch = await compare(sampleData.users[i].password, user.password as string);
            console.log(`  Password verification: ${isMatch ? 'PASSED' : 'FAILED'}`);

            if (!isMatch) {
                console.error(`ERROR: Saved password verification failed for ${user.email}!`);
            }
        } else {
            console.error(`ERROR: User ${sampleData.users[i].email} not found in database!`);
        }
    }

    console.log('\nDatabase seeded successfully!');
}

main()
    .catch((e) => {
        console.error('Seeding error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });