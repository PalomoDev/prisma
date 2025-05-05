import { PrismaClient } from '@/prisma/generated/client'
import sampleData from '@/db/sample-date';
import { hash } from '@/lib/encrypt';

const prisma = new PrismaClient()

async function main() {
    await prisma.product.deleteMany();
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    await prisma.verificationToken.deleteMany();
    await prisma.user.deleteMany();

    const users = [];
    for (let i = 0; i < sampleData.users.length; i++) {
        users.push({
            ...sampleData.users[i],
            password: await hash(sampleData.users[i].password),
        });
        console.log(
            sampleData.users[i].password,
            await hash(sampleData.users[i].password)
        );
    }

    await prisma.user.createMany({ data: users });

    console.log('Database seeded successfully!');

}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })