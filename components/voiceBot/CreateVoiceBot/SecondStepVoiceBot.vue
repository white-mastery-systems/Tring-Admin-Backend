<script setup lang="ts">
import { useField } from "vee-validate";
import { useVoiceLanguageList } from '~/composables/voiceBotLanguageList';


const { languageList } = useVoiceLanguageList();
// ✅ Use `useField()` from vee-validate
const { value: newBotName } = useField("newBotName");
const { value: agentLanguage } = useField("agentLanguage");
const { value: agentName, } = useField("agentName");
</script>

<template>
  <BotSetupCard title="Basic bot details" description="Enter your basic bot details" currentStep="2" totalSteps="6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TextField name="newBotName" label="Voicebot Name" class="text-[12px] sm:text-[12px] md:text-[14px]"
        placeholder="Enter your bot name" v-model="newBotName" />
      <TextField name="agentName" label="Voicebot Agent Name" class="text-[12px] sm:text-[12px] md:text-[14px]"
        placeholder="Enter your voicebot agent name" v-model="agentName" />
      <SelectField name="agentLanguage" :options="languageList" label="Agent Language"
         placeholder="Agent Language" />
      <RegionISOCodeSelect name="region" label="Region" helperText="Enter your region"
        class="text-[12px] sm:text-[12px] md:text-[14px]" />
      <CountryTimeZones name="timezone" label="Time Zones" helperText="Enter your time zones"
        class="text-[12px] sm:text-[12px] md:text-[14px]" />
    </div>
  </BotSetupCard>
</template>