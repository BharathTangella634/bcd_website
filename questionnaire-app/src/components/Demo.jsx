import React, { useState, useEffect, useRef } from 'react';
import './Demo.css';
import { useTranslation } from 'react-i18next';
import demoContent from '../../public/locales/english/demo_content.json' with { type: 'json' };
import thankYouDataJson from '../../public/locales/english/thankyou.json' with { type: 'json' };
import { CheckCircle, Info } from 'lucide-react';

const Demo = () => {
  const { t, ready, i18n } = useTranslation(['consent', 'questionnaire', 'thankyou', 'demo']);
  const { t: tThankYou } = useTranslation('thankyou');
  const [currentStep, setCurrentStep] = useState(0); 
  const [demoPhase, setDemoPhase] = useState('init');
  const [consentChecked, setConsentChecked] = useState(false);
  const [langSelected, setLangSelected] = useState('');
  const [activeHighlight, setActiveHighlight] = useState(null);
  const [focusedQuestion, setFocusedQuestion] = useState(null);
  const [typedValues, setTypedValues] = useState({});
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [simulationKey, setSimulationKey] = useState(0); // For forcing restart
  const scrollRef = useRef(null);

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Helper from ThankYou.jsx
  const getRiskLevel = (score, tFunc) => {
    const rows = tFunc('interpretation.data', { returnObjects: true });
    const levels = Array.isArray(rows) ? rows.map(r => r.level) : ["No Risk", "Low Risk", "Moderate Risk", "High Risk"];
    const numScore = parseFloat(score);
    if (isNaN(numScore)) return null;
    if (numScore < 0.4004) return levels[0];
    if (numScore >= 0.4004 && numScore < 0.574) return levels[1];
    if (numScore >= 0.574 && numScore < 0.795) return levels[2];
    if (numScore >= 0.795) return levels[3];
    return null;
  };

  const goldenPath = demoContent.golden_path;
  const highlights = demoContent.walkthrough;
  const mockRiskResult = 82; 
  const score = (mockRiskResult / 100).toFixed(2);
  const userRiskLevel = getRiskLevel(score, tThankYou);
  
  // Explicitly reference namespaces to avoid confusion
  const thankYouData = ready ? t('thankyou:interpretation.data', { returnObjects: true }) : [];
  const highlightedRow = Array.isArray(thankYouData) ? thankYouData.find(row => row.level === userRiskLevel) : null;
  
  const formStructure = ready ? t('questionnaire:formStructure', { returnObjects: true }) : [];
  const questionsDict = ready ? t('questionnaire:questions', { returnObjects: true }) : {};
  const consentData = ready ? {
    title: t('consent:title'),
    header: t('consent:header', { returnObjects: true }),
    sections: t('consent:sections', { returnObjects: true }),
    checkboxLabel: t('consent:checkboxLabel'),
    buttonText: t('consent:buttonText')
  } : {};

  const totalSteps = (Array.isArray(formStructure) ? formStructure.length : 0) + 2; 

  const typeValue = async (key, value, isMounted) => {
    if (!isMounted()) return;
    if (typeof value !== 'string' || !value) {
        setTypedValues(prev => ({...prev, [key]: value}));
        return;
    }
    let current = '';
    for (let i = 0; i < value.length; i++) {
        if (!isMounted()) return;
        current += value[i];
        setTypedValues(prev => ({...prev, [key]: current}));
        await sleep(40);
    }
  };

  useEffect(() => {
    if (!ready) return;

    let isMounted = true;
    const checkMounted = () => isMounted;

    const runSimulation = async () => {
      // Step 0: Consent & Language Initialization
      setDemoPhase('init');
      setCurrentStep(0);
      setFocusedQuestion('consent-section');
      setActiveHighlight(highlights.consent);
      if (!checkMounted()) return;
      await sleep(1500);

      // Language Switcher Walkthrough
      setActiveHighlight(highlights.lang_support);
      setDemoPhase('lang-dropdown-open');
      await sleep(1500);
      setLangSelected('English');
      setDemoPhase('lang-selected');
      await sleep(1500);
      setActiveHighlight(highlights.consent);

      // Scroll Consent
      setDemoPhase('consent-scrolling');
      const el = scrollRef.current;
      if (el) {
         const distance = el.scrollHeight - el.clientHeight;
         const scrollSteps = 60;
         const stepMs = 3000 / scrollSteps;
         const stepAmt = distance / scrollSteps;
         for (let i = 0; i < scrollSteps; i++) {
            if (!checkMounted()) return;
            el.scrollTop += stepAmt;
            await sleep(stepMs);
         }
      }
      await sleep(500);

      // Check Consent
      setDemoPhase('checkbox-blinking');
      await sleep(800);
      setConsentChecked(true);
      setDemoPhase('button-blinking');
      await sleep(1200);
      
      // Move to Questionnaire with Recursive Visibility
      setDemoPhase('simulating');
      
      const getVisibleQuestions = () => {
          const visible = [];
          const traverse = (questions) => {
              questions.forEach(q => {
                  const qKey = q.key;
                  if (q.condition) {
                      const parentVal = goldenPath[q.condition.key];
                      if (parentVal !== q.condition.value) return;
                  }
                  visible.push(q);
                  if (q.subQuestions) traverse(q.subQuestions);
              });
          };
          formStructure.forEach(section => traverse(section.questions));
          return visible;
      };

      const visibleQueue = getVisibleQuestions();
      const totalStepsInQueue = visibleQueue.length;

      for (let i = 0; i < totalStepsInQueue; i++) {
        if (!checkMounted()) return;
        
        const qNode = visibleQueue[i];
        const qKey = qNode.key;
        const targetVal = goldenPath[qKey];

        // Find which section this question belongs to for title rendering
        const sectionIdx = formStructure.findIndex(s => 
            s.questions.some(sq => sq.key === qKey || (sq.subQuestions && sq.subQuestions.some(ssq => ssq.key === qKey)))
        );
        setCurrentStep(sectionIdx + 1);

        setFocusedQuestion(qKey);
        setActiveHighlight(highlights[qKey] || null);
        
        // Slower typing for critical sub-questions to ensure user has time to read
        const isSubQuestion = qNode.condition;
        const typingDelay = isSubQuestion ? 1200 : 800;
        const postTypingDelay = isSubQuestion ? 1500 : 1000;

        await sleep(typingDelay);
        await typeValue(qKey, targetVal, checkMounted);
        await sleep(postTypingDelay);
      }

      // Final Step: Risk Result
      if (!checkMounted()) return;
      setCurrentStep(totalSteps - 1);
      setFocusedQuestion('risk-result');
      setActiveHighlight(highlights.risk_result);
    };

    if (isAutoPlaying) {
        runSimulation();
    }

    return () => { isMounted = false; };
  }, [ready, isAutoPlaying, simulationKey]); 

  const handleRestart = () => {
    setCurrentStep(0);
    setConsentChecked(false);
    setTypedValues({});
    setFocusedQuestion(null);
    setActiveHighlight(null);
    setIsAutoPlaying(true);
    setSimulationKey(prev => prev + 1); // Trigger useEffect
    setDemoPhase('init');
  };

  const skipToResult = () => {
    setIsAutoPlaying(false);
    setCurrentStep(totalSteps - 1);
    setFocusedQuestion('risk-result');
    setActiveHighlight(highlights.risk_result);
  };

  const renderTooltip = (key) => {
    if (focusedQuestion === key && activeHighlight) {
        return (
            <div className="demo-context-tooltip fade-in">
                <div className="tooltip-header">
                    <Info size={16} />
                    <span>{activeHighlight.title}</span>
                </div>
                <div className="tooltip-body">
                    {activeHighlight.highlight}
                </div>
                <div className="tooltip-arrow"></div>
            </div>
        );
    }
    return null;
  };

  const Riskometer = ({ riskLevel }) => {
    const [needleRotation, setNeedleRotation] = useState(-90); // Start position (far left)
    
    useEffect(() => {
        const timer = setTimeout(() => {
            // Angles relative to a -90 to +90 arc
            const angles = {
                "No Risk": -67.5,
                "Low Risk": -22.5,
                "Moderate Risk": 22.5,
                "High Risk": 67.5
            };
            setNeedleRotation(angles[riskLevel] || 67.5);
        }, 800);
        return () => clearTimeout(timer);
    }, [riskLevel]);

    return (
        <div className="riskometer-container fade-in">
            <div className="riskometer-gauge">
                <div className="gauge-background"></div>
                <div className="riskometer-needle" style={{ transform: `rotate(${needleRotation}deg)` }}></div>
                <div className="riskometer-center"></div>
            </div>
            <div className="gauge-labels">
                <span className={riskLevel === "No Risk" ? "active-level" : ""}>No</span>
                <span className={riskLevel === "Low Risk" ? "active-level" : ""}>Low</span>
                <span className={riskLevel === "Moderate Risk" ? "active-level" : ""}>Mod</span>
                <span className={riskLevel === "High Risk" ? "active-level" : ""}>High</span>
            </div>
        </div>
    );
  };

  const IndiaMap = ({ selectedState }) => {
    // Simplified SVG paths for major regions of India
    return (
        <div className="india-map-container">
            <svg viewBox="0 0 400 450" className="india-svg">
                <path d="M150,10 L180,30 L200,80 L180,120 L140,140 L120,100 L110,50 Z" className="map-region north" />
                <path d="M140,140 L180,120 L220,160 L240,220 L200,280 L150,260 L120,200 Z" className="map-region center" />
                <path d="M150,260 L200,280 L190,350 L160,420 L120,430 L90,380 L110,320 Z" className={`map-region south ${selectedState === 'Karnataka' ? 'highlighted pulse-teal' : ''}`} />
                <path d="M120,100 L140,140 L120,200 L80,220 L40,180 L50,120 Z" className="map-region west" />
                <path d="M220,160 L260,140 L300,160 L350,200 L340,250 L280,280 L240,220 Z" className="map-region east" />
                <circle cx="150" cy="330" r="8" className="state-marker karnataka fade-in" />
            </svg>
            <div className="map-label">Karnataka selected</div>
        </div>
    );
  };

  const renderMockInput = (qNode) => {
    const qData = questionsDict[qNode.key];
    if (!qData) return null;
    const value = typedValues[qNode.key];

    // Special Case: India Map for states
    if (qNode.key === 'Q4') {
        return <IndiaMap selectedState={value} />;
    }

    // Special Case: Gender Icons
    if (qNode.key === 'Q47') {
        return (
            <div className="mock-gender-grid">
                <div className={`gender-icon-box ${value === 'Female' ? 'selected pulse-teal' : ''}`}>
                    <div className="icon">
                        <svg viewBox="0 0 24 24" width="36" height="36" fill="#ec4899">
                            <path d="M13.94 8.31C13.62 7.52 12.85 7 12 7s-1.62.52-1.94 1.31L7 16h3v6h4v-6h3l-3.06-7.69zM12 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
                        </svg>
                    </div>
                    <span>Female</span>
                </div>
                <div className={`gender-icon-box ${value === 'Male' ? 'selected pulse-teal' : ''}`}>
                    <div className="icon">
                        <svg viewBox="0 0 24 24" width="36" height="36" fill="#3b82f6">
                            <path d="M14 7h-4c-1.1 0-2 .9-2 2v6h2v7h4v-7h2V9c0-1.1-.9-2-2-2zM12 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
                        </svg>
                    </div>
                    <span>Male</span>
                </div>
            </div>
        );
    }

    // Universal Yes/No Icons alongside regular options
    if ((qNode.type === 'radio' || qNode.type === 'select') && qData.answers && (qData.answers.includes('Yes') || qData.answers.includes('No'))) {
        return (
            <div className="mock-binary-icons" style={{ flexWrap: 'wrap' }}>
               {qData.answers.map((ans, idx) => {
                   const isSelected = value === ans;
                   if (ans === 'Yes') {
                       return (
                           <div key={idx} className={`binary-icon-box yes ${isSelected ? 'selected pulse-teal' : ''}`}>
                               <CheckCircle size={24} />
                               <span>Yes</span>
                           </div>
                       );
                   } else if (ans === 'No') {
                       return (
                           <div key={idx} className={`binary-icon-box no ${isSelected ? 'selected pulse-teal' : ''}`}>
                               <div className="close-icon-wrap">✕</div>
                               <span>No</span>
                           </div>
                       );
                   } else {
                       return (
                           <label key={idx} className={`mock-radio-label ${isSelected ? 'mock-selected pulse-teal' : ''}`}>
                             <input type="radio" checked={isSelected} readOnly />
                             <span>{ans}</span>
                           </label>
                       );
                   }
               })}
            </div>
        );
    }

    if ((qNode.type === 'radio' || qNode.type === 'select') && qData.answers) {
      return (
        <div className="mock-options">
          {qData.answers.map((ans, idx) => {
            const isSelected = value === ans;
            return (
                <label key={idx} className={`mock-radio-label ${isSelected ? 'mock-selected pulse-teal' : ''}`}>
                  <input type="radio" checked={isSelected} readOnly />
                  <span>{ans}</span>
                </label>
            );
          })}
        </div>
      );
    } else if (qNode.type === 'number' || qNode.type === 'text' || qNode.type === 'select-plus-text') {
       return (
         <div className="mock-input-wrapper">
           <input type="text" className={`mock-text-input ${value ? 'has-value' : ''}`} value={value || ''} readOnly placeholder="Filling..." />
         </div>
       );
    } else if (qNode.type === 'checkbox') {
        const selectedArr = Array.isArray(value) ? value : [];
        return (
            <div className="mock-options">
                {qData.answers.map((ans, idx) => {
                    const isSelected = selectedArr.includes(ans);
                    return (
                        <label key={idx} className={`mock-checkbox-label ${isSelected ? 'mock-selected pulse-teal' : ''}`}>
                            <input type="checkbox" checked={isSelected} readOnly />
                            <span>{ans}</span>
                        </label>
                    );
                })}
            </div>
        );
    }
    return null;
  };

  const renderQuestion = (qNode, depth = 0) => {
    const questionText = questionsDict[qNode.key]?.question || qNode.key;
    const isFocused = focusedQuestion === qNode.key;
    
    // In recursive walkthrough, we only want to show the question if it's already "reached"
    // or if we are currently focusing it. But for the single-column scrolling effect,
    // we show it if it has a value or is focused.
    const hasValue = typedValues[qNode.key] !== undefined;
    if (!hasValue && !isFocused) return null;

    return (
      <div key={qNode.key} className={`demo-question fade-in ${isFocused ? 'focused' : ''}`} style={{ marginLeft: `${depth * 20}px` }}>
        {isFocused && renderTooltip(qNode.key)}
        <div className="demo-question-text">{questionText}</div>
        <div className="demo-question-input">
           {renderMockInput(qNode)}
        </div>
        
        {/* Specific alert under Q27 if "No" is selected */}
        {qNode.key === 'Q27' && typedValues['Q27'] === 'No' && (
            <div className="demo-special-alert fade-in" style={{ marginTop: '1rem', marginBottom: '0' }}>
                <Info size={18} />
                <p>Since "No" was selected for prior Breast Examination, the tour highlights the <strong>Video-Guided Self Breast Examination</strong> prompt.</p>
            </div>
        )}

        {qNode.subQuestions && qNode.subQuestions.length > 0 && (
          <div className="demo-subquestions">
             {qNode.subQuestions.map(subQ => renderQuestion(subQ, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (!ready) return <div className="demo-loading">Preparing Guided Tour...</div>;

  return (
    <div className="demo-page-wrapper">
      {currentStep < totalSteps - 1 && (
        <div className="demo-progress-bar">
            <div className="demo-progress-fill" style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}></div>
        </div>
      )}

      <div className="demo-main-single-column">
        <div className="demo-content-card">
          <div className="demo-card-header">
            <div className="demo-header-brands">
              <img src="/tanuh.png" alt="Tanuh" className="brand-logo" />
              <div className="brand-divider"></div>
              <img src="/IISc_logo.png" alt="IISc" className="brand-logo" />
              <div className="brand-divider"></div>
              <img src="/moe.png" alt="MoE" className="brand-logo" />
            </div>
          </div>

          <div className="demo-step-box">
            {/* STEP 0: CONSENT */}
            {currentStep === 0 && (
              <div className="demo-step-content fade-in consent-demo-view">
                <div className="demo-step-nav-header demo-step-nav-header-consent">
                  <h2>AI enabled Breast Cancer Risk Prediction Tool</h2>
                  <div className="demo-mock-lang">
                    <div className="lang-trigger">
                         🌐 {langSelected || 'Select Language...'}
                    </div>
                    {(demoPhase === 'lang-dropdown-open' || demoPhase === 'lang-selected') && (
                      <div className={`mock-lang-dropdown ${demoPhase === 'lang-dropdown-open' ? 'open' : ''}`}>
                             <div className={`mock-lang-item ${langSelected === 'English' ? 'active' : ''}`}>English</div>
                             <div className="mock-lang-item">ಕನ್ನಡ (Kannada)</div>
                             <div className="mock-lang-item">हिंदी (Hindi)</div>
                             <div className="mock-lang-item">தமிழ் (Tamil)</div>
                             <div className="mock-lang-item">Telugu / Bengali...</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="consent-scroll-container" ref={scrollRef}>
                    <div className="consent-header-info">
                        {/* Removed Study Title reference here to emphasize Risk Prediction Tool as requested */}
                        <p><strong>Sponsor/Institution:</strong> {consentData.header?.sponsor}</p>
                        <p><strong>IEC Approval No.:</strong> {consentData.header?.iecApproval}</p>
                    </div>

                    {consentData.sections?.map((section, idx) => (
                        <div key={idx} className={section.className || 'consent-section-demo'}>
                            {focusedQuestion === 'consent-section' && idx === 0 && renderTooltip('consent-section')}
                            <h3>{section.heading}</h3>
                            {section.paragraphs?.map((para, pIdx) => (
                                <p key={pIdx} className={para.className || ''}>
                                    {para.strong && <strong>{para.strong} </strong>}
                                    {para.text}
                                </p>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="demo-consent-bottom">
                  <label className={`mock-check-lbl ${demoPhase === 'checkbox-blinking' ? 'pulse-teal' : ''}`}>
                    <input type="checkbox" checked={consentChecked} readOnly />
                    <span>{consentData.checkboxLabel}</span>
                  </label>
                  <button className={`btn-premium ${demoPhase === 'button-blinking' ? 'pulse-teal' : ''}`} disabled={!consentChecked}>
                    {consentData.buttonText}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 1..N: QUESTIONNAIRE */}
            {currentStep > 0 && currentStep <= formStructure.length && (
              <div className="demo-step-content fade-in">
                <div className="demo-step-nav-header">
                  <h2>{formStructure[currentStep - 1].title}</h2>
                  <span className="demo-badge">Guided Tour</span>
                </div>

                <div className="demo-questions-viewport">
                   {formStructure[currentStep - 1].questions.map(q => renderQuestion(q))}
                </div>
              </div>
            )}

            {/* FINAL STEP: RISK ASSESSMENT */}
            {currentStep === totalSteps - 1 && (
              <div className="demo-step-content fade-in thank-you-dialog">
                {renderTooltip('risk-result')}
                <div className="demo-result-header-centered">
                  <div className="thank-you-header">
                    <CheckCircle className="success-icon" size={48} /> 
                    <h3>Submission Complete</h3>
                  </div>
                  <p className="demo-thank-you-msg">Thank you for completing the questionnaire!</p>
                  
                  <div className="demo-risk-status-hero">
                    <h2 className="risk-status-text">{userRiskLevel}</h2>
                  </div>
                </div>

                <Riskometer riskLevel={userRiskLevel} />

                <div className="what-to-do-container">
                  <h4 className="what-to-do-title">{tThankYou('interpretation.headers.action')}</h4>
                  {highlightedRow ? (
                    <div className="what-to-do-box">
                      <p className="what-to-do-text">{highlightedRow.action}</p>
                    </div>
                  ) : (
                    <p className="no-data-text">{tThankYou('noActionData', { defaultValue: 'No specific action available.' })}</p>
                  )}
                </div>

                <p className="disclaimer-text">
                  <span className="disclaimer-asterisk">{tThankYou('disclaimer.asterisk')}</span>
                  <strong>{tThankYou('disclaimer.title')}</strong>:
                  {' '}{tThankYou('disclaimer.text')}
                </p>

                <div className="demo-footer-actions" style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%', alignItems: 'center' }}>
                    <button className="btn-secondary" style={{ width: '100%' }} onClick={handleRestart}>Restart Tour ↻</button>
                    <button className="btn-premium" style={{ width: '100%' }} disabled>Download Results PDF ⬇</button>
                </div>
              </div>
            )}
          </div>

          {currentStep < totalSteps - 1 && (
            <div className="demo-bottom-controls">
               <button className="btn-ghost" onClick={skipToResult}>Skip to Result ➔</button>
               <div className="auto-play-indicator">
                   <div className="pulse-dot"></div>
                   {isAutoPlaying ? 'Guided Tour in Progress...' : 'Tour Paused'}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Demo;
