export const addToolschema = toTypedSchema(
  z.object({
    currentDate: z.boolean(),
    concludeCall: z.boolean(),
    forwardCall: z.boolean(),
    genderIdentification: z.boolean(),
    clientFormControl: z.boolean(),
    propertieFormControl: z.boolean(),
    clientTools: z.array(
      z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        endpoint: z.string().optional(),
        audio: z.any().optional(),
        parameters: z.object({
          type: z.literal("object"),
          properties: z.array(
            z.object({
              name: z.string().optional(),
              type: z.enum(["string", "integer", "boolean", "number"]),
              description: z.string().optional(),
              required: z.boolean()
            })
          ),
        })
      })
    )
  })
    .superRefine((data, ctx) => {
      if (data.clientFormControl) {
        data.clientTools.forEach((clientTool, index) => {
          // Validate each clientTool
          if (!clientTool.name) {
            ctx.addIssue({
              path: ["clientTools", index, "name"],
              message: "Client tool name is required",
            });
          }
          if (!clientTool.description) {
            ctx.addIssue({
              path: ["clientTools", index, "description"],
              message: "Client tool description is required",
            });
          }
          if (!clientTool.endpoint) {
            ctx.addIssue({
              path: ["clientTools", index, "endpoint"],
              message: "Client tool endpoint is required",
            });
          } else {
            try {
              new URL(clientTool.endpoint); // Validate URL format
            } catch {
              ctx.addIssue({
                path: ["clientTools", index, "endpoint"],
                message: "Invalid URL format",
              });
            }
          }

          // Check if properties exist in parameters and validate them
          if (data.propertieFormControl) {
            clientTool.parameters?.properties.forEach((property, propIndex) => {
              if (!property.name?.trim()) {
                ctx.addIssue({
                  path: [
                    "clientTools",
                    index,
                    "parameters",
                    "properties",
                    propIndex,
                    "name",
                  ],
                  message: "Parameter name is required",
                });
              }
              if (!property.description?.trim()) {
                ctx.addIssue({
                  path: [
                    "clientTools",
                    index,
                    "parameters",
                    "properties",
                    propIndex,
                    "description",
                  ],
                  message: "Parameter description is required",
                });
              }
            });

            // If no properties exist, add a validation issue for the missing properties
            // if (!clientTool.parameters?.properties.length) {
            //   ctx.addIssue({
            //     path: ["clientTools", index, "parameters", "properties"],
            //     message: "At least one parameter property is required",
            //   });
            // }
          }
        });
      }
    }))

export const addToolChatBotschema = toTypedSchema(
  z.object({
    date_time: z.boolean(),
    schedule_appointment: z.boolean(),
    site_visit: z.boolean(),
    schedule_call: z.boolean(),
    clientFormControl: z.boolean(),
    propertieFormControl: z.boolean(),
    customTools: z.array(
      z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        endpoint: z.string().optional(),
        // audio: z.any().optional(),
        parameters: z.object({
          type: z.literal("object"),
          properties: z.array(
            z.object({
              name: z.string().optional(),
              type: z.enum(["string", "integer", "boolean", "number"]),
              description: z.string().optional(),
              required: z.boolean()
            })
          ),
        })
      })
    )
  })
    .superRefine((data, ctx) => {
      if (data.clientFormControl) {
        data.customTools.forEach((clientTool, index) => {
          // Validate each clientTool
          if (!clientTool.name) {
            ctx.addIssue({
              path: ["customTools", index, "name"],
              message: "Client tool name is required",
            });
          }
          if (!clientTool.description) {
            ctx.addIssue({
              path: ["customTools", index, "description"],
              message: "Client tool description is required",
            });
          }
          if (!clientTool.endpoint) {
            ctx.addIssue({
              path: ["customTools", index, "endpoint"],
              message: "Client tool endpoint is required",
            });
          } else {
            try {
              new URL(clientTool.endpoint); // Validate URL format
            } catch {
              ctx.addIssue({
                path: ["customTools", index, "endpoint"],
                message: "Invalid URL format",
              });
            }
          }

          // Check if properties exist in parameters and validate them
          if (data.propertieFormControl) {
            clientTool.parameters?.properties.forEach((property, propIndex) => {
              if (!property.name?.trim()) {
                ctx.addIssue({
                  path: [
                    "customTools",
                    index,
                    "parameters",
                    "properties",
                    propIndex,
                    "name",
                  ],
                  message: "Parameter name is required",
                });
              }
              if (!property.description?.trim()) {
                ctx.addIssue({
                  path: [
                    "customTools",
                    index,
                    "parameters",
                    "properties",
                    propIndex,
                    "description",
                  ],
                  message: "Parameter description is required",
                });
              }
            });

            // If no properties exist, add a validation issue for the missing properties
            // if (!clientTool.parameters?.properties.length) {
            //   ctx.addIssue({
            //     path: ["clientTools", index, "parameters", "properties"],
            //     message: "At least one parameter property is required",
            //   });
            // }
          }
        });
      }
    }))