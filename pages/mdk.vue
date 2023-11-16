<template>
  <div class="w-[1200px]">
    <v-md-editor
      v-model="text"
      height="400px" />
  </div>
</template>

<script setup lang="ts">
  import VMdEditor from '@kangc/v-md-editor';
  import '@kangc/v-md-editor/lib/style/base-editor.css';
  import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
  import '@kangc/v-md-editor/lib/theme/style/github.css';

  // highlightjs
  import hljs from 'highlight.js';

  VMdEditor.use(githubTheme, {
    Hljs: hljs,
  });

  const text = ref('test123');
</script>

<style scoped></style>
