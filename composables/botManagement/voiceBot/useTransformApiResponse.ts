export const useTransformApiResponse = () => {
  const transformApiResponse = (apiResponse: any) => {
    const tools = apiResponse.tools || {};

    // Convert defaultTools back to individual flags
    const defaultToolsSet = new Set(tools.defaultTools || []);
    console.log(tools.voiceBotId, 'tools')
    const transformedData: any = {
      date_time: defaultToolsSet.has("date_time"),
      schedule_appointment: defaultToolsSet.has("schedule_appointment"),
      site_visit: defaultToolsSet.has("site_visit"),
      schedule_call: defaultToolsSet.has("schedule_call"),
      schedule_call_with_voice: defaultToolsSet.has("schedule_call_with_voice"),
      voice_bot: tools?.voiceBotId,
      clientFormControl: true,
      propertieFormControl: true,
      customTools: [],
    };

    // Convert toolEndpoints into a key-value map
    const toolEndpoints = tools.toolEndpoints.reduce((acc, obj) => {
      return { ...acc, ...obj };
    }, {});

    // Convert customTools back to original format
    transformedData.customTools = tools.customTools.map((tool: any) => {
      const functionData = tool.function;
      return {
        name: functionData.name,
        description: functionData.description,
        endpoint: toolEndpoints[functionData.name] || "",
        parameters: {
          type: "object",
          properties: Object.entries(functionData.parameters.properties).map(
            ([key, value]: any) => ({
              name: key
                .replace(/_/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase()), // Convert to Title Case
              type: value.type,
              description: value.description,
              required: functionData.parameters.required.includes(key),
            })
          ),
        },
      };
    });

    return transformedData;
  };

  return {
    transformApiResponse,
  };
};
