import csvParser from "csv-parser";
import { Readable } from "stream";
import * as xlsx from "xlsx/xlsx.mjs";

export const parseCSV = async (csvString: string, requiredFields: string[]) => {
  const results: any[] = [];
  const stream = Readable.from(csvString);

  let headers: string[] = [];

  return new Promise((resolve, reject) => {
    stream
      .pipe(
        csvParser({
          separator: ",",
          mapHeaders: ({ header }) => {
            const trimmedHeader = String(header).trim();
            headers.push(trimmedHeader);
            return trimmedHeader; // This ensures keys in 'data' are clean too
          },
        })
      )
      .on("data", (data) => results.push(data))
      .on("end", () => {
        const duplicates = getDuplicateHeaders(headers, requiredFields);
        if (duplicates.length > 0) {
          return reject(
            new Error(`Duplicate headers found in CSV: ${duplicates.join(", ")}`)
          );
        }
        resolve(results);
      })
      .on("error", (error) => reject(error));
  });
};

export const parseExcelBuffer = (buffer: any, requiredFields: string[]) => {
  const workbook = xlsx.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // Read the header row (first row)
  const rawHeadersRow = xlsx.utils.sheet_to_json(sheet, { header: 1 })[0] as string[];

  // Trim headers
  const headersRow = rawHeadersRow.map((header) => String(header).trim());

  // Check for duplicates using trimmed headers
  const duplicates = getDuplicateHeaders(headersRow, requiredFields);

  if (duplicates.length > 0) {
    throw new Error(`Duplicate headers found in Excel: ${duplicates.join(", ")}`);
  }

  // Parse full sheet using trimmed headers
  const data = xlsx.utils.sheet_to_json(sheet, {
    header: headersRow, // Use trimmed headers explicitly
    range: 1, // Skip the original header row
  });

  return data;
};

function getDuplicateHeaders(headers: string[], requiredFields: string[]) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  const normalizedRequired = requiredFields.map((h) => h.trim());

  for (const header of headers) {
    if (normalizedRequired.includes(header)) {
      if (seen.has(header)) {
        duplicates.add(header);
      } else {
        seen.add(header);
      }
    }
  }

  return Array.from(duplicates);
}