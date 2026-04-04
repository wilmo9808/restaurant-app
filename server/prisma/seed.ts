import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed de base de datos...');


    for (const user of users) {
        const hashedPassword = await hashPassword(user.password);
        await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: {
                email: user.email,
                password: hashedPassword,
                name: user.name,
                role: user.role,
                isActive: true,
            },
        });
        console.log(`✅ Usuario creado: ${user.email} (${user.role})`);
    }

    console.log('🎉 Seed completado exitosamente - Solo usuarios creados');
}

main()
    .catch((e) => {
        console.error('❌ Error en seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });