import { createI18n } from "vue-i18n";

export const langs = [
  {
    code: "en",
    name: "EN",
  },
  {
    code: "ru",
    name: "RU",
  },
];

export default createI18n({
  locale: "en",
});
