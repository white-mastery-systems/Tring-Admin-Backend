import { ref } from 'vue';
import {
  Bot,
  ChartNoAxesColumnIncreasing,
  HomeIcon,
  MessageCircle,
  SettingsIcon,
  WalletIcon,
  UserIcon,
  CreditCardIcon,
  ReceiptIcon,
  CircleUserIcon,
  AudioLines,
  BotIcon
} from "lucide-vue-next";

export const useNavigationAndAccordion = () => {
  
  const navigationModules = ref([
    {
      name: "Home",
      icon: 'home',
      path: "/",
      children: [],
    },
    {
      name: "Customer Logs",
      icon: 'perm_phone_msg',
      path: "/analytics",
      children: [
        {
          name: "Leads",
          path: "/leads",
        },
        {
          name: "Chat",
          icon: MessageCircle,
          children: [],
          path: "/chats",
        },
        {
          name: "Call",
          icon: MessageCircle,
          children: [],
          path: "/call-logs",
        },
      ],
    },
    {
      name: "Marketing & Outreach",
      icon: 'campaign',
      path: "/contacts-management",
      children: [
        {
          name: "Contacts",
          path: "/contacts",
        },
        {
          name: "Segments ",
          path: "/buckets",
        },
        {
          name: "Campaigns",
          path: "/campaigns",
        },
      ],
    },
    {
      name: "Chatbots",
      icon: 'sms',
      path: "/chat-bot",
      children: [],
    },
    {
      name: "Voicebots",
      icon: 'call',
      path: "/voice-bot",
      children: [],
    },
    // {
    //   name: "Bot Management",
    //   icon: Bot,
    //   path: "/bot-management",
    //   children: [
    //     {
    //       name: "Voice Bot",
    //       path: "/voice-bot",
    //     },
    //     {
    //       name: "Chat Bot",
    //       path: "/chat-bot",
    //     },
    //   ],
    // },
    // {
    //   name: "Whatsapp Bot",
    //   icon: "",
    //   path: "/whatsapp-bot",
    //   children: [],
    // },
    {
      name: "Integrations",
      icon: 'integration_instructions',
      path: "/integration",
      children: [],
    },
    // {
    //   name: "Settings",
    //   icon: SettingsIcon,
    //   path: "/settings",
    //   children: [
    //     {
    //       name: "Integrations",
    //       icon: SettingsIcon,
    //       path: "/integration",
    //     },
    //     // {
    //     //   name: "User Management",
    //     //   icon: SettingsIcon,
    //     //   path: "/user-management",
    //     // },
    //     {
    //       name: "Whatsapp Template",
    //       icon: SettingsIcon,
    //       path: "/whatsapp-template",
    //     },
    //   ],
    // },
    // {
    //   name: "Billing",
    //   icon: WalletIcon,
    //   path: "/billing",
    //   children: [],
    // },
  ]);

  const accordionItems = ref([
    {
      value: "item-1",
      title: "Is it accessible?",
      content: "Yes. It adheres to the WAI-ARIA design pattern.",
    },
    {
      value: "item-2",
      title: "Is it unstyled?",
      content:
        "Yes. It's unstyled by default, giving you freedom over the look and feel.",
    },
    {
      value: "item-3",
      title: "Can it be animated?",
      content:
        "Yes! You can use the transition prop to configure the animation.",
    },
  ]);

  // const dropdownMenuItems = ref([
  //   { label: "General & Profile", path: "/account" },
  //   { label: "Billing & Usages", path: "/billing" },
  //   { label: "Plan", path: "/billing" },
  //   { label: "User Management", path: "/user-management" },
  //   { label: "Wallet", path: "/billing" },
  // ]);
  const dropdownMenuItems = ref([
    { label: "General & Profile", path: { path: "/account", query: { tab: "personal-details" } }, icon: CircleUserIcon },
    { label: "Billing & Usages", path: { path: "/billing", query: { type: "chat" } }, icon: ReceiptIcon },
    { label: "Plan", path: { path: "/billing/view-all", query: { type: "chat" } }, icon: CreditCardIcon },
    { label: "User Management", path: { path: "/user-management" }, icon: SettingsIcon },
    { label: "Wallet", path: { path: "/billing/view-wallet", query: { type: "chat" } }, icon: WalletIcon },
  ]);


  return {
    navigationModules,
    accordionItems,
    dropdownMenuItems,
  };
}
