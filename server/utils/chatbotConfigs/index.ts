import { realEstateConfigs } from "./realEstate.config";
import { healthCareConfigs } from "./healthCare.config";
import { logisticsConfigs } from "./logistics.config";
import { ecommerceConfigs } from "./ecommerce.config";
import { governmentSectorConfigs } from "./govermentSector.config";
import { financeAndBankingConfigs } from "./finance&Banking.config";
import { telecommunicationConfigs } from "./telecommunication.config";
import { energyAndUtilitiesConfigs } from "./energy&Utilities.config";
import { travelAndHospitalityConfigs } from "./travel&Hospitality.config";
import { educationAndTrainingConfig } from "./education&training.config";
import { itServiceConfig } from "./it-service.config";

export const chatbotConfigs: Record<string, any> = {
  "real-estate": realEstateConfigs,
  "government-sectors": governmentSectorConfigs,
  "finance-banking": financeAndBankingConfigs,
  "healthcare": healthCareConfigs,
  "ecommerce": ecommerceConfigs,
  "energy-utilities": energyAndUtilitiesConfigs,
  "telecommunications": telecommunicationConfigs,
  "travel-hospitality": travelAndHospitalityConfigs,
  "logistics": logisticsConfigs,
  "education-training": educationAndTrainingConfig,
  "it-service": itServiceConfig
};