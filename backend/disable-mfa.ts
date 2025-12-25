
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const phone = '+8801712345102';
    console.log(`Checking user: ${phone}`);

    const user = await prisma.users.findUnique({
        where: { phone },
    });

    if (!user) {
        console.log('User not found!');
        return;
    }

    console.log(`User found: ${user.name}, Role: ${user.role}, MFA: ${user.mfa_enabled}`);

    if (user.mfa_enabled) {
        console.log('Disabling MFA...');
        await prisma.users.update({
            where: { id: user.id },
            data: { mfa_enabled: false },
        });
        console.log('MFA disabled successfully.');
    } else {
        console.log('MFA is already disabled.');
    }
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
