export default defineEventHandler(async (event) => {
  const body: any = await readBody(event)
  const result = await sendEmail(body?.email, body?.subject, body?.message);
  return result
})  