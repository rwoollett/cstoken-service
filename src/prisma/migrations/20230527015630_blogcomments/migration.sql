-- CreateTable
CREATE TABLE "blogArticles" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(50) NOT NULL,

    CONSTRAINT "blogArticles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blogComments" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "publishAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "articleSlug" TEXT NOT NULL,

    CONSTRAINT "blogComments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blogArticles_slug_key" ON "blogArticles"("slug");

-- AddForeignKey
ALTER TABLE "blogComments" ADD CONSTRAINT "blogComments_articleSlug_fkey" FOREIGN KEY ("articleSlug") REFERENCES "blogArticles"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;
