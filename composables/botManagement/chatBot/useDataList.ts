import { ref } from 'vue';

export function useDataList() {
  const dataList = ref([
    {
      _id: 1,
      bot: "UI Customization",
      helperText: "Color,Logo,Icon etc...",
      routeName: "bot-management-chat-bot-id-ui-customization",
    },
    {
      _id: 2,
      bot: "Document Management",
      helperText: "Knowledge base,Training data etc...",
      routeName: "bot-management-chat-bot-id-documents",
    },
    {
      _id: 3,
      bot: "Bot Configuration",
      helperText: "Name,Description,Notes etc...",
      routeName: "bot-management-chat-bot-id-config",
    },
    {
      _id: 4,
      bot: "Bot Actions",
      helperText: "Add your intents Eg: Location Virtual Tour etc...",
      routeName: "bot-management-chat-bot-id-intent-management",
    },
    {
      _id: 5,
      bot: "Custom Actions",
      helperText: "Define the fields for your dynamic form. Each field should include details like type, label, placeholder, and whether it's required.",
      routeName: "bot-management-chat-bot-id-dynamic-form",
    },
    {
      _id: 6,
      bot: "CRM Configuration",
      helperText: "Add CRM to manage your leads effectively",
      routeName: "bot-management-chat-bot-id-crm-config",
    },
    {
      _id: 7,
      bot: "Communication Channel Configuration",
      helperText: "Add Communication channel to manage your leads effectively",
      routeName: "bot-management-chat-bot-id-communication-channel-config",
    },
    {
      _id: 8,
      bot: "Email Configuration",
      helperText: "Configure the email settings for your bot",
      routeName: "bot-management-chat-bot-id-email-editor",
    },
    {
      _id: 9,
      bot: "Tools",
      helperText: "Manage and configure tools for your bot",
      routeName: "bot-management-chat-bot-id-tools",
    },
  ]);

  return { dataList };
}
