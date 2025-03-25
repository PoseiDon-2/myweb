-- CreateTable
CREATE TABLE `Creator` (
    `id` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `schoolName` VARCHAR(191) NOT NULL,
    `schoolDistrict` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NOT NULL,
    `schoolAddress` TEXT NOT NULL,
    `licenseFileUrl` VARCHAR(191) NULL,
    `positionFileUrl` VARCHAR(191) NULL,
    `isVerified` BOOLEAN NOT NULL DEFAULT false,
    `termsAccepted` BOOLEAN NOT NULL DEFAULT false,
    `privacyAccepted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Creator_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
