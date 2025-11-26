import { PrismaClient } from "@prisma/client";

// Force reload for schema changes

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Workaround: Force new client instance to pick up schema changes in dev
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = undefined;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;