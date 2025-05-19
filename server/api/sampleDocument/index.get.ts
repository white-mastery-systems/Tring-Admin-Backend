import { logger } from "~/server/logger"
import { errorResponse } from "~/server/response/error.response"
import { stat, readFile } from "node:fs/promises";

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  try {
    const query = await isValidQueryHandler(event, z.object({
      type: z.enum([  
        "real-estate",
        "government-sectors",
        "finance-banking",
        "healthcare",
        "e-commerce",
        "energy-utilities",
        "telecommunications",
        "travel-hospitality",
        "logistics",
        "education-training",
        "it-service"
      ])
    }))

    const documentPath = `./assets/sampleDocuments/${query.type}.pdf`

     return serveStatic(event, {
        getContents: (id) => readFile(documentPath),
        getMeta: async (id) => {
          const stats = await stat(documentPath).catch(() => {});
    
          if (!stats || !stats.isFile()) {
            return;
          }
    
          return {
            size: stats.size,
            mtime: stats.mtimeMs,
          };
        },
      });

  } catch (error: any) {
    logger.error(`Get sample document API Error: ${JSON.stringify(error.message)}`)
    return errorResponse(event, 500, "Unable to fetch sample document")
  }
})