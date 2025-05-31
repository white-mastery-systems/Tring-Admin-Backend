import type { H3Event } from "h3";
import { z, ZodType } from "zod";

export enum BotType {
  chat = 'chat',
  voice = 'voice',
}

export const zodBotTypeQuery = z.object({
  type: z.nativeEnum(BotType),
})

export const zodListQuery = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  q: z.string().optional(),
})

const config = useRuntimeConfig()

export const checkPayloadId = <T extends string>(key: T) =>
  z.object({
    [key]: z.string().uuid(),
  }) as z.ZodObject<{ [K in T]: z.ZodString }>;

export const isOrganizationAdminHandler = async (event: H3Event) => {
  // Check if user is authorized to access bots of the organization
  const user = event.context.user;
  if (!user || user.role !== AuthRoles.Admin)
    return sendError(
      event,
      createError({
        statusCode: 401,
        statusMessage:
          "Unauthorized: You must be an admin to access this resource.",
      }),
    );

  return user.organizationId;
};

export const isValidQueryHandler = async <T extends ZodType>(
  event: H3Event,
  validationSchema: T,
): Promise<T["_output"]> => {
  const query = await getValidatedQuery(event, validationSchema.safeParse);
  if (!query.success)
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage:
          "Invalid query: The query failed due to incorrect or missing parameters.",
        data: query.error.format(),
      }),
    );
  return query.data;
};

export const isValidBodyHandler = async <T extends ZodType>(
  event: H3Event,
  validationSchema: T,
): Promise<T["_output"]> => {
  const body = await readValidatedBody(event, validationSchema.safeParseAsync);
  if (!body.success)
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage:
          "Invalid body: The request body contains errors or is malformed.",
        data: body.error.issues,
      }),
    );
  return body.data;
};

export const isValidRouteParamHandler = async <T extends ZodType>(
  event: H3Event,
  validationSchema: T,
): Promise<T["_output"]> => {
  const params = await getValidatedRouterParams(
    event,
    validationSchema.safeParse,
  );
  if (!params.success)
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage:
          "Invalid parameters: The provided parameters are incorrect or incomplete.",
        data: params.error.format(),
      }),
    );
  return params.data;
};

export const isValidReturnType = async <T>(
  event: H3Event,
  rv: T,
): Promise<NonNullable<T>> => {
  if (!rv)
    // @ts-ignore
    return sendError(
      event,
      createError({
        statusCode: 404,
        statusMessage:
          "Not Found: The requested resource or data could not be located.",
      }),
    );
  return rv;
};
