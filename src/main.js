import "./style.css";
import {
  initI18n,
  translate,
  switchLang,
  currentLang,
  translateDom,
  translateData,
  dynamicLoader,
  SUPPORTED_LANGUAGES,
} from "./i18n/index.js";

// Bootstrap the application once i18n is resolved
initI18n().then((ready) => {
  if (ready) {
    import("./app.js").then((mod) => {
      if (mod.t) mod.t();
    });
  }
});

// Re-export both modern named functions and compatibility aliases
export {
  translate,
  switchLang,
  currentLang,
  translateDom,
  translateData,
  dynamicLoader,
  SUPPORTED_LANGUAGES,
  // Backward compatibility aliases
  translate as a,
  switchLang as i,
  currentLang as n,
  translateDom as o,
  translateData as r,
  dynamicLoader as s,
  SUPPORTED_LANGUAGES as t,
};
