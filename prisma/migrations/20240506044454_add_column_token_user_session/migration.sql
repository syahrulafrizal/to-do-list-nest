/*
  Warnings:

  - Added the required column `token` to the `UserSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserSession" ADD COLUMN     "token" TEXT NOT NULL;
