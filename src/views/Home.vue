<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <p>message: {{ $t("hello") }}</p>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home",
  components: {
    // HelloWorld,
  },
};
</script>

<i18n lang="yaml">
en:
  hello: "hello world!"
ru:
  hello: "こんにちは、世界！"
</i18n>
