


// after adding questions


// import React, { useState, useEffect } from 'react'; // Added useEffect
// import './Questionnaire.css';
// import questionnaireData from '../assets/questionnaire.json' with { type: 'json' };

// // Your formStructure - Removed invalid placeholder reference for Q44
// export const formStructure = [
//   {
//     title: "Section 1: General Information",
//     questions: [
//       // --- FIX: Removed placeholder that uses state from here ---
//       { key: "Q44", type: "text" }, // Placeholder handled in renderInput
//       { key: "Q45", type: "text", placeholder: "Universal" },
//       // --- END FIX ---
//       { key: "Q1", type: "number", placeholder: "e.g., 35", required: true },
//       { key: "Q2", type: "number", placeholder: "e.g., 165", required: true },
//       { key: "Q3", type: "number", placeholder: "e.g., 60", required: true },
//       { key: "Q4", type: "select", required: true },
//       { key: "Q5", type: "radio", required: true },
//       { key: "Q6", type: "radio", required: true },
//       { key: "Q7", type: "radio", required: true },
//       { key: "Q8", type: "radio", required: true },
//       { key: "Q9", type: "radio", required: true, condition: { key: "Q9", value: "Yes" }, subQuestions: [
//           { key: "Q10", type: "number", placeholder: "Please enter a number - years", required: true },
//           { key: "Q11", type: "radio", required: true },
//           { key: "Q12", type: "radio", required: true }
//       ]},
//       { key: "Q13", type: "radio" }, // Not required
//       { key: "Q14", type: "radio", required: true, condition: { key: "Q14", value: "Yes" }, subQuestions: [
//           { key: "Q15", type: "number", placeholder: "Please enter a number", required: true },
//           { key: "Q16", type: "radio", required: true },
//           { key: "Q17", type: "radio", required: true }
//       ]},
//       { key: "Q18", type: "radio", required: true },
//       { key: "Q19", type: "radio", required: true },
//       { key: "Q20", type: "radio", condition: { key: "Q20", value: "Yes" }, subQuestions: [
//           { key: "Q21", type: "radio", required: true },
//           { key: "Q22", type: "number", placeholder: "e.g., 45", required: true },
//           { key: "Q23", type: "checkbox", required: true },
//           { key: "Q24", type: "radio", condition: { key: "Q24", value: "No" }, subQuestions: [
//               { key: "Q25", type: "number", placeholder: "Enter age of death" } // Not required
//           ]},
//           { key: "Q26", type: "select", required: true }
//       ]},
//     ]
//   },
//   {
//     title: "Section 2: Breast Examination (BE)",
//     questions: [
//         { 
//           key: "Q27", // Have you ever undergone BE?
//           type: "radio", 
//           condition: {key: "Q27", value: "Yes"}, // Condition for sub-questions
//           videoUrlOnNo: "https://www.youtube.com/embed/wI71TXaoMp8?autoplay=1&rel=0&start=0", 
//           subQuestions: [ // Sub-questions for "Yes"
//             { key: "Q28", type: "radio" }, // When was last BE?
//             { key: "Q29", type: "radio" }, // What was result?
//              // --- Q36 MOVED HERE as a sub-question ---
//             { 
//               key: "Q36", // After BE, advised follow-up?
//               type: "radio", 
//               condition: {key: "Q36", value: "Yes"}, // Condition for ITS sub-question (Q37)
//               subQuestions: [
//                 { key: "Q37", type: "checkbox" }, // If Yes, specify follow-up
//               ]
//             },
//           ]
//         },
//         { 
//           key: "Q30", // During BE, lump detected?
//           type: "radio", 
//           condition: {key: "Q30", value: "Yes"}, 
//           subQuestions: [
//             { key: "Q31", type: "radio" }, // Location
//             { key: "Q32", type: "radio" }, // Size
//             { key: "Q33", type: "radio" }, // Consistency
//           ]
//         },
//         { 
//           key: "Q34", // Pain during exam?
//           type: "radio", 
//           condition: {key: "Q34", value: "Yes"}, 
//           subQuestions: [
//             { key: "Q35", type: "radio" }, // Localized or generalized?
//           ]
//         },
//     ]
//   },
//   {
//     title: "Section 3: Beyond BE",
//     questions: [
//         { key: "Q38", type: "radio", condition: {key: "Q38", value: "Yes"}, subQuestions: [
//             { key: "Q39", type: "radio", required: true }
//         ]},
//         { key: "Q40", type: "radio", required: true, condition: {key: "Q40", value: "Yes"}, subQuestions: [
//             { key: "Q41", type: "radio" },
//         ]},
//         { key: "Q42", type: "radio", required: true, condition: {key: "Q42", value: "Yes"}, subQuestions: [
//             { key: "Q43", type: "checkbox-plus-text", otherOptionId: "q43_other_specify", otherPlaceholder: "Specify other cancer", required: true },
//         ]},
//     ]
//   }
// ];

// // Helper function to generate random string
// const generateRandomId = (length = 8) => {
//   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   let result = '';
//   for (let i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() * characters.length));
//   }
//   return result;
// };


// function Questionnaire({ onSubmit, isSubmitting }) {
//   const [formData, setFormData] = useState({});
//   const [validationErrors, setValidationErrors] = useState([]);
//   const [progress, setProgress] = useState(0);
//   const [showQ27VideoPrompt, setShowQ27VideoPrompt] = useState(false); 
//   const [q27VideoConfirmed, setQ27VideoConfirmed] = useState(false);
//   const [randomPatientId, setRandomPatientId] = useState('');
  

//   useEffect(() => {
//     // Generate the random ID only once when the component mounts
//     setRandomPatientId(generateRandomId());
//   }, []); 
  
//   // --- Progress calculation useEffect - UNCHANGED ---
//   const getVisibleQuestionKeys = (currentFormData) => {
//     const visibleKeys = new Set();
//     const traverse = (questions) => {
//         questions.forEach(q => {
//             const qKey = q.name || q.key;
//             visibleKeys.add(qKey); 
//             if (q.otherOptionId) {
//                  visibleKeys.add(q.otherOptionId);
//             }
//             if (q.subQuestions && q.condition && currentFormData[q.condition.key] === q.condition.value) {
//                 traverse(q.subQuestions);
//             }
//         });
//     };
//     formStructure.forEach(section => traverse(section.questions));
//     return visibleKeys;
//   };

//   const countAnsweredVisibleQuestions = (currentFormData, visibleKeysSet) => {
//       let answeredCount = 0;
//       visibleKeysSet.forEach(key => {
//           const value = currentFormData[key];
//           if (value !== undefined && value !== null && value !== '' && (!Array.isArray(value) || value.length > 0)) {
//               answeredCount++;
//           }
//       });
//       return answeredCount;
//   };

//   useEffect(() => {
//       const visibleKeysSet = getVisibleQuestionKeys(formData);
//       const answeredCount = countAnsweredVisibleQuestions(formData, visibleKeysSet);
//       const totalVisible = visibleKeysSet.size;
//       const newProgress = totalVisible > 0 ? Math.round((answeredCount / totalVisible) * 100) : 0;
//       setProgress(Math.min(newProgress, 100)); 
//   }, [formData]);

//   // --- handleChange - UNCHANGED ---
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     if (name === 'Q27') {
//       if (value === 'No') {
//         setShowQ27VideoPrompt(true); 
//         setQ27VideoConfirmed(false); 
//       } else {
//         setShowQ27VideoPrompt(false); 
//         setQ27VideoConfirmed(false); 
//       }
//     }
//     if (type === 'checkbox') {
//         const currentValues = formData[name] || [];
//         const newValues = checked ? [...currentValues, value] : currentValues.filter(v => v !== value);
//         setFormData(prev => ({ ...prev, [name]: newValues }));
//     } else {
//         setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   // --- getVisibleRequiredQuestions - UNCHANGED ---
//   const getVisibleRequiredQuestions = () => {
//     let visibleRequired = [];
//     const traverseQuestions = (questions) => {
//         for (const q of questions) {
//             if (q.required) {
//                 visibleRequired.push(q.name || q.key);
//             }
//              if (q.subQuestions && q.condition && formData[q.condition.key] === q.condition.value) {
//                 traverseQuestions(q.subQuestions);
//             }
//         }
//     };
//     formStructure.forEach(section => traverseQuestions(section.questions));
//     return visibleRequired;
//   };
  
//   // --- handleSubmit (with default value logic) - UNCHANGED ---
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setValidationErrors([]);

//     const dataToSubmit = { ...formData };

//     if (!dataToSubmit.Q44) {
//         dataToSubmit.Q44 = randomPatientId;
//     }
//     if (!dataToSubmit.Q45) {
//         dataToSubmit.Q45 = "Universal";
//     }
//     const visibleRequiredKeys = getVisibleRequiredQuestions();
//     const missingFields = visibleRequiredKeys.filter(key => {
//         const value = dataToSubmit[key];
//         return value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);
//     });

//     if (missingFields.length > 0) {
//         setValidationErrors(missingFields);
//         alert("Please fill out all required fields marked with *.");
//         const firstErrorKey = missingFields[0];
//         const errorElement = document.querySelector(`[name="${firstErrorKey}"]`);
//         if (errorElement) {
//             errorElement.closest('.question-block').scrollIntoView({ behavior: 'smooth', block: 'center' });
//         }
//         return;
//     }

//     onSubmit(dataToSubmit);
//   };

//   // --- renderInput function - CORRECTED placeholder logic ---
//   const renderInput = (qConfig) => { // Removed second argument
//     const data = questionnaireData[qConfig.key];
//     if (!data) return <p>Error: Question {qConfig.key} not found in JSON.</p>;
//     const name = qConfig.name || qConfig.key;

//     // Determine the placeholder dynamically INSIDE the function
//     let placeholder = qConfig.placeholder || '';
//     if (qConfig.key === 'Q44') {
//         // Correctly access the state variable 'randomPatientId' here
//         placeholder = randomPatientId; 
//     }

//     if (data.answers.length === 0) {
//       // Use the dynamically determined placeholder
//       return <input type={qConfig.type || 'text'} name={name} placeholder={placeholder} onChange={handleChange} className="text-input" />;
//     }
//     // ... rest of renderInput switch statement remains UNCHANGED ...
//     switch (qConfig.type) {
//        case 'select':
//          return (
//            <select name={name} onChange={handleChange} defaultValue="" className="select-input">
//              <option value="" disabled>Select an option</option>
//              {data.answers.map((ans, i) => <option key={i} value={ans}>{ans}</option>)}
//            </select>
//          );
//        case 'checkbox':
//          return (
//            <div className="checkbox-group vertical">
//              {data.answers.map((ans, i) => (
//                <label key={i}><input type="checkbox" name={name} value={ans} onChange={handleChange} /> {ans}</label>
//              ))}
//            </div>
//          );
//        case 'checkbox-plus-text':
//           return (
//               <div className="checkbox-group vertical">
//                  {data.answers.map((ans, i) => (
//                      <label key={i}><input type="checkbox" name={name} value={ans} onChange={handleChange} /> {ans}</label>
//                  ))}
//                   <input type="text" name={qConfig.otherOptionId} placeholder={qConfig.otherPlaceholder || 'Specify other'} onChange={handleChange} className="text-input" />
//               </div>
//           );
//        case 'radio':
//        default:
//          return (
//            <div className="radio-group vertical">
//              {data.answers.map((ans, i) => (
//                <label key={i}><input type="radio" name={name} value={ans} onChange={handleChange} /> {ans}</label>
//              ))}
//            </div>
//          );
//     }
//   };

//   // --- renderSubQuestions function - UNCHANGED ---
//   const renderSubQuestions = (subQuestions, parentNumber) => {
//     return subQuestions.map((subQConfig, index) => {
//       const subQData = questionnaireData[subQConfig.key];
//       if (!subQData) return null;
//       const subQName = subQConfig.name || subQConfig.key;
//       const displayNumber = `${parentNumber}${String.fromCharCode(97 + index)}.`; 
//       return (
//         <React.Fragment key={subQName}>
//           <div className={`question-block ${validationErrors.includes(subQName) ? 'error' : ''}`}>
//             <label>
//                 {displayNumber} {subQData.question}
//                 {subQConfig.required && <span className="required-asterisk">*</span>}
//             </label>
//             {/* Call renderInput without the second argument here */}
//             {renderInput(subQConfig)} 
//           </div>
//           {subQConfig.subQuestions && (
//             <div className={`sub-question-container ${formData[subQName] === subQConfig.condition.value ? 'visible' : ''}`}>
//               {renderSubQuestions(subQConfig.subQuestions, displayNumber.slice(0,-1))} 
//             </div>
//           )}
//         </React.Fragment>
//       );
//     });
//   };

//   let questionCounter = 0;

//   // --- Main return JSX - UNCHANGED ---
//   return (
//     <>
//       <div className="progress-bar-container">

//         <div className="progress-bar-label">Progress: {progress}%</div>
//         <div className="progress-bar-track">
//           <div 
//             className="progress-bar-fill" 
//             style={{ width: `${progress}%` }} 
//           ></div>
//         </div>
//       </div>

//       <form className="questionnaire-container" onSubmit={handleSubmit} noValidate>


//         <img src="/tanuh.png" alt="TANUH Logo" className="logo tanuh-logo" />
//         <img src="/IISc_logo.png" alt="IISC Logo" className="logo iisc-logo" />

//         <div className="form-header">
//           <h1>Breast Cancer Risk Questionnaire</h1>
//           <p style={{ color: "#533b42ff", fontSize: "18px", marginTop: "8px" }}>Please answer the following questions to the best of your ability.</p>
//           <p style={{ color: "#533b42ff", fontSize: "15px", marginTop: "8px" }}>
//             Fields marked with <span style={{ color: "#d93025", fontWeight: 600 }}>*</span> are mandatory.
//           </p>
//         </div>
//         {formStructure.map((section, index) => (
//           <div key={index} className="form-section">
//             <h2>{section.title}</h2>
//             {section.questions.map((qConfig) => {
//               const data = questionnaireData[qConfig.key];
//               if (!data) return null;
//               questionCounter++;
//               const displayNumber = `${questionCounter}.`;
//               const name = qConfig.name || qConfig.key;
//               const isQ27No = qConfig.key === "Q27" && formData[name] === "No";
//               const showSubquestions = qConfig.subQuestions && qConfig.condition && formData[qConfig.condition.key] === qConfig.condition.value;

//               return (
//                 <React.Fragment key={name}>
//                   <div className={`question-block ${validationErrors.includes(name) ? 'error' : ''}`}>
//                     <label>
//                         {displayNumber} {data.question}
//                         {qConfig.required && <span className="required-asterisk">*</span>}
//                     </label>
//                     {/* Call renderInput without the second argument here */}
//                     {renderInput(qConfig)} 
//                   </div>
//                   {qConfig.subQuestions && (
//                     <div className={`sub-question-container ${showSubquestions ? 'visible' : ''}`}>
//                       {renderSubQuestions(qConfig.subQuestions, questionCounter)}
//                     </div>
//                   )}
//                    {qConfig.key === "Q27" && formData['Q27'] === "No" && (
//                      <>
//                        {!q27VideoConfirmed && showQ27VideoPrompt && (
//                          <div className="video-prompt-container">
//                            <p className="video-prompt-note">
//                              Please follow the instructions in the video to perform self examination. It has to be performed in privacy in a room with a mirror. Click okay when you are ready.
//                            </p>
//                            <button
//                              type="button"
//                              className="video-prompt-button"
//                              onClick={() => setQ27VideoConfirmed(true)} 
//                            >
//                              Okay
//                            </button>
//                          </div>
//                        )}
//                        {q27VideoConfirmed && qConfig.videoUrlOnNo && (
//                          <div className="youtube-player-container">
//                              <iframe width="560" height="315" src={qConfig.videoUrlOnNo} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
//                          </div>
//                        )}
//                      </>
//                    )}
//                 </React.Fragment>
//               );
//             })}
//           </div>
//         ))}
//         <div className="submit-button-container">
//           {isSubmitting ? (
//             <button type="button" className="submit-button loading" disabled>
//               <span className="loading-dots">
//                 <span></span><span></span><span></span>
//               </span>
//               Submitting...
//             </button>
//           ) : (
//             <button type="submit" className="submit-button">
//               Submit Questionnaire
//             </button>
//           )}
//         </div>
//       </form>
//     </>
//   );
// }

// export default Questionnaire;



// before translation


// // from json file
// import React, { useState, useEffect } from 'react';
// import './Questionnaire.css';
// // --- MODIFICATION: Import the entire new JSON structure ---
// import questionnaireJson from '../assets/questionnaire.json' with { type: 'json' };

// // --- MODIFICATION: Destructure the JSON and EXPORT formStructure ---
// // This defines 'questionnaireData' exactly as your old code expected
// const questionnaireData = questionnaireJson.questions; 
// // This EXPORTS 'formStructure' so other files (like ThankYou.jsx) can import it
// export const formStructure = questionnaireJson.formStructure;
// // This creates a new 'ui' object for all the text
// const ui = questionnaireJson.ui;

// // --- REMOVED: The large 'export const formStructure = [...]' array is no longer here ---


// // Helper function to generate random string (Unchanged)
// const generateRandomId = (length = 8) => {
//   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   let result = '';
//   for (let i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() * characters.length));
//   }
//   return result;
// };


// function Questionnaire({ onSubmit, isSubmitting }) {
//   const [formData, setFormData] = useState({});
//   const [validationErrors, setValidationErrors] = useState([]);
//   const [progress, setProgress] = useState(0);
//   const [showQ27VideoPrompt, setShowQ27VideoPrompt] = useState(false);  
//   const [q27VideoConfirmed, setQ27VideoConfirmed] = useState(false);
//   const [randomPatientId, setRandomPatientId] = useState('');
  

//   useEffect(() => {
//     // Generate the random ID only once when the component mounts
//     setRandomPatientId(generateRandomId());
//   }, []); 
  
//   // --- Progress calculation useEffect - (Unchanged, uses exported formStructure) ---
//   const getVisibleQuestionKeys = (currentFormData) => {
//     const visibleKeys = new Set();
//     const traverse = (questions) => {
//         questions.forEach(q => {
//             const qKey = q.name || q.key;
//             visibleKeys.add(qKey);  
//             if (q.otherOptionId) {
//                 visibleKeys.add(q.otherOptionId);
//             }
//             if (q.subQuestions && q.condition && currentFormData[q.condition.key] === q.condition.value) {
//                 traverse(q.subQuestions);
//             }
//         });
//     };
//     formStructure.forEach(section => traverse(section.questions));
//     return visibleKeys;
//   };

//   const countAnsweredVisibleQuestions = (currentFormData, visibleKeysSet) => {
//       let answeredCount = 0;
//       visibleKeysSet.forEach(key => {
//           const value = currentFormData[key];
//           if (value !== undefined && value !== null && value !== '' && (!Array.isArray(value) || value.length > 0)) {
//               answeredCount++;
//           }
//       });
//       return answeredCount;
//   };

//   useEffect(() => {
//       const visibleKeysSet = getVisibleQuestionKeys(formData);
//       const answeredCount = countAnsweredVisibleQuestions(formData, visibleKeysSet);
//       const totalVisible = visibleKeysSet.size;
//       const newProgress = totalVisible > 0 ? Math.round((answeredCount / totalVisible) * 100) : 0;
//       setProgress(Math.min(newProgress, 100));  
//   }, [formData]);

//   // --- handleChange - (Unchanged) ---
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     if (name === 'Q27') {
//       if (value === 'No') {
//         setShowQ27VideoPrompt(true);  
//         setQ27VideoConfirmed(false);  
//       } else {
//         setShowQ27VideoPrompt(false);  
//         setQ27VideoConfirmed(false);  
//       }
//     }
//     if (type === 'checkbox') {
//         const currentValues = formData[name] || [];
//         const newValues = checked ? [...currentValues, value] : currentValues.filter(v => v !== value);
//         setFormData(prev => ({ ...prev, [name]: newValues }));
//     } else {
//         setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   // --- getVisibleRequiredQuestions - (Unchanged, uses exported formStructure) ---
//   const getVisibleRequiredQuestions = () => {
//     let visibleRequired = [];
//     const traverseQuestions = (questions) => {
//         for (const q of questions) {
//             if (q.required) {
//                 visibleRequired.push(q.name || q.key);
//             }
//             if (q.subQuestions && q.condition && formData[q.condition.key] === q.condition.value) {
//                 traverseQuestions(q.subQuestions);
//             }
//         }
//     };
//     formStructure.forEach(section => traverseQuestions(section.questions));
//     return visibleRequired;
//   };
  
//   // --- handleSubmit (with default value logic) - (MODIFIED for UI text) ---
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setValidationErrors([]);

//     const dataToSubmit = { ...formData };

//     if (!dataToSubmit.Q44) {
//         dataToSubmit.Q44 = randomPatientId;
//     }
//     if (!dataToSubmit.Q45) {
//         // --- MODIFIED: Uses default from JSON ---
//         dataToSubmit.Q45 = ui.defaults.q45; 
//     }
//     const visibleRequiredKeys = getVisibleRequiredQuestions();
//     const missingFields = visibleRequiredKeys.filter(key => {
//         const value = dataToSubmit[key];
//         return value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);
//     });

//     if (missingFields.length > 0) {
//         setValidationErrors(missingFields);
//         // --- MODIFIED: Uses error message from JSON ---
//         alert(ui.errors.validationAlert);
//         const firstErrorKey = missingFields[0];
//         const errorElement = document.querySelector(`[name="${firstErrorKey}"]`);
//         if (errorElement) {
//             errorElement.closest('.question-block').scrollIntoView({ behavior: 'smooth', block: 'center' });
//         }
//         return;
//     }

//     onSubmit(dataToSubmit);
//   };

//   // --- renderInput function - (MODIFIED for UI text) ---
//   const renderInput = (qConfig) => { 
//     // 'questionnaireData' is already defined from the JSON import
//     const data = questionnaireData[qConfig.key]; 
//     if (!data) {
//         // --- MODIFIED: Uses error message from JSON ---
//         return <p>{ui.errors.questionNotFound.replace('{key}', qConfig.key)}</p>;
//     }
//     const name = qConfig.name || qConfig.key;

//     let placeholder = qConfig.placeholder || '';
//     if (qConfig.key === 'Q44') {
//         placeholder = randomPatientId;  
//     }

//     if (data.answers.length === 0) {
//       return <input type={qConfig.type || 'text'} name={name} placeholder={placeholder} onChange={handleChange} className="text-input" />;
//     }
    
//     switch (qConfig.type) {
//         case 'select':
//           return (
//             <select name={name} onChange={handleChange} defaultValue="" className="select-input">
//               {/* --- MODIFIED: Uses text from JSON --- */}
//               <option value="" disabled>{ui.inputs.selectDefault}</option>
//               {data.answers.map((ans, i) => <option key={i} value={ans}>{ans}</option>)}
//             </select>
//           );
//         // (No changes to checkbox, checkbox-plus-text, or radio cases)
//         case 'checkbox':
//           return (
//             <div className="checkbox-group vertical">
//               {data.answers.map((ans, i) => (
//                 <label key={i}><input type="checkbox" name={name} value={ans} onChange={handleChange} /> {ans}</label>
//               ))}
//             </div>
//           );
//         case 'checkbox-plus-text':
//           return (
//             <div className="checkbox-group vertical">
//                 {data.answers.map((ans, i) => (
//                     <label key={i}><input type="checkbox" name={name} value={ans} onChange={handleChange} /> {ans}</label>
//                 ))}
//                 <input type="text" name={qConfig.otherOptionId} placeholder={qConfig.otherPlaceholder || 'Specify other'} onChange={handleChange} className="text-input" />
//             </div>
//           );
//         case 'radio':
//         default:
//           return (
//             <div className="radio-group vertical">
//               {data.answers.map((ans, i) => (
//                 <label key={i}><input type="radio" name={name} value={ans} onChange={handleChange} /> {ans}</label>
//               ))}
//             </div>
//           );
//     }
//   };

//   // --- renderSubQuestions function - (Unchanged) ---
//   // (It correctly uses the global 'questionnaireData' variable)
//   const renderSubQuestions = (subQuestions, parentNumber) => {
//     return subQuestions.map((subQConfig, index) => {
//       const subQData = questionnaireData[subQConfig.key];
//       if (!subQData) return null;
//       const subQName = subQConfig.name || subQConfig.key;
//       const displayNumber = `${parentNumber}${String.fromCharCode(97 + index)}.`;  
//       return (
//         <React.Fragment key={subQName}>
//           <div className={`question-block ${validationErrors.includes(subQName) ? 'error' : ''}`}>
//             <label>
//                 {displayNumber} {subQData.question}
//                 {subQConfig.required && <span className="required-asterisk">*</span>}
//             </label>
//             {renderInput(subQConfig)} 
//           </div>
//           {subQConfig.subQuestions && (
//             <div className={`sub-question-container ${formData[subQName] === subQConfig.condition.value ? 'visible' : ''}`}>
//               {renderSubQuestions(subQConfig.subQuestions, displayNumber.slice(0,-1))} 
//             </div>
//           )}
//         </React.Fragment>
//       );
//     });
//   };

//   let questionCounter = 0;

//   // --- Main return JSX - (MODIFIED for UI text) ---
//   return (
//     <>
//       <div className="progress-bar-container">
//         {/* --- MODIFIED: Uses text from JSON --- */}
//         <div className="progress-bar-label">{ui.progressBarTemplate.replace('{progress}', progress)}</div>
//         <div className="progress-bar-track">
//           <div 
//             className="progress-bar-fill" 
//             style={{ width: `${progress}%` }} 
//           ></div>
//         </div>
//       </div>

//       <form className="questionnaire-container" onSubmit={handleSubmit} noValidate>

//         {/* --- MODIFIED: Uses text from JSON --- */}
//         <img src="/tanuh.png" alt={ui.logos.tanuhAlt} className="logo tanuh-logo" />
//         <img src="/IISc_logo.png" alt={ui.logos.iiscAlt} className="logo iisc-logo" />

//         <div className="form-header">
//           {/* --- MODIFIED: Uses text from JSON --- */}
//           <h1>{ui.header.title}</h1>
//           <p style={{ color: "#533b42ff", fontSize: "18px", marginTop: "8px" }}>{ui.header.instructions}</p>
//           <p style={{ color: "#533b42ff", fontSize: "15px", marginTop: "8px" }}>
//             {/* --- MODIFIED: Uses text from JSON --- */}
//             {ui.header.mandatoryPre}
//             <span style={{ color: "#d93025", fontWeight: 600 }}>{ui.header.mandatorySymbol}</span>
//             {ui.header.mandatoryPost}
//           </p>
//         </div>
        
//         {/* (This mapping logic is unchanged and correct) */}
//         {formStructure.map((section, index) => (
//           <div key={index} className="form-section">
//             <h2>{section.title}</h2>
//             {section.questions.map((qConfig) => {
//               const data = questionnaireData[qConfig.key];
//               if (!data) return null;
//               questionCounter++;
//               const displayNumber = `${questionCounter}.`;
//               const name = qConfig.name || qConfig.key;
//               const isQ27No = qConfig.key === "Q27" && formData[name] === "No";
//               const showSubquestions = qConfig.subQuestions && qConfig.condition && formData[qConfig.condition.key] === qConfig.condition.value;

//               return (
//                 <React.Fragment key={name}>
//                   <div className={`question-block ${validationErrors.includes(name) ? 'error' : ''}`}>
//                     <label>
//                         {displayNumber} {data.question}
//                         {qConfig.required && <span className="required-asterisk">*</span>}
//                     </label>
//                     {renderInput(qConfig)} 
//                   </div>
//                   {qConfig.subQuestions && (
//                     <div className={`sub-question-container ${showSubquestions ? 'visible' : ''}`}>
//                       {renderSubQuestions(qConfig.subQuestions, questionCounter)}
//                     </div>
//                   )}
//                   {qConfig.key === "Q27" && formData['Q27'] === "No" && (
//                     <>
//                       {!q27VideoConfirmed && showQ27VideoPrompt && (
//                         <div className="video-prompt-container">
//                           {/* --- MODIFIED: Uses text from JSON --- */}
//                           <p className="video-prompt-note">
//                             {ui.videoPrompt.note}
//                           </p>
//                           <button
//                             type="button"
//                             className="video-prompt-button"
//                             onClick={() => setQ27VideoConfirmed(true)} 
//                           >
//                             {/* --- MODIFIED: Uses text from JSON --- */}
//                             {ui.videoPrompt.button}
//                           </button>
//                         </div>
//                       )}
//                       {q27VideoConfirmed && qConfig.videoUrlOnNo && (
//                         <div className="youtube-player-container">
//                             {/* --- MODIFIED: Uses text from JSON --- */}
//                             <iframe width="560" height="315" src={qConfig.videoUrlOnNo} title={ui.videoPrompt.videoTitle} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </React.Fragment>
//               );
//             })}
//           </div>
//         ))}
//         <div className="submit-button-container">
//           {isSubmitting ? (
//             <button type="button" className="submit-button loading" disabled>
//               <span className="loading-dots">
//                 <span></span><span></span><span></span>
//               </span>
//               {/* --- MODIFIED: Uses text from JSON --- */}
//               {ui.submitButton.loading}
//             </button>
//           ) : (
//             <button type="submit" className="submit-button">
//               {/* --- MODIFIED: Uses text from JSON --- */}
//               {ui.submitButton.default}
//             </button>
//           )}
//         </div>
//       </form>
//     </>
//   );
// }

// export default Questionnaire;


// after tranlation working code(caan be deleted if after code works)





// import React, { useState, useEffect } from 'react';
// import './Questionnaire.css';
// // NEW: Import the translation hook
// import { useTranslation } from 'react-i18next';


// // Helper function to generate random string (Unchanged)
// const generateRandomId = (length = 8) => {
//   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   let result = '';
//   for (let i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() * characters.length));
//   }
//   return result;
// };


// // NEW: Accept formStructure and questionnaireData as props
// function Questionnaire({ onSubmit, isSubmitting, formStructure, questionnaireData }) {
  
//   // NEW: Initialize i18next hook *only* for UI text

//   const { t } = useTranslation('questionnaire');
  
//   // NEW: Load 'ui' text from the hook
//   const ui = t('ui', { returnObjects: true });

//   // State hooks
//   const [formData, setFormData] = useState(() => ({
//     Q45: t('ui.defaults.q45')
//   }));
//   const [validationErrors, setValidationErrors] = useState([]);
//   const [progress, setProgress] = useState(0);
//   const [showQ27VideoPrompt, setShowQ27VideoPrompt] = useState(false); 
//   const [q27VideoConfirmed, setQ27VideoConfirmed] = useState(false);
//   const [randomPatientId, setRandomPatientId] = useState('');
  
//   // Effect to set random ID and defaults
//   useEffect(() => {
//     const newId = generateRandomId();
//     setRandomPatientId(newId);
//     // Pre-fill the form with defaults from the translation file
//     setFormData(prevData => ({
//       ...prevData,
//       Q44: newId,
//       Q45: t('ui.defaults.q45') // Use default from JSON
//     }));
//   }, [t]); // 't' dependency re-runs this if language changes
  
  
//   // Progress calculation - Now safe because formStructure is a prop
//   useEffect(() => {
//     const getVisibleQuestionKeys = (currentFormData) => {
//       const visibleKeys = new Set();
//       const traverse = (questions) => {
//           if (!Array.isArray(questions)) return; // Safety check
//           questions.forEach(q => {
//               const qKey = q.name || q.key;
//               visibleKeys.add(qKey); 
//               if (q.otherOptionId) {
//                    visibleKeys.add(q.otherOptionId);
//               }
              
//               // CRITICAL FIX: Check condition against the translated "Yes" value
//               // Get the "value" from the JSON (e.g., "Yes")
//               const conditionValue = q.condition ? q.condition.value : null; 
//               // Find the translated version of that value (e.g., "हाँ")
//               // We assume "Yes" is always the first answer (index 0)
//               const translatedConditionValue = (q.condition && q.condition.key && t(`questions.${q.condition.key}.answers`)) ? t(`questions.${q.condition.key}.answers.0`) : null; 

//               if (q.subQuestions && q.condition && currentFormData[q.condition.key] === translatedConditionValue) {
//                   traverse(q.subQuestions);
//               }
//           });
//       };
//       if (Array.isArray(formStructure)) {
//         formStructure.forEach(section => traverse(section.questions));
//       }
//       return visibleKeys;
//     };

//     const countAnsweredVisibleQuestions = (currentFormData, visibleKeysSet) => {
//         let answeredCount = 0;
//         visibleKeysSet.forEach(key => {
//             const value = currentFormData[key];
//             if (value !== undefined && value !== null && value !== '' && (!Array.isArray(value) || value.length > 0)) {
//                 answeredCount++;
//             }
//         });
//         return answeredCount;
//     };

//     if (!Array.isArray(formStructure)) {
//         setProgress(0);
//         return;
//     }
//     const visibleKeysSet = getVisibleQuestionKeys(formData);
//     const answeredCount = countAnsweredVisibleQuestions(formData, visibleKeysSet);
//     const totalVisible = visibleKeysSet.size;
//     const newProgress = totalVisible > 0 ? Math.round((answeredCount / totalVisible) * 100) : 0;
//     setProgress(Math.min(newProgress, 100)); 
//   }, [formData, formStructure, t]); // 't' is a dependency

//   // handleChange - Modified to use translated "No"
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     // CRITICAL FIX: Get translated "No" value for Q27
//     const noValue = t('questions.Q27.answers.1'); // Assumes "No" is index 1

//     if (name === 'Q27') {
//       if (value === noValue) {
//         setShowQ27VideoPrompt(true); 
//         setQ27VideoConfirmed(false); 
//       } else {
//         setShowQ27VideoPrompt(false); 
//         setQ27VideoConfirmed(false); 
//       }
//     }
//     if (type === 'checkbox') {
//         const currentValues = formData[name] || [];
//         const newValues = checked ? [...currentValues, value] : currentValues.filter(v => v !== value);
//         setFormData(prev => ({ ...prev, [name]: newValues }));
//     } else {
//         setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   // getVisibleRequiredQuestions - Modified to use translated "Yes"
//   const getVisibleRequiredQuestions = () => {
//     let visibleRequired = [];
//     const traverseQuestions = (questions) => {
//         if (!Array.isArray(questions)) return;
//         for (const q of questions) {
//             if (q.required) {
//                 visibleRequired.push(q.name || q.key);
//             }
//              // CRITICAL FIX: Check condition against translated "Yes" value
//              const conditionValue = q.condition ? q.condition.value : null;
//              // Assumes "Yes" is the first answer (index 0)
//              const translatedConditionValue = (q.condition && q.condition.key && t(`questions.${q.condition.key}.answers`)) ? t(`questions.${q.condition.key}.answers.0`) : null;

//              if (q.subQuestions && q.condition && FormData[q.condition.key] === translatedConditionValue) {
//                 traverseQuestions(q.subQuestions);
//             }
//         }
//     };
//     if (Array.isArray(formStructure)) {
//       formStructure.forEach(section => traverseQuestions(section.questions));
//     }
//     return visibleRequired;
//   };
  
//   // handleSubmit (with default value logic) - Modified for translated text
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setValidationErrors([]);

//     const dataToSubmit = { ...formData };

//     if (!dataToSubmit.Q44) {
//         dataToSubmit.Q44 = randomPatientId;
//     }
//     if (!dataToSubmit.Q45) {
//         dataToSubmit.Q45 = t('ui.defaults.q45'); 
//     }
//     const visibleRequiredKeys = getVisibleRequiredQuestions();
//     const missingFields = visibleRequiredKeys.filter(key => {
//         const value = dataToSubmit[key];
//         return value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);
//     });

//     if (missingFields.length > 0) {
//         setValidationErrors(missingFields);
//         alert(t('ui.errors.validationAlert')); // Use translated alert
//         const firstErrorKey = missingFields[0];
//         const errorElement = document.querySelector(`[name="${firstErrorKey}"]`);
//         if (errorElement) {
//             errorElement.closest('.question-block').scrollIntoView({ behavior: 'smooth', block: 'center' });
//         }
//         return;
//     }

//     onSubmit(dataToSubmit);
//   };

//   // renderInput - Modified to use translated data
//   const renderInput = (qConfig) => { 
//     // 'questionnaireData' is now a prop
//     const data = questionnaireData[qConfig.key];
//     if (!data) return <p>{t('ui.errors.questionNotFound', { key: qConfig.key })}</p>;
    
//     const name = qConfig.name || qConfig.key;
//     let placeholder = qConfig.placeholder || '';
//     if (qConfig.key === 'Q44') {
//         placeholder = randomPatientId; 
//     }

//     if (!Array.isArray(data.answers) || data.answers.length === 0) {
//       return <input 
//         type={qConfig.type || 'text'} 
//         name={name} 
//         placeholder={placeholder} 
//         value={formData[name] || ''} 
//         onChange={handleChange} 
//         className="text-input" 
//       />;
//     }
    
//     switch (qConfig.type) {
//        case 'select':
//          return (
//            <select name={name} onChange={handleChange} value={formData[name] || ""} className="select-input">
//              <option value="" disabled>{t('ui.inputs.selectDefault')}</option>
//              {data.answers.map((ans, i) => <option key={i} value={ans}>{ans}</option>)}
//            </select>
//          );
//        case 'checkbox':
//          return (
//            <div className="checkbox-group vertical">
//              {data.answers.map((ans, i) => (
//                <label key={i}>
//                  <input 
//                    type="checkbox" name={name} value={ans} onChange={handleChange} 
//                    checked={formData[name]?.includes(ans) || false}
//                  /> {ans}
//                </label>
//              ))}
//            </div>
//          );
//        case 'checkbox-plus-text':
//           return (
//               <div className="checkbox-group vertical">
//                  {data.answers.map((ans, i) => (
//                      <label key={i}>
//                        <input 
//                          type="checkbox" name={name} value={ans} onChange={handleChange}
//                          checked={formData[name]?.includes(ans) || false}
//                        /> {ans}
//                      </label>
//                  ))}
//                   <input 
//                     type="text" name={qConfig.otherOptionId} 
//                     placeholder={qConfig.otherPlaceholder || t('ui.inputs.otherPlaceholder', 'Specify other')} 
//                     onChange={handleChange} className="text-input" 
//                     value={formData[qConfig.otherOptionId] || ''}
//                   />
//               </div>
//           );
//        case 'radio':
//        default:
//          return (
//            <div className="radio-group vertical">
//              {data.answers.map((ans, i) => (
//                <label key={i}>
//                  <input 
//                    type="radio" name={name} value={ans} onChange={handleChange} 
//                    checked={formData[name] === ans}
//                  /> {ans}
//                </label>
//              ))}
//            </div>
//          );
//     }
//   };

//   // renderSubQuestions - Modified to use translated data
//   const renderSubQuestions = (subQuestions, parentNumber) => {
//     if (!Array.isArray(subQuestions)) return null; 
//     return subQuestions.map((subQConfig, index) => {
//       const subQData = questionnaireData[subQConfig.key];
//       if (!subQData) return null;
      
//       const subQName = subQConfig.name || subQConfig.key;
//       const displayNumber = `${parentNumber}${String.fromCharCode(97 + index)}.`; 
      
//       const conditionValue = subQConfig.condition ? subQConfig.condition.value : null;
//       // Assumes "Yes" is index 0
//       const translatedConditionValue = (subQConfig.condition && subQConfig.condition.key) ? t(`questions.${subQConfig.condition.key}.answers.0`) : null;

//       return (
//         <React.Fragment key={subQName}>
//           <div className={`question-block ${validationErrors.includes(subQName) ? 'error' : ''}`}>
//             <label>
//                 {displayNumber} {subQData.question}
//                 {subQConfig.required && <span className="required-asterisk">*</span>}
//             </label>
//             {renderInput(subQConfig)} 
//           </div>
//           {subQConfig.subQuestions && (
//             <div className={`sub-question-container ${formData[subQName] === translatedConditionValue ? 'visible' : ''}`}>
//               {renderSubQuestions(subQConfig.subQuestions, displayNumber.slice(0,-1))} 
//             </div>
//           )}
//         </React.Fragment>
//       );
//     });
//   };

//   let questionCounter = 0;

//   // Loading check (important!)
//   // If the data hasn't been loaded by i18next yet, show a loading message
//   if (!Array.isArray(formStructure) || !ui.header || !questionnaireData.Q1) {
//     return (
//         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
//             Loading questionnaire content...
//         </div>
//     );
//   }

//   // --- Main return JSX - Modified to use translated 'ui' object ---
//   return (
//     <>
//       <div className="progress-bar-container">
//         {/* <div className="progress-bar-label">{t('ui.progressBarTemplate', {progress: progress})}</div> */}
//         <div className="progress-bar-label">{ui.progressBarTemplate.replace('{progress}', progress)}</div>
//         <div className="progress-bar-track">
//           <div 
//             className="progress-bar-fill" 
//             style={{ width: `${progress}%` }} 
//           ></div>
//         </div>
//       </div>

//       <form className="questionnaire-container" onSubmit={handleSubmit} noValidate>
//         <img src="/tanuh.png" alt={t('ui.logos.tanuhAlt')} className="logo tanuh-logo" />
//         <img src="/IISc_logo.png" alt={t('ui.logos.iiscAlt')} className="logo iisc-logo" />
        
//         <div className="form-header">
//           <h1>{t('ui.header.title')}</h1>
//           <p style={{ color: "#533b42ff", fontSize: "18px", marginTop: "8px" }}>{t('ui.header.instructions')}</p>
//           <p style={{ color: "#533b42ff", fontSize: "15px", marginTop: "8px" }}>
//             {t('ui.header.mandatoryPre')}
//             <span style={{ color: "#d93025", fontWeight: 600 }}>{t('ui.header.mandatorySymbol')}</span>
//             {t('ui.header.mandatoryPost')}
//           </p>
//         </div>
        
//         {formStructure.map((section, index) => (
//           <div key={index} className="form-section">
//             <h2>{t(section.title)}</h2> {/* Get section title from translation */}
//             {section.questions.map((qConfig) => {
//               const data = questionnaireData[qConfig.key];
//               if (!data) return null;
              
//               questionCounter++;
//               const displayNumber = `${questionCounter}.`;
//               const name = qConfig.name || qConfig.key;
              
//               // CRITICAL FIX: Get translated "Yes" and "No" for conditions
//               const conditionValue = qConfig.condition ? qConfig.condition.value : null; 
//               // Assumes "Yes" is index 0
//               const translatedConditionValue = (qConfig.condition && qConfig.condition.key) ? t(`questions.${qConfig.condition.key}.answers.0`) : null; 

//               const noValueQ27 = t('questions.Q27.answers.1'); 
//               const isQ27No = qConfig.key === "Q27" && formData[name] === noValueQ27;
              
//               const showSubquestions = qConfig.subQuestions && qConfig.condition && formData[qConfig.condition.key] === translatedConditionValue;

//               return (
//                 <React.Fragment key={name}>
//                   <div className={`question-block ${validationErrors.includes(name) ? 'error' : ''}`}>
//                     <label>
//                         {displayNumber} {data.question}
//                         {qConfig.required && <span className="required-asterisk">*</span>}
//                     </label>
//                     {renderInput(qConfig)} 
//                   </div>
//                   {qConfig.subQuestions && (
//                     <div className={`sub-question-container ${showSubquestions ? 'visible' : ''}`}>
//                       {renderSubQuestions(qConfig.subQuestions, questionCounter)}
//                     </div>
//                   )}
//                    {qConfig.key === "Q27" && isQ27No && ( // Use the specific isQ27No variable
//                      <>
//                        {!q27VideoConfirmed && showQ27VideoPrompt && (
//                          <div className="video-prompt-container">
//                            <p className="video-prompt-note">{t('ui.videoPrompt.note')}</p>
//                            <button
//                              type="button"
//                              className="video-prompt-button"
//                              onClick={() => setQ27VideoConfirmed(true)} 
//                            >
//                              {t('ui.videoPrompt.button')}
//                            </button>
//                          </div>
//                        )}
//                        {q27VideoConfirmed && qConfig.videoUrlOnNo && (
//                          <div className="youtube-player-container">
//                              <iframe width="560" height="315" src={qConfig.videoUrlOnNo} title={t('ui.videoPrompt.videoTitle')} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
//                          </div>
//                        )}
//                      </>
//                    )}
//                 </React.Fragment>
//               );
//             })}
//           </div>
//         ))}
//         <div className="submit-button-container">
//           {isSubmitting ? (
//             <button type="button" className="submit-button loading" disabled>
//               <span className="loading-dots"><span></span><span></span><span></span></span>
//               {t('ui.submitButton.loading')}
//             </button>
//           ) : (
//             <button type="submit" className="submit-button">
//               {t('ui.submitButton.default')}
//             </button>
//           )}
//         </div>
//       </form>
//     </>
//   );
// }

// // REMOVED: The invalid export that caused the error.
// // export { formStructure }; 
// export default Questionnaire;






import React, { useState, useEffect } from 'react';
import './Questionnaire.css';
// NEW: Import the translation hook
import { useTranslation } from 'react-i18next';


// Helper function to generate random string (Unchanged)
const generateRandomId = (length = 8) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};


// NEW: Accept formStructure and questionnaireData as props
function Questionnaire({ onSubmit, isSubmitting, formStructure, questionnaireData, questionnaireDataEn }) {
  
  // NEW: Initialize i18next hook *only* for UI text

  const { t } = useTranslation('questionnaire');
  
  // NEW: Load 'ui' text from the hook
  const ui = t('ui', { returnObjects: true });

  // State hooks
  const [formData, setFormData] = useState(() => ({
    Q45: t('ui.defaults.q45')
  }));
  const [formDataEn, setFormDataEn] = useState(() => ({
    Q45: 'Universal'
  }));
  const [validationErrors, setValidationErrors] = useState([]);
  const [progress, setProgress] = useState(0);
  const [showQ27VideoPrompt, setShowQ27VideoPrompt] = useState(false); 
  const [q27VideoConfirmed, setQ27VideoConfirmed] = useState(false);
  const [randomPatientId, setRandomPatientId] = useState('');
  
  // Helper to get the translated value for a condition
  // It looks up the English index of the value (e.g., "No") and finds the matching translated string.
  const getTranslatedConditionValue = (condition) => {
    if (!condition || !condition.key || !condition.value) return null;
    
    // 1. Get English answers for the condition key
    const enAnswers = questionnaireDataEn[condition.key]?.answers;
    if (!Array.isArray(enAnswers)) return null;

    // 2. Find index of the required value (e.g., "No" is index 1)
    const index = enAnswers.indexOf(condition.value);
    if (index === -1) return null;

    // 3. Get the Translated answer at that index
    // We use the 't' function logic or direct prop access
    const translatedAnswers = questionnaireData[condition.key]?.answers;
    
    // Fallback to English if translation missing
    return translatedAnswers?.[index] || enAnswers[index];
  };

  // Effect to set random ID and defaults
  useEffect(() => {
    const newId = generateRandomId();
    setRandomPatientId(newId);
    // Pre-fill the form with defaults from the translation file
    setFormData(prevData => ({
      ...prevData,
      Q44: newId,
      Q45: t('ui.defaults.q45') // Use default from JSON
    }));
  }, [t]); // 't' dependency re-runs this if language changes
  
  
  // Progress calculation - Now safe because formStructure is a prop
  useEffect(() => {
    const getVisibleQuestionKeys = (currentFormData) => {
      const visibleKeys = new Set();
      const traverse = (questions) => {
          if (!Array.isArray(questions)) return; // Safety check
          questions.forEach(q => {
              const qKey = q.name || q.key;
              visibleKeys.add(qKey); 
              if (q.otherOptionId) {
                   visibleKeys.add(q.otherOptionId);
              }
              
              // CRITICAL FIX: Check condition against the translated "Yes" value
              // Get the "value" from the JSON (e.g., "Yes")
              // const conditionValue = q.condition ? q.condition.value : null; 
              // // Find the translated version of that value (e.g., "हाँ")
              // // We assume "Yes" is always the first answer (index 0)
              // const translatedConditionValue = (q.condition && q.condition.key && t(`questions.${q.condition.key}.answers`)) ? t(`questions.${q.condition.key}.answers.0`) : null; 

              // if (q.subQuestions && q.condition && currentFormData[q.condition.key] === translatedConditionValue) {
              //     traverse(q.subQuestions);
              // }
              if (q.subQuestions && q.condition) {
                  const translatedConditionValue = getTranslatedConditionValue(q.condition);
                  if (currentFormData[q.condition.key] === translatedConditionValue) {
                      traverse(q.subQuestions);
                  }
              }
          });
      };
      if (Array.isArray(formStructure)) {
        formStructure.forEach(section => traverse(section.questions));
      }
      return visibleKeys;
    };

    const countAnsweredVisibleQuestions = (currentFormData, visibleKeysSet) => {
        let answeredCount = 0;
        visibleKeysSet.forEach(key => {
            const value = currentFormData[key];
            if (value !== undefined && value !== null && value !== '' && (!Array.isArray(value) || value.length > 0)) {
                answeredCount++;
            }
        });
        return answeredCount;
    };

    if (!Array.isArray(formStructure)) {
        setProgress(0);
        return;
    }
    const visibleKeysSet = getVisibleQuestionKeys(formData);
    const answeredCount = countAnsweredVisibleQuestions(formData, visibleKeysSet);
    const totalVisible = visibleKeysSet.size;
    const newProgress = totalVisible > 0 ? Math.round((answeredCount / totalVisible) * 100) : 0;
    setProgress(Math.min(newProgress, 100)); 
  }, [formData, formStructure, t]); // 't' is a dependency

  // handleChange - Modified to use translated "No"
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // CRITICAL FIX: Get translated "No" value for Q27
    const noValue = t('questions.Q27.answers.1'); // Assumes "No" is index 1

    if (name === 'Q27') {
      if (value === noValue) {
        setShowQ27VideoPrompt(true); 
        setQ27VideoConfirmed(false); 
      } else {
        setShowQ27VideoPrompt(false); 
        setQ27VideoConfirmed(false); 
      }
    }
    if (type === 'checkbox') {
        const currentValues = formData[name] || [];
        const newValues = checked ? [...currentValues, value] : currentValues.filter(v => v !== value);
        const localAnswers = questionnaireData[name]?.answers || [];
        const englishAnswers = questionnaireDataEn[name]?.answers || [];
        const englishMappedValues = newValues.map(
          val => englishAnswers[localAnswers.indexOf(val)] || val
        );
        console.log('Checkbox Change:', { name, newValues, englishMappedValues });

        setFormData(prev => ({ ...prev, [name]: newValues }));
        setFormDataEn(prev => ({ ...prev, [name]: englishMappedValues }));
    } else {
        const hindiAnswers = questionnaireData[name]?.answers || [];
        const englishAnswers = questionnaireDataEn[name]?.answers || [];
        const englishValue =
          englishAnswers[hindiAnswers.indexOf(value)] || value;

        console.log('Input Change:', { name, value, englishValue });
        setFormData(prev => ({ ...prev, [name]: value }));
        setFormDataEn(prev => ({ ...prev, [name]: englishValue }));
    }
  };

  // getVisibleRequiredQuestions - Modified to use translated "Yes"
  const getVisibleRequiredQuestions = () => {
    let visibleRequired = [];
    const traverseQuestions = (questions) => {
        if (!Array.isArray(questions)) return;
        for (const q of questions) {
            if (q.required) {
                visibleRequired.push(q.name || q.key);
            }
            //  // CRITICAL FIX: Check condition against translated "Yes" value
            //  const conditionValue = q.condition ? q.condition.value : null;
            //  // Assumes "Yes" is the first answer (index 0)
            //  const translatedConditionValue = (q.condition && q.condition.key && t(`questions.${q.condition.key}.answers`)) ? t(`questions.${q.condition.key}.answers.0`) : null;

            //  if (q.subQuestions && q.condition && FormData[q.condition.key] === translatedConditionValue) {
            //     traverseQuestions(q.subQuestions);
            // }
            if (q.subQuestions && q.condition) {
                const translatedConditionValue = getTranslatedConditionValue(q.condition);
                if (formData[q.condition.key] === translatedConditionValue) {
                     traverseQuestions(q.subQuestions);
                }
            }
        }
    };
    if (Array.isArray(formStructure)) {
      formStructure.forEach(section => traverseQuestions(section.questions));
    }
    return visibleRequired;
  };
  // Helper: validate numeric rules and return array of failing keys
  const validateNumericRules = (data) => {
    const failures = [];

    if (!Array.isArray(formStructure)) return failures;

    const traverse = (questions) => {
      if (!Array.isArray(questions)) return;
      for (const q of questions) {
        const key = q.name || q.key;
        // Only validate numeric fields that have value
        if (q.type === 'number') {
          const raw = data[key];
          if (raw !== undefined && raw !== null && raw !== '') {
            // coerce to number safely
            const num = Number(raw);
            if (Number.isNaN(num)) {
              failures.push(key);
              continue;
            }
            if (q.min !== undefined && num < q.min) {
              failures.push(key);
              continue;
            }
            if (q.max !== undefined && num > q.max) {
              failures.push(key);
              continue;
            }
          } else if (q.required) {
            // if required and empty, will be caught by missingFields too; optional
          }
        }
        // Recurse into subQuestions
        if (q.subQuestions) traverse(q.subQuestions);
      }
    };

    formStructure.forEach(section => traverse(section.questions));
    return failures;
  };

  
  // handleSubmit (with default value logic) - Modified for translated text
  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationErrors([]);

    const dataToSubmit = { ...formData };
    const dataToSubmitEn = { ...formDataEn };


    if (!dataToSubmitEn.Q44) {
        dataToSubmitEn.Q44 = randomPatientId;
    }
    if (!dataToSubmitEn.Q45) {
        dataToSubmitEn.Q45 = "Universal"; 
    }
    if (!dataToSubmit.Q44) {
        dataToSubmit.Q44 = randomPatientId;
    }
    if (!dataToSubmit.Q45) {
        dataToSubmit.Q45 = t('ui.defaults.q45'); 
    }
    const visibleRequiredKeys = getVisibleRequiredQuestions();
    const missingFields = visibleRequiredKeys.filter(key => {
        const value = dataToSubmit[key];
        return value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);
    });
    // console.log('Submitting:', { dataToSubmit, dataToSubmitEn, missingFields });

    const numericFailures = validateNumericRules(dataToSubmit);

    const combinedFailures = [...new Set([...missingFields, ...numericFailures])];
    // console.log('Validation Failures:', combinedFailures);

    if (combinedFailures.length > 0) {
      setValidationErrors(combinedFailures);
      alert(t('ui.errors.validationAlert')); // same alert
      const firstErrorKey = combinedFailures[0];
      const errorElement = document.querySelector(`[name="${firstErrorKey}"]`);
      if (errorElement) {
        errorElement.closest('.question-block').scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    // if (missingFields.length > 0) {
    //   console.log('Validation Errors:', missingFields);
    //     setValidationErrors(missingFields);
    //     alert(t('ui.errors.validationAlert')); // Use translated alert
    //     const firstErrorKey = missingFields[0];
    //     const errorElement = document.querySelector(`[name="${firstErrorKey}"]`);
    //     if (errorElement) {
    //         errorElement.closest('.question-block').scrollIntoView({ behavior: 'smooth', block: 'center' });
    //     }
    //     return;
    // }

  
    onSubmit(dataToSubmit, dataToSubmitEn);
  };

  // renderInput - Modified to use translated data
  const renderInput = (qConfig) => { 
    // 'questionnaireData' is now a prop
    const data = questionnaireData[qConfig.key];
    if (!data) return <p>{t('ui.errors.questionNotFound', { key: qConfig.key })}</p>;
    
    const name = qConfig.name || qConfig.key;
    let placeholder = qConfig.placeholder || '';
    if (qConfig.key === 'Q44') {
        placeholder = randomPatientId; 
    }

    if (!Array.isArray(data.answers) || data.answers.length === 0) {
      if (qConfig.type === 'number') {
        const minAttr = qConfig.min !== undefined ? qConfig.min : undefined;
        const maxAttr = qConfig.max !== undefined ? qConfig.max : undefined;
        const stepAttr = qConfig.step !== undefined ? qConfig.step : undefined;

        return (
          <>
            <input
              type="number"
              name={name}
              placeholder={placeholder}
              value={formData[name] || ''}
              onChange={handleChange}
              className="text-input"
              min={minAttr}
              max={maxAttr}
              step={stepAttr}
            />
            {/* <-- paste the error message snippet here */}
            {validationErrors.includes(name) && (
              <div className="field-error">
                {qConfig.min !== undefined && qConfig.max !== undefined
                  ? `${t('ui.invalidInput.numberPrefix')} ${qConfig.min} ${t('ui.invalidInput.and')} ${qConfig.max}.`
                  : `${t('ui.invalidInput.validInput')} `}
              </div>
            )}
          </>
        );
      }
      return <input 
        type={qConfig.type || 'text'} 
        name={name} 
        placeholder={placeholder} 
        value={formData[name] || ''} 
        onChange={handleChange} 
        className="text-input" 
      />;
    }
    
    switch (qConfig.type) {
       case 'select':
         return (
           <select name={name} onChange={handleChange} value={formData[name] || ""} className="select-input">
             <option value="" disabled>{t('ui.inputs.selectDefault')}</option>
             {data.answers.map((ans, i) => <option key={i} value={ans}>{ans}</option>)}
           </select>
         );
       case 'checkbox':
         return (
           <div className="checkbox-group vertical">
             {data.answers.map((ans, i) => (
               <label key={i}>
                 <input 
                   type="checkbox" name={name} value={ans} onChange={handleChange} 
                   checked={formData[name]?.includes(ans) || false}
                 /> {ans}
               </label>
             ))}
           </div>
         );
       case 'checkbox-plus-text':
          return (
              <div className="checkbox-group vertical">
                 {data.answers.map((ans, i) => (
                     <label key={i}>
                       <input 
                         type="checkbox" name={name} value={ans} onChange={handleChange}
                         checked={formData[name]?.includes(ans) || false}
                       /> {ans}
                     </label>
                 ))}
                  {/* <input 
                    type="text" name={qConfig.otherOptionId} 
                    placeholder={qConfig.otherPlaceholder || t('ui.inputs.otherPlaceholder', 'Specify other')} 
                    onChange={handleChange} className="text-input" 
                    value={formData[qConfig.otherOptionId] || ''}
                  /> */}
              </div>
          );
       case 'radio':
       default:
         return (
           <div className="radio-group vertical">
             {data.answers.map((ans, i) => (
               <label key={i}>
                 <input 
                   type="radio" name={name} value={ans} onChange={handleChange} 
                   checked={formData[name] === ans}
                 /> {ans}
               </label>
             ))}
           </div>
         );
    }
  };

  // renderSubQuestions - Modified to use translated data
  // const renderSubQuestions = (subQuestions, parentNumber) => {
  //   if (!Array.isArray(subQuestions)) return null; 
  //   return subQuestions.map((subQConfig, index) => {
  //     const subQData = questionnaireData[subQConfig.key];
  //     if (!subQData) return null;
      
  //     const subQName = subQConfig.name || subQConfig.key;
  //     const displayNumber = `${parentNumber}${String.fromCharCode(97 + index)}.`; 
      
  //     // const conditionValue = subQConfig.condition ? subQConfig.condition.value : null;
  //     // Assumes "Yes" is index 0
  //     // let translatedConditionValue = (subQConfig.condition && subQConfig.condition.key) ? t(`questions.${subQConfig.condition.key}.answers.0`) : null;
  //     // if (subQConfig.condition.key === "Q24") {
  //     //   translatedConditionValue = (subQConfig.condition && subQConfig.condition.key) ? t(`questions.${subQConfig.condition.key}.answers.1`) : null;
  //     // }

  //     let translatedConditionValue = null;
  //     if (subQConfig.condition && subQConfig.condition.key) {
  //       // default: use the first answer translation (index 0) if present
  //       // translatedConditionValue = t(`questions.${subQConfig.condition.key}.answers.0`, { defaultValue: null });
  //       translatedConditionValue = getTranslatedConditionValue(subQConfig.condition);
      

  //       // special-case: if condition key is Q24, we want "No" (answers[1]) as the trigger
  //       if (subQConfig.condition.key === "Q24") {
  //         translatedConditionValue = t(`questions.${subQConfig.condition.key}.answers.1`, { defaultValue: null });
  //       }
  //     }

  //     return (
  //       <React.Fragment key={subQName}>
  //         <div className={`question-block ${validationErrors.includes(subQName) ? 'error' : ''}`}>
  //           <label>
  //               {displayNumber} {subQData.question}
  //               {subQConfig.required && <span className="required-asterisk">*</span>}
  //           </label>
  //           {renderInput(subQConfig)} 
  //         </div>
  //         {subQConfig.subQuestions && (
  //           <div className={`sub-question-container ${formData[subQName] === translatedConditionValue ? 'visible' : ''}`}>
  //             {renderSubQuestions(subQConfig.subQuestions, displayNumber.slice(0,-1))} 
  //           </div>
  //         )}
  //       </React.Fragment>
  //     );
  //   });
  // };
  // renderSubQuestions - Corrected to handle both Q12 (Fork) and Q24 (Self-Trigger)
  // renderSubQuestions - "Look-Ahead" Version to fix empty bars
  // renderSubQuestions - Optimized to use formDataEn for reliable condition checks
  const renderSubQuestions = (subQuestions, parentNumber) => {
    if (!Array.isArray(subQuestions)) return null;

    return subQuestions.map((subQConfig, index) => {
      const subQData = questionnaireData[subQConfig.key];
      if (!subQData) return null;

      const subQKey = subQConfig.name || subQConfig.key;
      const conditionKey = subQConfig.condition ? subQConfig.condition.key : null;

      // --- LOGIC 1: SHOULD THIS QUESTION (THE PARENT) RENDER? ---
      // Check: Is this question dependent on a previous question?
      // (e.g., Q11 depends on Q12_Current)
      if (subQConfig.condition && conditionKey !== subQKey) {
         // FIX: Check against formDataEn directly. This matches the "value": "Yes" in your JSON
         // regardless of the current UI language or missing translation keys.
         if (formDataEn[conditionKey] !== subQConfig.condition.value) {
             return null; 
         }
      }

      const displayNumber = `${parentNumber}${String.fromCharCode(97 + index)}.`;

      // --- LOGIC 2: PRE-CALCULATE CHILDREN ---
      let renderedChildren = null;
      
      // Check if this question allows children (Self-Trigger Logic, e.g. Q24="No")
      let allowChildren = true;
      if (subQConfig.condition && conditionKey === subQKey) {
          // FIX: Check against formDataEn directly.
          if (formDataEn[subQKey] !== subQConfig.condition.value) {
              allowChildren = false;
          }
      }

      // Recursively generate children if allowed
      if (subQConfig.subQuestions && allowChildren) {
          renderedChildren = renderSubQuestions(subQConfig.subQuestions, displayNumber.slice(0,-1));
      }

      // --- LOGIC 3: CHECK FOR VALID CHILDREN ---
      const hasValidChildren = Array.isArray(renderedChildren) && renderedChildren.some(child => child !== null);

      return (
        <React.Fragment key={subQKey}>
          <div className={`question-block ${validationErrors.includes(subQKey) ? 'error' : ''}`}>
            <label>
                {displayNumber} {subQData.question}
                {subQConfig.required && <span className="required-asterisk">*</span>}
            </label>
            {renderInput(subQConfig)}
          </div>
          
          {/* Only render the container DIV if we actually have valid children to show */}
          {hasValidChildren && (
            <div className="sub-question-container visible">
              {renderedChildren}
            </div>
          )}
        </React.Fragment>
      );
    });
  };

  let questionCounter = 0;

  // Loading check (important!)
  // If the data hasn't been loaded by i18next yet, show a loading message
  if (!Array.isArray(formStructure) || !ui.header || !questionnaireData.Q1) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
            Loading questionnaire content...
        </div>
    );
  }

  // --- Main return JSX - Modified to use translated 'ui' object ---
  return (
    <>
      <div className="progress-bar-container">
        {/* <div className="progress-bar-label">{t('ui.progressBarTemplate', {progress: progress})}</div> */}
        <div className="progress-bar-label">{ui.progressBarTemplate.replace('{progress}', progress)}</div>
        <div className="progress-bar-track">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progress}%` }} 
          ></div>
        </div>
      </div>

      <form className="questionnaire-container" onSubmit={handleSubmit} noValidate>
        <img src="/tanuh.png" alt={t('ui.logos.tanuhAlt')} className="logo tanuh-logo" />
        <img src="/IISc_logo.png" alt={t('ui.logos.iiscAlt')} className="logo iisc-logo" />
        
        <div className="form-header">
          <h1>{t('ui.header.title')}</h1>
          <p style={{ color: "#533b42ff", fontSize: "18px", marginTop: "8px" }}>{t('ui.header.instructions')}</p>
          <p style={{ color: "#533b42ff", fontSize: "15px", marginTop: "8px" }}>
            {t('ui.header.mandatoryPre')}
            <span style={{ color: "#d93025", fontWeight: 600 }}>{t('ui.header.mandatorySymbol')}</span>
            {t('ui.header.mandatoryPost')}
          </p>
        </div>
        
        {formStructure.map((section, index) => (
          <div key={index} className="form-section">
            <h2>{t(section.title)}</h2> {/* Get section title from translation */}
            {section.questions.map((qConfig) => {
              const data = questionnaireData[qConfig.key];
              if (!data) return null;
              
              questionCounter++;
              const displayNumber = `${questionCounter}.`;
              const name = qConfig.name || qConfig.key;
              
              // CRITICAL FIX: Get translated "Yes" and "No" for conditions
              const conditionValue = qConfig.condition ? qConfig.condition.value : null; 
              // Assumes "Yes" is index 0
              const translatedConditionValue = (qConfig.condition && qConfig.condition.key) ? t(`questions.${qConfig.condition.key}.answers.0`) : null; 

              const noValueQ27 = t('questions.Q27.answers.1'); 
              const isQ27No = qConfig.key === "Q27" && formData[name] === noValueQ27;
              
              const showSubquestions = qConfig.subQuestions && qConfig.condition && formData[qConfig.condition.key] === translatedConditionValue;

              return (
                <React.Fragment key={name}>
                  <div className={`question-block ${validationErrors.includes(name) ? 'error' : ''}`}>
                    <label>
                        {displayNumber} {data.question}
                        {qConfig.required && <span className="required-asterisk">*</span>}
                    </label>
                    {renderInput(qConfig)} 
                  </div>
                  {qConfig.subQuestions && (
                    <div className={`sub-question-container ${showSubquestions ? 'visible' : ''}`}>
                      {renderSubQuestions(qConfig.subQuestions, questionCounter)}
                    </div>
                  )}
                   {qConfig.key === "Q27" && isQ27No && ( // Use the specific isQ27No variable
                     <>
                       {!q27VideoConfirmed && showQ27VideoPrompt && (
                         <div className="video-prompt-container">
                           <p className="video-prompt-note">{t('ui.videoPrompt.note')}</p>
                           <button
                             type="button"
                             className="video-prompt-button"
                             onClick={() => setQ27VideoConfirmed(true)} 
                           >
                             {t('ui.videoPrompt.button')}
                           </button>
                         </div>
                       )}
                       {q27VideoConfirmed && qConfig.videoUrlOnNo && (
                         <div className="youtube-player-container">
                             <iframe width="560" height="315" src={qConfig.videoUrlOnNo} title={t('ui.videoPrompt.videoTitle')} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                         </div>
                       )}
                     </>
                   )}
                </React.Fragment>
              );
            })}
          </div>
        ))}
        <div className="submit-button-container">
          {isSubmitting ? (
            <button type="button" className="submit-button loading" disabled>
              <span className="loading-dots"><span></span><span></span><span></span></span>
              {t('ui.submitButton.loading')}
            </button>
          ) : (
            <button type="submit" className="submit-button">
              {t('ui.submitButton.default')}
            </button>
          )}
        </div>
      </form>
    </>
  );
}

// REMOVED: The invalid export that caused the error.
// export { formStructure }; 
export default Questionnaire;