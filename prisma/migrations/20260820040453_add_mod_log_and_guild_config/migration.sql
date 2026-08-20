-- CreateTable
CREATE TABLE `mod_actions` (
    `id` VARCHAR(191) NOT NULL,
    `guildId` VARCHAR(191) NOT NULL,
    `actionType` ENUM('KICK', 'BAN', 'UNBAN', 'MUTE', 'ROLE_ADD', 'ROLE_REMOVE', 'CHANNEL_LOCK', 'CHANNEL_UNLOCK') NOT NULL,
    `targetId` VARCHAR(191) NOT NULL,
    `moderatorId` VARCHAR(191) NOT NULL,
    `reason` VARCHAR(191) NULL,
    `detail` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `mod_actions_guildId_targetId_idx`(`guildId`, `targetId`),
    INDEX `mod_actions_guildId_createdAt_idx`(`guildId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `guild_configs` (
    `guildId` VARCHAR(191) NOT NULL,
    `modLogChannelId` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`guildId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
