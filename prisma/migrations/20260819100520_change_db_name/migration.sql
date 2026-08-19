/*
  Warnings:

  - You are about to drop the `Warning` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Warning`;

-- CreateTable
CREATE TABLE `warnings` (
    `id` VARCHAR(191) NOT NULL,
    `guildId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `moderatorId` VARCHAR(191) NOT NULL,
    `reason` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `warnings_guildId_userId_idx`(`guildId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
