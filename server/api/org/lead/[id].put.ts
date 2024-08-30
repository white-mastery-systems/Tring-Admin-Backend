import { updateLead } from "~/server/utils/db/leads";

const zodUpdateLead = z.object({
  status: z.string()
})

export default defineEventHandler(async(event) => {
   await isOrganizationAdminHandler(event)
   const { id: leadId } = await isValidRouteParamHandler(
    event,
    checkPayloadId("id"),
  );

  const lead: any = await isValidBodyHandler(event, zodUpdateLead)
   
  const update = await updateLead(leadId, lead)

  return update
})