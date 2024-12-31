export const getTemplatesByWabaId = async (wabaId: string, accessToken: string, limit: string): Promise<any> => {
    const url = `https://graph.facebook.com/v21.0/${wabaId}/message_templates?fields=name,status&limit=${limit}`;

    const templateList = await $fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    
   return templateList?.data;
    
};
