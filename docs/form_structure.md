The order of the questions is primarily ensured by the `formStructure` array, which is defined in the JSON configuration files and rendered sequentially in the `Questionnaire` component.

### 1. Data Structure (`questionnaire.json`)
The source of truth for the question order is the `formStructure` array found in `questionnaire-app/src/assets/questionnaire.json` (and its localized counterparts in `public/locales/`). This array organizes questions into sections and specifies the sequence of question keys (`Q44`, `Q45`, `Q47`, `Q1`, etc.):

```json
"formStructure": [
  {
    "title": "Section 1: General Information",
    "questions": [
      { "key": "Q44", "type": "text" },
      { "key": "Q45", "type": "text", "placeholder": "Universal" },
      // ... more questions in order
    ]
  }
]
```

### 2. Rendering Logic (`Questionnaire.jsx`)
In `questionnaire-app/src/components/Questionnaire.jsx`, the code iterates over this `formStructure` array using the `.map()` function to render sections and questions in the exact order they appear in the JSON:

*   **Sections:** `formStructure.map((section, index) => ...)` (Line 1788)
*   **Questions:** `section.questions.map((qConfig) => ...)` (Line 1791)

The component also uses a `questionCounter` (initialized at Line 1748 and incremented at Line 1795) to dynamically assign display numbers (e.g., "1.", "2.") based on this iteration order.

### 3. Sub-questions
For conditional questions, the order of sub-questions is managed by the `renderSubQuestions` function (Line 1687), which also uses `.map()` to process the `subQuestions` array defined within a question's configuration in the JSON.

### 4. Integration (`App.jsx`)
The `App.jsx` component (Line 260) retrieves the `formStructure` from the translation files using `i18next` (`t('questionnaire:formStructure', { returnObjects: true })`) and passes it as a prop to the `Questionnaire` component, ensuring that the order remains consistent even when switching languages.