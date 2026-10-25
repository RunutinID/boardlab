/**
 * Indonesian Localization Engine for Learn Arduino
 * Configured exclusively for Bahasa Indonesia.
 */

import idDict from "./locales/id.js";

export const SUPPORTED_LANGUAGES = [
  { code: "id", name: "Bahasa Indonesia", short: "Indonesia", locale: "id_ID" },
];

export const currentDict = idDict || {};
export const currentLang = "id";

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

export function setLanguage() {
  // Always Bahasa Indonesia
}

export function getPathLang() {
  return "id";
}

export function getLangUrl() {
  return "/";
}

export function getStoredLang() {
  return "id";
}

export function getBrowserLang() {
  return "id";
}

/**
 * Initialize language: sets HTML to 'id' and translates existing DOM
 */
export async function initI18n() {
  document.documentElement.lang = "id";
  document.documentElement.dir = "ltr";
  if (document.body) {
    translateDom(document.body);
  }
  return true;
}

export function switchLang() {
  // Single-language mode: no-op
}

const TRANSLATABLE_ATTRS = ["aria-label", "title", "alt", "placeholder"];

export function translateDom(root = document.body) {
  if (!root) return;

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

export const dynamicLoader = (fn) => fn();

export {
  translate as a,
  switchLang as i,
  currentLang as n,
  translateDom as o,
  translateData as r,
  dynamicLoader as s,
  SUPPORTED_LANGUAGES as languages,
};
