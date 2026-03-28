import React, { useState, useEffect, useRef } from 'react';
import './Demo.css';
import { useTranslation } from 'react-i18next';
import questionnaireDataEng from '../../public/locales/english/questionnaire.json' with { type: 'json' };
import consentDataEng from '../../public/locales/english/consent.json' with { type: 'json' };

const Demo = () => {
  const { t, ready } = useTranslation(['consent', 'questionnaire', 'thankyou']);
  const [currentStep, setCurrentStep] = useState(0);
  const [consentChecked, setConsentChecked] = useState(false);
  const [langSelected, setLangSelected] = useState('');
  const [demoPhase, setDemoPhase] = useState('init');
  const scrollRef = useRef(null);

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    if (currentStep !== 0) return;

    let isMounted = true;
    const runSimulation = async () => {
      setDemoPhase('init');
      setConsentChecked(false);
      setLangSelected('');
      
      await sleep(500);
      if (!isMounted) return;

      setDemoPhase('lang-dropdown-open');
      await sleep(2000);
      if (!isMounted) return;

      setLangSelected('English');
      setDemoPhase('lang-selected');
      await sleep(2000);
      if (!isMounted) return;

      setDemoPhase('consent-scrolling');
      const el = scrollRef.current;
      if (el) {
         el.scrollTop = 0; // ensure start at top
         const distance = el.scrollHeight - el.clientHeight;
         const steps = 200;
         const stepMs = 10000 / steps;
         const stepAmt = distance / steps;
         for (let i = 0; i < steps; i++) {
            if (!isMounted) return;
            el.scrollTop += stepAmt;
            await sleep(stepMs);
         }
      } else {
         await sleep(10000);
      }
      if (!isMounted) return;

      setDemoPhase('checkbox-blinking');
      await sleep(2000);
      if (!isMounted) return;

      setConsentChecked(true);
      setDemoPhase('button-blinking');
      await sleep(2000);
      if (!isMounted) return;

      handleNext();
    };

    runSimulation();

    return () => { isMounted = false; };
  }, [currentStep]);

  const rawData = questionnaireDataEng;
  const formStructure = ready ? t('questionnaire:formStructure', { returnObjects: true }) : rawData.formStructure;
  const questionsDict = ready ? t('questionnaire:questions', { returnObjects: true }) : rawData.questions;

  const totalSteps = formStructure.length + 2; // Consent (0) + Sections (1..N) + Risk (N+1)

  const handleNext = () => {
    if (currentStep < totalSteps - 1) setCurrentStep(curr => curr + 1);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setConsentChecked(false);
  };

  const renderMockInput = (qNode) => {
    const qData = questionsDict[qNode.key];
    if (!qData) return null;

    if (qNode.type === 'radio' && qData.answers) {
      return (
        <div className="mock-options">
          {qData.answers.map((ans, idx) => (
            <label key={idx} className="mock-radio-label">
              <input type="radio" name={qNode.key} disabled />
              <span>{ans}</span>
            </label>
          ))}
        </div>
      );
    } else if (qNode.type === 'number' || qNode.type === 'text') {
       return <input type="text" className="mock-text-input" placeholder={qNode.placeholder || "Enter value..."} disabled />;
    } else if (qNode.type === 'select') {
       return (
         <select className="mock-select-input" disabled>
           <option>Select an option...</option>
         </select>
       );
    }
    return null;
  };

  const renderQuestion = (qNode, depth = 0) => {
    const questionText = questionsDict[qNode.key]?.question || qNode.key;
    const paddingLeft = `${depth * 20}px`;

    return (
      <div key={qNode.key} className="demo-question" style={{ marginLeft: paddingLeft }}>
        <div className="demo-question-text">{questionText}</div>
        <div className="demo-question-input">
           {renderMockInput(qNode)}
        </div>
        {qNode.subQuestions && qNode.subQuestions.length > 0 && (
          <div className="demo-subquestions">
             {qNode.subQuestions.map(subQ => renderQuestion(subQ, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="demo-container fade-in">
      <div className="demo-header">
        <div className="demo-logos-container">
          <img src="/tanuh.png" alt="TANUH Logo" className="demo-logo" />
          <img src="/IISc_logo.png" alt="IISc Logo" className="demo-logo iisc-img" />
          <img src="/moe.png" alt="Ministry of Education Logo" className="demo-logo moe-img" />
        </div>
        <h1 className="demo-main-title">AI enabled Breast Cancer Risk Prediction Tool</h1>
      </div>

      <div className="demo-step-container">
        
        {/* STEP 0: CONSENT */}
        {currentStep === 0 && (
          <div className="demo-slide fade-in">
            <div className="demo-slide-header-flex">
               <h2>Step 1: Informed Consent</h2>
               <div className="mock-language-selector" style={{position: 'relative'}}>
                 <div className="dropdown-header">
                    🌐 Language: {langSelected || 'Select...'} ▾
                 </div>
                 {demoPhase === 'lang-dropdown-open' && (
                    <div className="dropdown-mock-list fade-in">
                        <div className="dropdown-mock-item">Select...</div>
                        <div className="dropdown-mock-item dropdown-mock-hover">English</div>
                        <div className="dropdown-mock-item">ಕನ್ನಡ</div>
                        <div className="dropdown-mock-item">हिंदी</div>
                    </div>
                 )}
               </div>
            </div>

            {/* Render consent only after language is ostensibly selected */}
            {demoPhase !== 'init' && demoPhase !== 'lang-dropdown-open' && (
               <div className="mock-consent-container fade-in">
                 <div className="mock-consent-scroll" ref={scrollRef}>
                    <h3 style={{marginTop: 0, textAlign: 'center'}}>{consentDataEng.header.studyTitle}</h3>
                    <p><strong>Sponsor:</strong> {consentDataEng.header.sponsor}</p>
                    <hr />
                    
                    {consentDataEng.sections.map((section, idx) => (
                      <div key={idx} style={{marginBottom: '1rem'}}>
                        <h4 style={{margin: '0 0 0.5rem 0', color: '#2c3e50'}}>{section.heading}</h4>
                        {section.paragraphs.map((p, pIdx) => (
                          <p key={pIdx} style={{margin: '0 0 0.3rem 0', fontSize: '0.95rem'}}>
                            {p.strong && <strong>{p.strong} </strong>}
                            {p.text}
                          </p>
                        ))}
                      </div>
                    ))}
                 </div>
                 
                 <label className="mock-checkbox-label" style={{ marginTop: '2rem' }}>
                   <div className={`checkbox-wrapper ${demoPhase === 'checkbox-blinking' ? 'pulse-indicator' : ''}`}>
                      <input 
                        type="checkbox" 
                        checked={consentChecked} 
                        readOnly
                      />
                   </div>
                   <span style={{fontSize: '0.9rem', lineHeight: '1.4'}}>{consentDataEng.checkboxLabel}</span>
                 </label>
                 
                 <div className="demo-actions">
                   <button 
                     className={`demo-btn-primary ${demoPhase === 'button-blinking' ? 'pulse-indicator' : ''}`} 
                     disabled={!consentChecked}
                   >
                     {consentDataEng.buttonText} ➔
                   </button>
                 </div>
               </div>
            )}
          </div>
        )}

        {/* STEP 1 to N: SECTIONS */}
        {currentStep > 0 && currentStep <= formStructure.length && (
          <div className="demo-slide fade-in">
            <h2>Step {currentStep + 1}: {formStructure[currentStep - 1].title}</h2>
            <div className="mock-questionnaire-box">
               {formStructure[currentStep - 1].questions.map(q => renderQuestion(q))}
            </div>
            
            <div className="demo-actions">
              <button className="demo-btn-secondary" onClick={() => setCurrentStep(curr => curr - 1)}>
                ⬅ Previous
              </button>
              <button className="demo-btn-primary pulse-indicator" onClick={handleNext}>
                Next Section ➔
              </button>
            </div>
          </div>
        )}

        {/* FINAL STEP: RISK ASSESSMENT */}
        {currentStep === totalSteps - 1 && (
          <div className="demo-slide fade-in text-center">
             <h2>Final Step: Risk Analysis Complete</h2>
             <div className="mock-risk-dashboard">
                <div className="mock-gauge">
                  <span className="mock-gauge-number">12.4%</span>
                  <span className="mock-gauge-label">Lifetime Risk Probability</span>
                </div>
                <p className="mock-recommendation">Based on standard assessment protocols, your risk falls into the <strong>Moderate</strong> category. We recommend standard annual clinical checkups.</p>
             </div>

             <div className="demo-actions" style={{ justifyContent: 'center', marginTop: '3rem' }}>
               <button className="demo-btn-primary pulse-indicator" onClick={handleRestart}>
                 Restart Simulation ↻
               </button>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Demo;
