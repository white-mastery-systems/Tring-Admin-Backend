<script setup lang="ts">
  import { ref, onMounted, watch } from "vue";
  import { Button } from "@/components/ui/button";
  import { Label } from "@/components/ui/label";
  import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet";
  import { Textarea } from "../ui/textarea";

  const props = defineProps<{
    systemPrompt: string;
  }>();

  const emit = defineEmits(["updateVariables"]);

  interface Variable {
    name: string;
    value: string;
  }

  const variables = ref<Variable[]>([]);

  const extractVariables = () => {
    const regex = /\$\{(\w+)\}/g;
    let match;
    const extractedVars: Record<string, Variable> = {};

    while ((match = regex.exec(props.systemPrompt)) !== null) {
      const varName = match[1];

      if (varName !== "CONTEXT") {
        if (!extractedVars[varName]) {
          extractedVars[varName] = { name: varName, value: "" };
        }
      }
    }

    variables.value = Object.values(extractedVars);
  };

  onMounted(extractVariables);
  watch(() => props.systemPrompt, extractVariables);

  const handleSave = () => {
    emit("updateVariables", variables.value);
  };
</script>

<template>
  <Sheet>
    <SheetTrigger as-child>
      <Button
        variant="outline"
        class="button-align h-10 cursor-pointer rounded-md bg-[#424bd1] p-2 text-[14px] font-medium text-white hover:bg-[#424bd1] hover:text-white hover:brightness-90"
      >
        <CurlyButton class="size-5" />
      </Button>
    </SheetTrigger>
    <SheetContent style="max-height: 100vh; overflow-y: auto;">
      <SheetHeader class="mb-4">
        <SheetTitle>Set System Prompt Variables</SheetTitle>
      </SheetHeader>

      <div class="grid gap-4 py-4">
        <div
          v-for="(variable, index) in variables"
          :key="index"
          class="grid grid-cols-1 gap-2 space-y-2"
        >
          <Label :for="`var-${index}`"> {{ variable.name }} </Label>
          <Textarea
            :id="`var-${index}`"
            v-model="variable.value"
            class="focus-visible:ring-offset-0 h-12"
            placeholder="Enter an example value..."
          />
        </div>
      </div>

      <SheetFooter class="mt-4">
        <SheetClose as-child>
          <Button
            type="submit"
            class="button-align h-10 cursor-pointer rounded-md bg-[#424bd1] p-2 text-[14px] font-medium text-white hover:bg-[#424bd1] hover:text-white hover:brightness-90 w-full"
            @click="handleSave"
          >
            Save Variables
          </Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>
