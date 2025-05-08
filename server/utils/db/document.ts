import { v4 as uuid } from "uuid";
import { logger } from "~/server/logger";
import { writeFile } from "node:fs/promises";
import { InsertVoicebotDocument, voicebotDocumentSchema } from "~/server/schema/voicebot";
import { InsertPlaygroundDocument, playgroundDocumentSchema } from "~/server/schema/admin";

const config = useRuntimeConfig()

const db = useDrizzle();

// Chatbot Documents
export const getDocumentPath = (docId: string) => `./assets/docs/${docId}.pdf`;

// export const getLogoPath = (logoName: string, extension: string) =>
//   join(process.env.LOGO_DIR, `${logoName}.${extension}`);

export const createDocument = async (document: InsertDocument) =>
  (await db.insert(documentSchema).values(document).returning())[0];

export const uploadChatbotDocument = async (organizationId: string, formData: any, fileData: any, botId?: string) => {
  try {
    const body = zodInsertDocument.safeParse({
      name: formData.find(({ name }) => name === "name")?.data.toString()!,
      organizationId,
      ...botId && { botId }
    })

    if (!body.success) {
      throw new Error("Invalid Document Data (name): The 'name' field in the document data is invalid or missing. Please verify the input and try again.")
    }
    // Create Document
    const document = await createDocument(body.data);
    await writeFile(getDocumentPath(document.id), fileData.data);
  
    // Create Form Data
    const form = new FormData();
    const { data, filename, ...rest } = fileData;
  
    const file = new File([data], filename!, rest);
  
    form.append("name", body.data.name?.replace(/[^a-zA-Z0-9.]/g, ""));
    form.append("files", file);
  
    form.append(
      "ragRequest",
      JSON.stringify({
        documentId: document.id,
        ragModelRequest: {
          provider: "openai",
          modelName: "",
          messages: [],
        },
        callbackUrl: `${config.public.adminBaseUrl}/api/documents/${document.id}`,
      }),
    );
    
    $fetch(`/rag/document`, {
      method: "POST",
      baseURL: config.llmBaseUrl,
      body: form,
    });
  
    return [document];
  } catch (error: any) {
    logger.error(`Chatbot upload Document error: ${JSON.stringify(error.message)}`)
    throw new Error(error)
  }
}

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

export const updateDocument = async (docId: string, data: any) => {
  await db
    .update(documentSchema)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(documentSchema.id, docId))
}


// Playground Document

export const createPlaygroundDocument = async (document: InsertPlaygroundDocument) => {
  return (
    await db.insert(playgroundDocumentSchema).values(document).returning()
  )[0]
}

// Voicebot Document

export const getVoicebotDocumentPath = (docId: string) => `./assets/voicebot-docs/${docId}.pdf`;

export const createVoicebotDocument = async (document: InsertVoicebotDocument) => {
  return (
    await db.insert(voicebotDocumentSchema).values(document).returning()
  )[0]
}

export const getVoicebotDocumentById = async (docId: string) => {
  return await db.query.voicebotDocumentSchema.findFirst({
    where: eq(voicebotDocumentSchema.id, docId)
  })
}

export const updateVoicebotDocument = async (docId: string, data: any) => {
  await db.update(voicebotDocumentSchema)
  .set({
    ...data,
    updatedAt: new Date(),
  }).where(eq(voicebotDocumentSchema.id, docId))
}

export const deleteVoicebotDocument = async (docId: string) => {
  return (await db.delete(voicebotDocumentSchema)
    .where(eq(voicebotDocumentSchema.id, docId))
    .returning()
  )[0]
}

export const voicebotDocumentParsing = async (documentId: string, form: any) => {
  try{
    const parsedDoc: any = await $fetch(`http://148.113.16.40:5010/voice-parse-pdf`, {
      method: "POST",
      body: form
    })
    const jsonDocument = JSON.parse(parsedDoc)
    updateVoicebotDocument(documentId, { documentContent: jsonDocument.document_content, status: "success" });
  } catch (error: any) {
    updateVoicebotDocument(documentId, { status: "failed" });
  }
}

export const uploadVoicebotDocument = async (organizationId: string, fileData: any, fileName: string, botId?: string) => {
  try {
    const body = zodInsertVoiceBotDocument.safeParse({
      documentName: fileName,
      organizationId,
      ...botId && { voicebotId: botId }
    })

    // return body
    if (!body.success) {
      throw new Error("Invalid Document Data (name): The 'name' field in the document data is invalid or missing. Please verify the input and try again.")
    }

    // Create Document
    const document = await createVoicebotDocument(body.data);
    await writeFile(getVoicebotDocumentPath(document.id), fileData.data);

    // Create Form Data
    const form = new FormData();
    const { data, filename, ...rest } = fileData;
  
    const file = new File([data], filename!, rest);
    form.append("file", file);   

    voicebotDocumentParsing(document.id, form)
    return document
  } catch (error: any) {
    logger.error(`Upload voicebot document Error: ${JSON.stringify(error.message)}`)
    throw new Error(error)
  }
}