import { realEstateConfigs } from "./realEstate.config";
import { governmentSectorConfigs } from "./govermentSector.config";
import { logisticsConfigs } from "./logistics.config";
import { travelAndHospitalityConfigs } from "./travel&Hospitality.config";
import { telecommunicationConfigs } from "./telecommunication.config";
import { energyAndUtilitiesConfigs } from "./energy&Utilities.config";
import { ecommerceConfigs } from "./ecommerce.config";
import { healthCareConfigs } from "./healthCare.config";
import { financeAndBankingConfigs } from "./finance&Banking.config";

export const chatbotConfigs: Record<string, any> = {
  real_estate: realEstateConfigs,
  government_sector: governmentSectorConfigs,
  finance_banking: financeAndBankingConfigs,
  healthcare: healthCareConfigs,
  ecommerce: ecommerceConfigs,
  energy_utilities: energyAndUtilitiesConfigs,
  telecommunications: telecommunicationConfigs,
  travel_hospitality: travelAndHospitalityConfigs,
  logistics: logisticsConfigs
};