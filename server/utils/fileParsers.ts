import csvParser from "csv-parser";
import { Readable } from "stream";
import * as xlsx from "xlsx/xlsx.mjs";

export const parseCSV = async (csvString: string) => {
  const results: any = [];
  const stream = Readable.from(csvString);

  return new Promise((resolve, reject) => {
    stream
      .pipe(csvParser({ separator: "," }))
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
}

export const parseExcelBuffer = (buffer: any) => {
  const workbook = xlsx.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
  const sheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(sheet);
}
