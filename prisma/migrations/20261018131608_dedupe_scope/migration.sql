/*
  Warnings:

  - A unique constraint covering the columns `[dedupeScope,longUrl]` on the table `link` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "link" ADD COLUMN     "dedupeScope" TEXT NOT NULL DEFAULT 'anonymous';

-- CreateIndex
CREATE UNIQUE INDEX "link_dedupeScope_longUrl_key" ON "link"("dedupeScope", "longUrl");
