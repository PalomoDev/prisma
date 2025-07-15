// Создайте новый файл для обновления паролей, например update-passwords.ts
import { prisma } from "@/db/prisma";
import { hash } from "@/lib/encrypt";

async function updatePasswords() {
    console.log("=== Starting password update ===");

    // Получаем всех пользователей с паролями
    const users = await prisma.user.findMany({
        where: {
            password: {
                not: null
            }
        }
    });
    console.log(`Found ${users.length} users with passwords to check`);

    let updatedCount = 0;
    let skippedCount = 0;

    // Обновляем пароли для всех пользователей
    for (const user of users) {
        if (!user.password) {
            console.log(`❌ Skipping user ${user.email} - no password`);
            skippedCount++;
            continue;
        }

        // Проверяем, уже ли пароль захеширован (bcrypt хеши начинаются с $2b$)
        if (user.password.startsWith('$2b$')) {
            console.log(`✅ Skipping user ${user.email} - password already hashed`);
            skippedCount++;
            continue;
        }

        console.log(`🔄 Updating user: ${user.email}`);
        console.log(`📝 Current password (plain): ${user.password}`);

        // Хешируем существующий пароль
        const hashedPassword = await hash(user.password);
        console.log(`🔐 New hash: ${hashedPassword.substring(0, 29)}...`);

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        });

        console.log(`✅ User ${user.email} updated successfully`);
        updatedCount++;
    }

    console.log("=== Password update completed ===");
    console.log(`✅ Updated: ${updatedCount} users`);
    console.log(`⏭️ Skipped: ${skippedCount} users`);
    console.log(`📊 Total: ${users.length} users processed`);
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