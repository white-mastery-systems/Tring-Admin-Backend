// import { useNitroLogger, useStorage } from "#imports";

// export async function logToFile(level: string, message: string) {
//   const storage = useStorage("log");
//   const date = new Date().toISOString().split("T")[0];
//   const logFileName = `${date}-${level}.log`;
//   const existingLogs = (await storage.getItem(logFileName)) || "";
//   const newLog = `${new Date().toISOString()} - ${message}\n`;
//   await storage.setItem(logFileName, existingLogs + newLog);
// }

// export function useCustomLogger() {
//   const log = useNitroLogger();

//   return {
//     info: (message: string) => {
//       log.info(message);
//       logToFile("info", message);
//     },
//     error: (message: string) => {
//       log.error(message);
//       logToFile("error", message);
//     },
//     warn: (message: string) => {
//       log.warn(message);
//       logToFile("warn", message);
//     },
//   };
// }
