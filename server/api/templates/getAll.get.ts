import { getTemplatesByWabaId, listAllApprovedTemplates } from "~/server/utils/template";

const zodQueryValidator = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  q: z.string().optional(),
  id: z.string().optional(),
  status: z.string().optional()
});

export default defineEventHandler(async (event) => {

  const organizationId = (await isOrganizationAdminHandler(event)) as string;

  const [query, integrationList] = await Promise.all([
    isValidQueryHandler(event, zodQueryValidator),
    getOrgWhatsappIntegration(organizationId),
  ]);

  if(integrationList.length){
    if(query?.id){
      const integration = integrationList.find((item)=> item.id === query.id)
      if(integration?.metadata?.wabaId && integration?.metadata?.access_token){
        const templateList = (query?.status === "approved") ? await listAllApprovedTemplates(integration?.metadata?.wabaId, integration?.metadata?.access_token): await getTemplatesByWabaId(integration?.metadata?.wabaId, integration?.metadata?.access_token, query?.limit || "10");
        return {
          integrationId: query?.id,
          templates: templateList || [],
        };
      }
    } else {
      const templatesList = integrationList.map(async (item)=>{
        if(item?.metadata?.wabaId && item?.metadata?.access_token){
          return await listAllApprovedTemplates(item?.metadata?.wabaId, item?.metadata?.access_token);
        }
      })
      const templateList = await Promise.all(templatesList);
      return {
        integrationId: integrationList.map((item) => item.id),
        templates: templateList.flat(),
      };
    }
  }

  return {
    integrationId: "all",
    templates: []
  };
});
