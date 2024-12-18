// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  //   // Create basic permissions
  //   const permissions = await Promise.all([
  //     prisma.permission.create({
  //       data: {
  //         name: 'view_roles',
  //         description: 'Can view roles',
  //       },
  //     }),
  //     prisma.permission.create({
  //       data: {
  //         name: 'manage_roles',
  //         description: 'Can manage roles',
  //       },
  //     }),
  //     prisma.permission.create({
  //       data: {
  //         name: 'manage_users',
  //         description: 'Can manage users',
  //       },
  //     }),
  //   ]);

  //   const existingAdminRole = await prisma.role.findUnique({
  //     where: { name: 'admin' },
  //   });

  //   let adminRole;
  //   if (!existingAdminRole) {
  //     adminRole = await prisma.role.create({
  //       data: {
  //         name: 'admin',
  //         description: 'Administrator with full access',
  //         permissions: {
  //           connect: permissions.map((p) => ({ id: p.id })),
  //         },
  //       },
  //     });
  //   } else {
  //     console.log('Admin role already exists.');
  //     adminRole = existingAdminRole;
  //   }

  //   // Create admin user
  //   const hashedPassword = await bcrypt.hash('admin123', 10);
  //   await prisma.user.create({
  //     data: {
  //       email: 'admin@example.com',
  //       password: hashedPassword,
  //       isActive: true,
  //       roles: {
  //         connect: { id: adminRole.id },
  //       },
  //     },
  //   });
  // }

  const existingUserRole = await prisma.role.findUnique({
    where: { name: 'user' },
  });

  let userRole;
  if (!existingUserRole) {
    userRole = await prisma.role.create({
      data: {
        name: 'user',
        description: 'User with full access',
        permissions: {
          connect: [{ id: '67331b06416f350d30579565' }],
        },
      },
    });
  } else {
    console.log('User role already exists.');
    userRole = existingUserRole;
  }

  //create user
  const hashedPassword = await bcrypt.hash('user123', 10);
  await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: hashedPassword,
      isActive: true,
      roles: {
        connect: { id: userRole.id },
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
