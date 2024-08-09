export const listApiBots = async () => {
  await authHandlers.login({ username: "test", password: "asdf1234" });
  const botsList = await $fetch("/api/bots");

  const formatDateStringToDate = (dateString: string) => {
    const date = new Date(dateString);
    console.log(dateString, date);
    return formatDate(date, "dd.MM.yyyy ");
  };

  return botsList.map((bot) => {
    return {
      id: bot.id,
      name: bot.name,
      status: bot.documentId ? "Active" : "Inactive",
      createdAt: formatDateStringToDate(bot.createdAt),
    };
  });
};
