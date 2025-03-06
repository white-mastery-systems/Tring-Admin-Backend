import { realEstateConfigs } from "./realEstate.config";
import { healthCareConfigs } from "./healthCare.config";
import { logisticsConfigs } from "./logistics.config";
import { ecommerceConfigs } from "./ecommerce.config";
import { governmentSectorConfigs } from "./govermentSector.config";
import { financeAndBankingConfigs } from "./finance&Banking.config";
import { telecommunicationConfigs } from "./telecommunication.config";
import { energyAndUtilitiesConfigs } from "./energy&Utilities.config";
import { travelAndHospitalityConfigs } from "./travel&Hospitality.config";

export const chatbotConfigs: Record<string, any> = {
  realEstate: realEstateConfigs,
  governmentSector: governmentSectorConfigs,
  financeAndBanking: financeAndBankingConfigs,
  healthcare: healthCareConfigs,
  ecommerce: ecommerceConfigs,
  energyAndUtilities: energyAndUtilitiesConfigs,
  telecommunications: telecommunicationConfigs,
  travelAndHospitality: travelAndHospitalityConfigs,
  logistics: logisticsConfigs
};