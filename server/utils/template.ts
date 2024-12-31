export const getTemplatesByWabaId = async (wabaId: string, accessToken: string): Promise<any> => {
    const url = `https://graph.facebook.com/v21.0/${wabaId}/message_templates`;

    const templateList = await $fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return templateList;
};
