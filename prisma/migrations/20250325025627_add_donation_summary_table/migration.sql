-- CreateTable
CREATE TABLE `DonationSummary` (
    `id` VARCHAR(191) NOT NULL,
    `totalAmount` DOUBLE NOT NULL,
    `totalDonors` INTEGER NOT NULL,
    `totalRequests` INTEGER NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
