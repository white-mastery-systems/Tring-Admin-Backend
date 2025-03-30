import { ecommerceDynamicForm } from "./ecommerce.form";
import { educationTrainingDynamicForm } from "./education-training.form";
import { energyUtilitiesDynamicForm } from "./energy-utilities.form";
import { healthCareDynamicForm } from "./healthcare.form";
import { hospitalityDynamicForm } from "./hospitality.form";
import { itServiceDynamicForm } from "./it-service.form";
import { logisticsDynamicForm } from "./logistics.form";
import { realEstateDynamicForm } from "./real-estate.form";
import { telecommunicationDynamicForm } from "./telecommunication.form";
import { travelDynamicForm } from "./travel.form";

export const chatDynamicFormValues: Record<string, any> = {
  "real-estate": realEstateDynamicForm,
  // "government-sectors": ,
  // "finance-banking": ,
  "healthcare": healthCareDynamicForm,
  "e-commerce": ecommerceDynamicForm,
  "energy-utilities": energyUtilitiesDynamicForm,
  "telecommunications": telecommunicationDynamicForm,
  "travel": travelDynamicForm,
  "hospitality": hospitalityDynamicForm,
  "logistics": logisticsDynamicForm,
  "education-training": educationTrainingDynamicForm,
  "it-service": itServiceDynamicForm
};