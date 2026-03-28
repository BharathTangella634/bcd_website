import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
  .use(HttpApi) // Loads translations from /public/locales
  .use(LanguageDetector) // Detects user's language
  .use(initReactI18next) // Passes i18n instance to react-i18next
  .init({
    // Define the namespaces (your JSON filenames)
    ns: ['consent', 'questionnaire', 'thankyou'],
    defaultNS: 'consent',
    
    // --- THIS IS THE FIX ---
    // Preload all languages. This fetches all JSON files
    // on the initial load, so they are instantly available when
    // you switch components. This prevents the "Loading..." state.
    preload: ['english', 'hindi', 'telugu', 'kannada', 'tamil', 'malayalam', 'bengali', 'marathi', 'gujarati', 'punjabi', 'assamese', 'odia'],
    // --- END FIX ---
    
    fallbackLng: 'english', // Use English if the detected language is missing
    debug: false, // Set to true for console logs

    interpolation: {
      escapeValue: false, // React already protects from XSS
    },

    backend: {
      // Path to your translation files in the 'public' folder
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    // Configuration for the language detector
    detection: {
      order: ['queryString', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['cookie', 'localStorage'], // Remember the user's choice
    },
  });

export default i18n;