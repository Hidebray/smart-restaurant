import { PrismaClient } from '@prisma/client';

// Add prisma to the NodeJS global type
declare global {
  var prisma: PrismaClient | undefined;
}

// FIX: Replaced `global` with `globalThis` to resolve "Cannot find name 'global'" error. `globalThis` is the standardized way to access the global object across different JavaScript environments.
const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') {
  globalThis.prisma = prisma;
}

export default prisma;
