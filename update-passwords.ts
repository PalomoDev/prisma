// Создайте новый файл для обновления паролей, например update-passwords.ts
import { prisma } from "@/db/prisma";
import { hash } from "@/lib/encrypt";

async function updatePasswords() {
    console.log("=== Starting password update ===");
    console.log(`ENCRYPTION_KEY length: ${process.env.ENCRYPTION_KEY?.length}`);

    // Получаем всех пользователей
    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} users to update`);

    // Обновляем пароли для всех пользователей
    for (const user of users) {
        // Используем тот же пароль из примера или установите свой
        const plainPassword = "111111"; // Используйте простой пароль для тестирования
        const hashedPassword = await hash(plainPassword);

        console.log(`Updating user: ${user.email}`);
        console.log(`New hash: ${hashedPassword}`);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        });

        // Проверяем, что обновление прошло успешно
        const updatedUser = await prisma.user.findUnique({
            where: { id: user.id }
        });

        console.log(`Updated hash in DB: ${updatedUser?.password}`);
        console.log(`Verification: ${hashedPassword === updatedUser?.password}`);
    }

    console.log("Password update completed successfully!");
}

// Запускаем функцию
updatePasswords()
    .catch(e => {
        console.error("Error updating passwords:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });