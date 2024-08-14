<script setup lang="ts">
  import MarkdownIt from "markdown-it";

  // const chatStore = useChatsStore();
  const props = defineProps<{
    content: string;
  }>();
  const regex = /```markdown\n(.*?)```/s;
  const sanitizedMd = computed(() => {
    const matches = regex.exec(props.content);
    if (!matches) return props.content.replaceAll("```", " ");
    return matches[1].trim();
  });

  const md = new MarkdownIt();

  // https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md#renderer
  const defaultRender =
    md.renderer.rules.link_open ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };
  md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
    tokens[idx].attrSet("target", "_blank");
    return defaultRender(tokens, idx, options, env, self);
  };
  //

  const mdContent = computed(() =>
    // md.render(`**${chatStore.agentName}** : ` + sanitizedMd.value),
    md.render(sanitizedMd.value),
  );
</script>

<template>
  <div>
    <div
      class="prose prose-sm prose-headings:my-2 prose-headings:text-sm prose-headings:font-semibold prose-h1:text-[18px] prose-p:my-1 prose-p:leading-5 prose-a:text-blue-800 prose-ul:my-1 prose-li:m-0 prose-th:text-nowrap prose-td:text-center prose-p:font-normal prose-p:text-black"
      v-html="mdContent"
    />
  </div>
</template>
