/**
 * i18n Localization Engine for Learn Arduino
 * Handles dynamic locale loading, URL-based routing (/id/, /es/, etc.),
 * DOM text and attribute translation, and persistent language preferences.
 */

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", locale: "en_US" },
  { code: "es", name: "Español", locale: "es_ES" },
  { code: "pt", name: "Português", locale: "pt_BR" },
  { code: "fr", name: "Français", locale: "fr_FR" },
  { code: "de", name: "Deutsch", locale: "de_DE" },
  { code: "it", name: "Italiano", locale: "it_IT" },
  { code: "tr", name: "Türkçe", locale: "tr_TR" },
  { code: "id", name: "Bahasa Indonesia", short: "Indonesia", locale: "id_ID" },
  {
    code: "zh",
    name: "简体中文",
    short: "中文",
    tag: "zh-Hans",
    locale: "zh_CN",
  },
  { code: "ja", name: "日本語", locale: "ja_JP" },
  { code: "ko", name: "한국어", locale: "ko_KR" },
  { code: "hi", name: "हिन्दी", locale: "hi_IN" },
  { code: "he", name: "עברית", dir: "rtl", locale: "he_IL" },
];

export const STORAGE_KEY = "learn-arduino:lang";

export const getLangTag = (code) =>
  SUPPORTED_LANGUAGES.find((lang) => lang.code === code)?.tag ?? code;

export const getLangDir = (code) =>
  SUPPORTED_LANGUAGES.find((lang) => lang.code === code)?.dir ?? "ltr";

export const isValidLang = (code) =>
  SUPPORTED_LANGUAGES.some((lang) => lang.code === code);

export let currentDict = {};
export let currentLang = "en";

/**
 * Translate a text key with optional parameter substitution
 */
export function translate(key, params) {
  let text = currentDict[key] ?? key;
  if (params) {
    text = text.replace(/\{(\w+)\}/g, (_, k) => (k in params ? params[k] : _));
  }
  return text;
}

export const t = translate;

export function setLanguage(lang, dict) {
  currentLang = lang;
  currentDict = dict ?? {};
}

export function getPathLang(pathname = window.location.pathname) {
  const match = pathname.match(/^\/([a-z]{2})(\/|$)/)?.[1];
  return match && match !== "en" && isValidLang(match) ? match : "en";
}

export function getLangUrl(lang) {
  const cleanPath = window.location.pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");
  const base =
    lang === "en"
      ? cleanPath === "/"
        ? "/"
        : cleanPath
      : `/${lang}${cleanPath === "/" ? "/" : cleanPath}`;
  return base + window.location.search + window.location.hash;
}

export function getStoredLang() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isValidLang(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function getBrowserLang() {
  const list = navigator.languages ?? [navigator.language];
  for (const l of list) {
    const prefix = String(l).slice(0, 2).toLowerCase().replace(/^iw$/, "he");
    if (isValidLang(prefix)) return prefix;
  }
  return null;
}

// Vite dynamic glob imports for all locales
const localeModules = import.meta.glob("./locales/*.js");

/**
 * Initialize internationalization based on URL path or browser/stored settings
 */
export async function initI18n() {
  let lang = getPathLang(window.location.pathname);

  // If at root and no language prefix, check stored preference
  if (lang === "en" && window.location.pathname === "/") {
    const pref = getStoredLang() ?? getBrowserLang();
    if (pref && pref !== "en") {
      window.location.replace(getLangUrl(pref));
      return false;
    }
  }

  if (lang !== "en") {
    const loader = localeModules[`./locales/${lang}.js`];
    if (loader) {
      try {
        const mod = await loader();
        setLanguage(lang, mod.default);
      } catch (err) {
        console.warn(`[i18n] Failed to load locale "${lang}":`, err);
        setLanguage("en");
      }
    }
  }

  document.documentElement.lang = getLangTag(currentLang);
  document.documentElement.dir = getLangDir(currentLang);
  return true;
}

/**
 * Switch current language and navigate to the localized route
 */
export function switchLang(lang) {
  if (isValidLang(lang)) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {}
    if (lang !== currentLang) {
      window.location.assign(getLangUrl(lang));
    }
  }
}

const TRANSLATABLE_ATTRS = ["aria-label", "title", "alt", "placeholder"];

/**
 * Traverse DOM tree and translate text nodes and localized attributes
 */
export function translateDom(root) {
  if (currentLang === "en") return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.nodeValue.trim();
    if (text && currentDict[text]) {
      node.nodeValue = node.nodeValue.replace(text, currentDict[text]);
    }
  }

  const selector = TRANSLATABLE_ATTRS.map((a) => `[${a}]`).join(",");
  for (const el of root.querySelectorAll(selector)) {
    for (const attr of TRANSLATABLE_ATTRS) {
      const val = el.getAttribute(attr);
      if (val && currentDict[val]) {
        el.setAttribute(attr, currentDict[val]);
      }
    }
  }
}

const SKIP_KEYS = new Set([
  "id",
  "thumb",
  "sim",
  "anchor",
  "icon",
  "side",
  "approach",
  "key",
  "part",
  "value",
  "type",
  "color",
  "tint",
  "via",
]);

/**
 * Recursively translate object/array lesson metadata and code comments
 */
export function translateData(data, translator = translate, context = "") {
  if (typeof data === "string") {
    return context === "code"
      ? data.replace(
          /\/\/(\s*)(.+)$/gm,
          (_, sp, comment) => `//${sp}${translator(comment.trim())}`,
        )
      : translator(data);
  }
  if (Array.isArray(data)) {
    return data.map((item) => translateData(item, translator, context));
  }
  if (data && typeof data === "object") {
    const result = {};
    for (const [k, v] of Object.entries(data)) {
      result[k] =
        SKIP_KEYS.has(k) || (typeof v !== "string" && typeof v !== "object")
          ? v
          : k === "features"
            ? v.map(([key, val]) => [key, translator(val)])
            : k === "pinout"
              ? v.map(([a, b, c, d]) => [
                  translator(a),
                  translator(b),
                  translator(c),
                  d,
                ])
              : k === "code" && typeof v === "object"
                ? Object.fromEntries(
                    Object.entries(v).map(([codeKey, codeVal]) => [
                      codeKey,
                      translateData(codeVal, translator, "code"),
                    ]),
                  )
                : translateData(v, translator, k);
    }
    return result;
  }
  return data;
}

// Passthrough loader helper
export const dynamicLoader = (fn) => fn();

// Backward compatibility aliases for existing bundled code
export {
  translate as a,
  switchLang as i,
  currentLang as n,
  translateDom as o,
  translateData as r,
  dynamicLoader as s,
  SUPPORTED_LANGUAGES as languages,
};
