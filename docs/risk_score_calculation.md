The risk score (specifically the "Snehitha Risk Score") is calculated on the backend in the file `questionnaire-app/backend/server.js`.

### Key Details:
- **Function**: `calculateSnehithaRisk(formData)` (starting on line 25)
- **Logic**: It uses a logistic regression formula to calculate a risk percentage based on user answers.
- **Formula**:
  ```javascript
  const logitP = -0.940 +
      (0.027 * age) -
      (0.082 * ageAtMenarche) +
      (0.453 * irregularCycles) -
      (0.892 * breastfeeding24M) +
      (0.810 * firstDegreeRelatives) +
      (1.420 * previousBiopsy) +
      (0.811 * ageAtFirstLiveBirth2529OrNullipara) +
      (1.035 * ageAtFirstLiveBirth30OrMore);

  const probability = 1 / (1 + Math.exp(-logitP));
  const riskPercentage = (probability * 100).toFixed(2);
  ```
- **Trigger**: It is called within the `/api/submit` endpoint (line 121) when a user submits their questionnaire data.

The calculated `riskPercentage` is then returned to the frontend and displayed in the `ThankYou.jsx` component.