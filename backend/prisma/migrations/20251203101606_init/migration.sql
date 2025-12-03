-- CreateTable
CREATE TABLE "CareerConversation" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CareerConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareerMessage" (
    "id" SERIAL NOT NULL,
    "conversationId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CareerMessage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CareerMessage" ADD CONSTRAINT "CareerMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "CareerConversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
