

// import React, { useState } from 'react';
// import Consent from './components/Consent';
// import Questionnaire from './components/Questionnaire';
// import ThankYou from './components/ThankYou';
// import './App.css';
// import questionnaireData from './assets/questionnaire.json' with { type: 'json' };

// function App() {
//   const [appState, setAppState] = useState('consent');
//   const [sessionId, setSessionId] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [riskResult, setRiskResult] = useState(null);
//   const [finalFormData, setFinalFormData] = useState(null);

//   // ✅ Use environment variable or fallback to relative URL
//   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

//   // ✅ Helper: wrap fetch to ensure 404s and HTML responses are caught early
//   const safeFetch = async (url, options) => {
//     const res = await fetch(url, options);
//     const text = await res.text();

//     try {
//       return JSON.parse(text);
//     } catch {
//       console.error(`❌ Invalid JSON from ${url}:`, text.slice(0, 200));
//       throw new Error('Invalid JSON received from backend.');
//     }
//   };

//   const handleConsent = async () => {
//     try {
//       const data = await safeFetch(`${API_URL}/api/session/start`, { method: 'POST' });

//       if (data.success && data.sessionId) {
//         console.log(`✅ Session started: ${data.sessionId}`);
//         setSessionId(data.sessionId);
//         setAppState('questionnaire');
//         window.scrollTo(0, 0);
//       } else {
//         alert('⚠️ Could not start a session. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error starting session:', error);
//       alert('❌ Could not connect to the backend API. Check Docker network setup.');
//     }
//   };

//   const handleSubmit = async (formData) => {
//     if (!sessionId) return alert('⚠️ Session ID missing. Cannot submit form.');

//     setIsSubmitting(true);
//     setFinalFormData(formData);

//     try {
//       const result = await safeFetch(`${API_URL}/api/submit`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ sessionId, formData }),
//       });

//       if (result.success) {
//         setRiskResult(result.riskPercentage);
//         setAppState('submitted');
//       } else {
//         alert('⚠️ Error submitting form. Please try again.');
//         setFinalFormData(null);
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       alert('❌ Could not connect to backend to submit form.');
//       setFinalFormData(null);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="app-container">
//       {appState === 'consent' && <Consent onAccept={handleConsent} />}
//       {appState === 'questionnaire' && <Questionnaire onSubmit={handleSubmit} isSubmitting={isSubmitting} />}

//       {appState === 'submitted' && (
//         <ThankYou
//           riskResult={riskResult}
//           formData={finalFormData}
//           questionnaireData={questionnaireData}
//           sessionId={sessionId} // <<<--- ADD THIS PROP ---<<<
//         />
//       )}
//     </div>
//   );
// }

// export default App;





// import React, { useState } from 'react';
// import Consent from './components/Consent';
// import Questionnaire from './components/Questionnaire';
// import ThankYou from './components/ThankYou';
// import './App.css';

// import { useTranslation } from 'react-i18next';

// function App() {
//   const [appState, setAppState] = useState('consent');
//   const [sessionId, setSessionId] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [riskResult, setRiskResult] = useState(null);
//   const [finalFormData, setFinalFormData] = useState(null);


//   const { t_ } = useTranslation(['questionnaire', 'thankyou']); // Use _ as 't' is not directly used here

//   // Get the entire translated objects for the current language
//   // We use the 'i18n.getResourceBundle' method for a stable, non-hook way to get the object
//   // OR, we can just use the 't' hook, which is simpler. Let's use 't'.
//   const { t: tQuestionnaire } = useTranslation('questionnaire');
//   const formStructure = tQuestionnaire('formStructure', { returnObjects: true });
//   const questionnaireData = tQuestionnaire('questions', { returnObjects: true });

//   // ✅ Use environment variable or fallback to relative URL
//   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

//   // ✅ Helper: wrap fetch to ensure 404s and HTML responses are caught early
//   const safeFetch = async (url, options) => {
//     const res = await fetch(url, options);
//     const text = await res.text();

//     try {
//       return JSON.parse(text);
//     } catch {
//       console.error(`❌ Invalid JSON from ${url}:`, text.slice(0, 200));
//       throw new Error('Invalid JSON received from backend.');
//     }
//   };

//   const handleConsent = async () => {
//     try {
//       const data = await safeFetch(`${API_URL}/api/session/start`, { method: 'POST' });

//       if (data.success && data.sessionId) {
//         console.log(`✅ Session started: ${data.sessionId}`);
//         setSessionId(data.sessionId);
//         setAppState('questionnaire');
//         window.scrollTo(0, 0);
//       } else {
//         alert('⚠️ Could not start a session. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error starting session:', error);
//       alert('❌ Could not connect to the backend API. Check Docker network setup.');
//     }
//   };

//   const handleSubmit = async (formData) => {
//     if (!sessionId) return alert('⚠️ Session ID missing. Cannot submit form.');

//     setIsSubmitting(true);
//     setFinalFormData(formData);

//     try {
//       const result = await safeFetch(`${API_URL}/api/submit`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ sessionId, formData }),
//       });

//       if (result.success) {
//         setRiskResult(result.riskPercentage);
//         setAppState('submitted');
//       } else {
//         alert('⚠️ Error submitting form. Please try again.');
//         setFinalFormData(null);
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       alert('❌ Could not connect to backend to submit form.');
//       setFinalFormData(null);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="app-container">
//       {appState === 'consent' && <Consent onAccept={handleConsent} />}
//       {appState === 'questionnaire' && (
//         <Questionnaire 
//           onSubmit={handleSubmit} 
//           isSubmitting={isSubmitting}
//           // Pass the loaded data down
//           formStructure={formStructure}
//           questionnaireData={questionnaireData}
//         />
//       )}
//       {appState === 'submitted' && (
//         <ThankYou 
//           riskResult={riskResult} 
//           formData={finalFormData}
//           // Pass the loaded data down
//           questionnaireData={questionnaireData}
//           sessionId={sessionId}
//           formStructure={formStructure}
//         />
//       )}
//     </div>
//   );
// }

// export default App;


import React, { useState } from 'react';
import Consent from './components/Consent';
import Questionnaire from './components/Questionnaire';
import ThankYou from './components/ThankYou';
import './App.css';
// --- NEW: Import the translation hook ---
import { useTranslation } from 'react-i18next';

import questionnaireDataEng from './assets/questionnaire.json' with { type: 'json' };


function App() {
  const [appState, setAppState] = useState('consent');
  const [sessionId, setSessionId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [riskResult, setRiskResult] = useState(null);
  const [finalFormData, setFinalFormData] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const safeFetch = async (url, options) => {
    const res = await fetch(url, options);
    const text = await res.text();

    try {
      return JSON.parse(text);
    } catch {
      console.error(`❌ Invalid JSON from ${url}:`, text.slice(0, 200));
      throw new Error('Invalid JSON received from backend.');
    }
  };


  // console.log("Current language:", i18n.language);

  // --- MODIFIED: Load translations and get the 'ready' flag ---
  // We specify all namespaces here to ensure they are loaded
  const { t, ready } = useTranslation(['consent', 'questionnaire', 'thankyou']);

  // Get the entire translated objects for the current language
  // We use the 't' function with the namespace prefix
  const formStructure = t('questionnaire:formStructure', { returnObjects: true });
  const questionnaireData = t('questionnaire:questions', { returnObjects: true });
  const questionnaireDataEn = questionnaireDataEng.questions;
  const formStructureEn = questionnaireDataEng.formStructure;
  
  // --- END MODIFICATION ---

  const { i18n } = useTranslation();


  const handleConsent = async () => {
    try {
      const data = await safeFetch(`${API_URL}/api/session/start`, { method: 'POST' });
      
      if (data.success && data.sessionId) {
        setSessionId(data.sessionId);
        setAppState('questionnaire');
        window.scrollTo(0, 0);
      } else {
        alert(t('consent:errors.sessionStart', 'Could not start a session. Please try again.'));
      }
    } catch (error) {
      console.error('Error starting session:', error);
      alert(t('consent:errors.sessionConnect', 'Could not connect to the server to start a session.'));
    }
  };

  const handleSubmit = async (formData, formDataEn) => {
    if (!sessionId) {
      alert('Session ID is missing. Cannot submit form.');
      return;
    }
    formDataEn = { ...formDataEn };
    if (!formDataEn.Q46) {
        formDataEn.Q46 = i18n.language;
    }
    // console.log('Final data to submit (English):', formDataEn);     

    
    setIsSubmitting(true);
    setFinalFormData(formDataEn); // Store the final data for the PDF
    // console.log('Submitting Form Data:', { formData, formDataEn });

    try {
      const result = await safeFetch(`${API_URL}/api/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, formDataEn }),
      });
      console.log('Submission Result:', result);

      if (result.success) {
        setRiskResult(result.riskPercentage);
        setAppState('submitted');
      } else {
        alert(t('questionnaire:ui.errors.validationAlert')); // Use translated error
        setFinalFormData(null);
      }
    } catch (error) {
      alert('Could not connect to the server to submit the form.'); // Generic error
      setFinalFormData(null);
    } finally {
      setIsSubmitting(false);
    }
  };


  if (!ready) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
        Loading Application...
      </div>
    );
  }
  // --- END NEW LOADING CHECK ---

  // --- Pass data down as props ---
  return (
    <div className="app-container">
      {appState === 'consent' && <Consent onAccept={handleConsent} />}
      {appState === 'questionnaire' && (
        <Questionnaire 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting}
          // Pass the loaded data down
          formStructure={formStructure}
          questionnaireData={questionnaireData}
          questionnaireDataEn={questionnaireDataEn}
        />
      )}
      {appState === 'submitted' && (
        <ThankYou 
          riskResult={riskResult} 
          formData={finalFormData}
          sessionId={sessionId}
          // Pass the loaded data down
          formStructure={formStructureEn}
          questionnaireData={questionnaireDataEn}
        />
      )}
    </div>
  );
}

export default App;