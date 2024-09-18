export default defineEventHandler(async (event) => {
  const query = await ValidatedQuery(event)
})