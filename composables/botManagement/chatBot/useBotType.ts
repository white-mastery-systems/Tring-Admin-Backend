// composables/useBotType.ts

export const industry = [
  "Government Sectors",
  "Finance & Banking",
  "Real Estate",
  "Healthcare",
  "E-commerce",
  "Energy & Utilities",
  "Telecommunications",
  "Travel & Hospitality",
  "Logistics",
  "Education & Training",
  "IT Service",
  "Other",
]

export type BotType =
  | "e-commerce"
  | "real-estate"
  | "government-sectors"
  | "finance-banking"
  | "healthcare"
  | "energy-utilities"
  | "telecommunications"
  // | "travel-hospitality"
  | "travel"
  | "hospitality"
  | "logistics"
  | "education-training"
  | "it-service";

// Bot types array with both label and value
export const botTypes = [
  { label: "Government Sectors", value: "government-sectors" },
  { label: "Finance & Banking", value: "finance-banking" },
  { label: "Real Estate", value: "real-estate" },
  { label: "Healthcare", value: "healthcare" },
  { label: "E-commerce", value: "e-commerce" },
  { label: "Energy & Utilities", value: "energy-utilities" },
  { label: "Telecommunications", value: "telecommunications" },
  // { label: "Travel & Hospitality", value: "travel-hospitality" },
  { label: "Travel", value: "travel" },
  { label: "Hospitality", value: "hospitality" },
  { label: "Logistics", value: "logistics" },
  { label: "Education & Training", value: "education-training" },
  { label: "IT Service", value: "it-service" },
];

// Function to get the label for a given BotType
export function useBotType(botType: BotType): string {
  const botTypeObj = botTypes.find(bot => bot.value === botType);
  return botTypeObj ? botTypeObj.label : "--";
}
