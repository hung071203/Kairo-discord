import { prisma } from "@src/core/database/prisma.js";

export async function getOrCreateGuildConfig(guildId: string) {
  return prisma.guildConfig.upsert({
    where: { guildId },
    update: {},
    create: { guildId },
  });
}

export async function addWarn(
  guildId: string,
  userId: string,
  moderatorId: string,
  reason?: string,
) {
  await getOrCreateGuildConfig(guildId);
  return prisma.warn.create({
    data: { guildId, userId, moderatorId, reason },
  });
}

export async function getWarns(guildId: string, userId: string) {
  return prisma.warn.findMany({
    where: { guildId, userId },
    orderBy: { createdAt: "desc" },
  });
}
