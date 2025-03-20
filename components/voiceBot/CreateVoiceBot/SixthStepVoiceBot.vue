<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue';
import { useField } from 'vee-validate';
// import { useChatbotConfig } from '~/composables/botManagement/chatBot/useChatbotConfig';

const props = defineProps<{
  values: Record<string, any>;
  errors: Record<string, any>;
  disabled: Record<boolean, any>;
  intentOptions: Record<string, any>;
}>();

const emit = defineEmits(["update:values"]);
const { value: selectedGoal } = useField<string>('GOAL');
const { value: type } = useField("type");
const { value: temperature } = useField("temperature")
const { value: provider_stt } = useField("provider_stt")
const { value: provider_tts } = useField("provider_tts")
const { value: max_output_token } = useField("max_output_token")
const { value: otherRole, errorMessage: otherRoleError } = useField("otherRole");
const { value: otherGoal, errorMessage: otherGoalError } = useField("otherGoal");
// const { intentOptions, status, error, fetchConfig } = useChatbotConfig();

// Watch for role selection changes
watch(selectedGoal, (newValue) => {
  if (newValue !== "custom") {
    // Clear otherRole and otherGoal when a non-custom option is selected
    otherRole.value = "";
    otherGoal.value = "";
  }
  emit("update:values", {
    ...props.values,
    ROLE: newValue,
    otherRole: otherRole.value,
    otherGoal: otherGoal.value
  });
});

// Watch for otherRole and otherGoal changes
watch([otherRole, otherGoal], ([newRole, newGoal]) => {
  if (selectedGoal.value === "custom") {
    emit("update:values", {
      ...props.values,
      otherRole: newRole,
      otherGoal: newGoal
    });
  }
});
/*************  ✨ Codeium Command ⭐  *************/
/**
 * @description
 * A function that will be called whenever a provider is selected in the ivrConfig dropdown.
 * It will call the getNumberListApiCall function to get the integrated numbers associated with the selected provider.
 * @param {String} value The value of the selected provider
 * @returns {Promise<void>}
 */
/******  34c362b7-6250-43c2-a715-c927d5c217a8  *******/const onSelectProvider = async (value: any) => {
 await getNumberListApiCall(value)
}

const getNumberListApiCall = async (value: any) => {
  const getNumberList: any = await getIntegratedProviderNumberList(value)
  numberList.value = getNumberList.map((item: any) => ({
    label: item,
    value: item
  }))
}
// watch(() => props.values.type, (newType) => {
//   props.fetchConfig(newType);
// }, { deep: true, immediate: true });
</script>
<template>
    <BotSetupCard 
        title="IVR Setup" 
        description="Set up your IVR system to handle calls automatically and direct callers to the right place" 
        currentStep="6" 
        totalSteps="6">
      <div>
            <div class="grid grid-cols-2 gap-4">
                <SelectField name="ivrConfig" label="Cloud Telephony provider" :closeIcon="true"
                    @input="onSelectProvider($event)" :options="integrationsData"
                    placeholder="Assign a Cloud Telephony provider to the bot." />
                <SelectField name="incomingPhoneNumber" label="Integrated Number" :closeIcon="false" :options="numberList"
                    placeholder="Assign a integrated number to the bot." />
            </div>
       </div>
    </BotSetupCard>
</template>
