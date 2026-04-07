import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed de base de datos...');

    // Solo crear configuración inicial
    await prisma.setting.upsert({
        where: { key: 'restaurant_name' },
        update: {},
        create: {
            key: 'restaurant_name',
            value: 'OrdenaYa',
        },
    });

    console.log('🎉 Seed completado - No se crearon usuarios por defecto');
}

main()
    .catch((e) => {
        console.error('❌ Error en seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });