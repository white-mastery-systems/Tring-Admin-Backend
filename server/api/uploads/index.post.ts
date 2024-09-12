import { writeFile } from "node:fs/promises";
import { existsSync, mkdirSync } from 'node:fs';
import { v4 as uuid } from "uuid";
import { join, extname } from "node:path";


export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)
  
   if (!formData) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Invalid Data",
      }),
    );
  }
  const uploadDir = join(process.cwd(), 'assets', 'uploads');

  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }
 
  // return { formData }
  const data = await Promise.all(
    formData.map(async (file) => {
      const mimeType = extname(file.filename || "");
      const fileName = `${uuid()}${mimeType}`;
      const fileData = file.data
      const fileType = file.type?.toString()
      const filePath = `./assets/uploads/${fileName}`
      await writeFile(filePath, fileData) 
      const fileUrl = `/uploads/${fileName}`
      return {
        name: file.filename,
        size: file.data?.length,
        type: fileType,
        url: fileUrl,
      }
    })
  )
  return data
})