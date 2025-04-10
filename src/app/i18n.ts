'use client';

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { readdirSync } from 'fs';
import path from 'path';

// Tạo object resources động từ tất cả các thư mục trong locales
const resources = {
  en: {
    common: require('../../public/locales/en/common.json'),
  },
  vi: {
    common: require('../../public/locales/vi/common.json'),
  },
  ko: {
    common: require('../../public/locales/ko/common.json'),
  },
  'zh-cn': {
    common: require('../../public/locales/zh-cn/common.json'),
  },
  'zh-tw': {
    common: require('../../public/locales/zh-tw/common.json'),
  },
  ja: {
    common: require('../../public/locales/ja/common.json'),
  },
  fr: {
    common: require('../../public/locales/fr/common.json'),
  },
  de: {
    common: require('../../public/locales/de/common.json'),
  },
  es: {
    common: require('../../public/locales/es/common.json'),
  },
  ru: {
    common: require('../../public/locales/ru/common.json'),
  },
  pt: {
    common: require('../../public/locales/pt/common.json'),
  },
  it: {
    common: require('../../public/locales/it/common.json'),
  },
  ar: {
    common: require('../../public/locales/ar/common.json'),
  },
  th: {
    common: require('../../public/locales/th/common.json'),
  },
  id: {
    common: require('../../public/locales/id/common.json'),
  },
  ms: {
    common: require('../../public/locales/ms/common.json'),
  },
  nl: {
    common: require('../../public/locales/nl/common.json'),
  },
  pl: {
    common: require('../../public/locales/pl/common.json'),
  },
  tr: {
    common: require('../../public/locales/tr/common.json'),
  },
  uk: {
    common: require('../../public/locales/uk/common.json'),
  },
  cs: {
    common: require('../../public/locales/cs/common.json'),
  },
  sv: {
    common: require('../../public/locales/sv/common.json'),
  },
  no: {
    common: require('../../public/locales/no/common.json'),
  },
  fi: {
    common: require('../../public/locales/fi/common.json'),
  },
  da: {
    common: require('../../public/locales/da/common.json'),
  },
  el: {
    common: require('../../public/locales/el/common.json'),
  },
  hu: {
    common: require('../../public/locales/hu/common.json'),
  },
  ro: {
    common: require('../../public/locales/ro/common.json'),
  },
  sk: {
    common: require('../../public/locales/sk/common.json'),
  },
  bg: {
    common: require('../../public/locales/bg/common.json'),
  },
  ca: {
    common: require('../../public/locales/ca/common.json'),
  },
  hr: {
    common: require('../../public/locales/hr/common.json'),
  },
  sr: {
    common: require('../../public/locales/sr/common.json'),
  },
  sl: {
    common: require('../../public/locales/sl/common.json'),
  },
  lt: {
    common: require('../../public/locales/lt/common.json'),
  },
  lv: {
    common: require('../../public/locales/lv/common.json'),
  },
  et: {
    common: require('../../public/locales/et/common.json'),
  },
  hi: {
    common: require('../../public/locales/hi/common.json'),
  },
  bn: {
    common: require('../../public/locales/bn/common.json'),
  },
  ta: {
    common: require('../../public/locales/ta/common.json'),
  },
  te: {
    common: require('../../public/locales/te/common.json'),
  },
  mr: {
    common: require('../../public/locales/mr/common.json'),
  },
  ur: {
    common: require('../../public/locales/ur/common.json'),
  },
  fa: {
    common: require('../../public/locales/fa/common.json'),
  },
  he: {
    common: require('../../public/locales/he/common.json'),
  },
  ps: {
    common: require('../../public/locales/ps/common.json'),
  },
  sw: {
    common: require('../../public/locales/sw/common.json'),
  },
  am: {
    common: require('../../public/locales/am/common.json'),
  },
  km: {
    common: require('../../public/locales/km/common.json'),
  },
  lo: {
    common: require('../../public/locales/lo/common.json'),
  },
  my: {
    common: require('../../public/locales/my/common.json'),
  },
  ne: {
    common: require('../../public/locales/ne/common.json'),
  },
  si: {
    common: require('../../public/locales/si/common.json'),
  },
  ka: {
    common: require('../../public/locales/ka/common.json'),
  },
  hy: {
    common: require('../../public/locales/hy/common.json'),
  },
  az: {
    common: require('../../public/locales/az/common.json'),
  },
  kk: {
    common: require('../../public/locales/kk/common.json'),
  },
  uz: {
    common: require('../../public/locales/uz/common.json'),
  },
  tg: {
    common: require('../../public/locales/tg/common.json'),
  },
  ky: {
    common: require('../../public/locales/ky/common.json'),
  },
  tk: {
    common: require('../../public/locales/tk/common.json'),
  },
  mn: {
    common: require('../../public/locales/mn/common.json'),
  },
  af: {
    common: require('../../public/locales/af/common.json'),
  },
  zu: {
    common: require('../../public/locales/zu/common.json'),
  },
  xh: {
    common: require('../../public/locales/xh/common.json'),
  },
  so: {
    common: require('../../public/locales/so/common.json'),
  },
  ha: {
    common: require('../../public/locales/ha/common.json'),
  },
  yo: {
    common: require('../../public/locales/yo/common.json'),
  },
  ig: {
    common: require('../../public/locales/ig/common.json'),
  },
  is: {
    common: require('../../public/locales/is/common.json'),
  },
  ga: {
    common: require('../../public/locales/ga/common.json'),
  },
  cy: {
    common: require('../../public/locales/cy/common.json'),
  },
  gl: {
    common: require('../../public/locales/gl/common.json'),
  },
  eu: {
    common: require('../../public/locales/eu/common.json'),
  },
  mt: {
    common: require('../../public/locales/mt/common.json'),
  },
  la: {
    common: require('../../public/locales/la/common.json'),
  }
};

// Tạo mảng supportedLngs từ các khóa của resources
const supportedLngs = Object.keys(resources);

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: 'en', // Đổi ngôn ngữ mặc định thành tiếng Anh
    ns: ['common'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    react: {
      useSuspense: false,
    },
    supportedLngs, // Sử dụng mảng đã tạo
    nonExplicitSupportedLngs: false,
  });

export default i18n;