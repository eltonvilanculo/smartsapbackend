/*
  Warnings:

  - You are about to drop the column `endtAt` on the `Task` table. All the data in the column will be lost.
  - Added the required column `endAt` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Task` DROP COLUMN `endtAt`,
    ADD COLUMN `endAt` DATETIME(3) NOT NULL;
