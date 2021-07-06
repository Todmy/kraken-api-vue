<template>
  <select v-model="$i18n.locale">
    <option v-for="lang in languages" :key="lang.message" :value="lang.code">
      {{ lang.name }}
    </option>
  </select>
</template>

<script>
import { langs } from "../localization";

export default {
  data: () => ({
    languages: langs,
  }),
};
</script>
