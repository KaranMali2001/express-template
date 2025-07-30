import { prisma } from '@/app';
export const userService = {
  createUser: async (email: string, password: string) => {
    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password,
        },
      });

      return user;
    });
  },
  getUserById: async (id: string) => {
    return await prisma.user.findUnique({
      where: {
        id,
      },
    });
  },

  deleteUser: async (id: string) => {
    return await prisma.user.delete({
      where: {
        id,
      },
    });
  },
};
