export default defineEventHandler((event) => {
  const user = event.context.user;
  if(!user) {
    return { status: false }
  }
  return { status: true }
})