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
          mapHeaders: ({ header, index }) => {
            if (!headers.includes(header)) {
              headers.push(header);
              return header;
            } else {
              headers.push(header); // Still store to detect duplicates
              return header; // Keep it to show parser behavior (optional)
            }
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

  const headersRow = xlsx.utils.sheet_to_json(sheet, { header: 1 })[0];
  const duplicates = getDuplicateHeaders(headersRow, requiredFields);

  if (duplicates.length > 0) {
    throw new Error(`Duplicate headers found in Excel: ${duplicates.join(", ")}`);
  }

  return xlsx.utils.sheet_to_json(sheet);
};


function getDuplicateHeaders(headers: string[], requiredFields: string[]) {
  const seen = new Set();
  const duplicates = new Set();

  for (let header of headers.map(h => String(h).trim())) {  
    if (requiredFields.includes(header)) {
      if (seen.has(header)) {
        duplicates.add(header);
      } else {
        seen.add(header);
      }
    }
  }

  return Array.from(duplicates);
}