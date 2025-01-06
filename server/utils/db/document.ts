import { join } from "path";
import { InsertPlaygroundDocument, playgroundDocumentSchema } from "~/server/schema/admin";

const db = useDrizzle();

export const getDocumentPath = (docId: string) => `./assets/docs/${docId}.pdf`;

export const getLogoPath = (logoName: string, extension: string) =>
  join(process.env.LOGO_DIR, `${logoName}.${extension}`);

export const createDocument = async (document: InsertDocument) =>
  (await db.insert(documentSchema).values(document).returning())[0];

export const listDocuments = async (botId: string) =>
  // await db.query.documentSchema.findMany({
  //   where: eq(documentSchema.botId, botId),
  //   orderBy: [desc(documentSchema.createdAt)],
  // });
  await db.query.chatBotSchema.findFirst({
    where: eq(chatBotSchema.id, botId),
    with: {
      documents: {
        orderBy: [desc(documentSchema.createdAt)],
      },
    },
  });

export const deleteDocument = async (docId: string) =>
  (
    await db
      .delete(documentSchema)
      .where(eq(documentSchema.id, docId))
      .returning()
  )[0];

export const getDocumentById = async (docId: string) =>
  await db.query.documentSchema.findFirst({
    where: eq(documentSchema.id, docId),
  });


// Playground Document

export const createPlaygroundDocument = async (document: InsertPlaygroundDocument) => {
  return (
    await db.insert(playgroundDocumentSchema).values(document).returning()
  )[0]
}