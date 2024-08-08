const signIn = async () => {
  console.log("Signing in");
  await $fetch("/api/auth/sign-in", {
    method: "POST",
    body: {
      username: "test",
      password: "asdf1234",
    },
  });
};
export const listApiBots = async () => {
  await signIn();
  const botsList = await $fetch("/api/bots", {
    query: { organization_id: "4e606bb3-3264-410f-9a2d-4910f17685e3" },
  });

  return botsList.map((bot) => {
    return {
      id: bot.id,
      name: bot.name,
      createdAt: new Date(bot.createdAt).getDate(),
    };
  });
};
