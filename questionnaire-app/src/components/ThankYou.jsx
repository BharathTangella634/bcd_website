

// import React from 'react';
// import './ThankYou.css';
// import { formStructure } from './Questionnaire';
// import jsPDF from 'jspdf';
// import { Download, CheckCircle } from 'lucide-react';

// // Data for the interpretation table
// const riskInterpretationData = [
//     { level: "Normal Risk", range: "Below 0.4004", meaning: "Your risk is lower than most women (below the 50th percentile).", action: "Keep up with routine checkups, like yearly breast exams by a doctor from 30 years of age." },
//     { level: "Moderate Risk", range: "0.4004 to 0.574", meaning: "Your risk is average or slightly higher (50th to 75th percentile).", action: "Consider breast exams every 6 months from 30 years of age and talk to your doctor about prevention." },
//     { level: "High Risk", range: "0.574 to 0.795", meaning: "Your risk is higher (75th to 95th percentile).", action: "Get breast exams every 4-6 months from 25 years of age and possibly imaging (like mammograms) as advised by your doctor." },
//     { level: "Very High Risk", range: "0.795 and above", meaning: "Your risk is very high (top 5% of women).", action: "Be extra vigilant with breast exams every 4 months from at least 25 years of age and more frequent imaging as per your doctor's advice." },
// ];

// // Helper function to determine the risk level based on the score
// const getRiskLevel = (score) => {
//     const numScore = parseFloat(score);
//     if (isNaN(numScore)) return null;
//     if (numScore < 0.4004) return "Normal Risk";
//     if (numScore >= 0.4004 && numScore < 0.574) return "Moderate Risk";
//     if (numScore >= 0.574 && numScore < 0.795) return "High Risk";
//     if (numScore >= 0.795) return "Very High Risk";
//     return null;
// };


// function ThankYou({ riskResult, formData, questionnaireData }) {

//     const score = riskResult !== null ? (parseFloat(riskResult) / 100).toFixed(2) : null;
//     const userRiskLevel = score !== null ? getRiskLevel(score) : null;

//     const handleDownloadPdf = () => {
//         if (!formData) {
//             alert('Form data is not available to generate a PDF.');
//             return;
//         }

//         const doc = new jsPDF();
//         const pageWidth = doc.internal.pageSize.getWidth();
//         const pageHeight = doc.internal.pageSize.getHeight();
//         const margin = 15;
//         let y = 0;

//         const themeColor = [98, 0, 238];
//         const highlightColor = [255, 249, 230]; // Light Yellow for table row highlight

//         const sanitizeText = (text) => {
//             if (!text) return '';
//             return text.replace(/₹/g, 'Rs.').replace(/\s+/g, ' ').trim();
//         };

//         const addHeader = () => {
//             doc.setFillColor(242, 237, 255);
//             doc.rect(0, 0, margin + 5, pageHeight, 'F');
//             doc.setFont('helvetica', 'bold');
//             doc.setFontSize(14);
//             doc.setTextColor(40, 40, 40);
//             doc.text('Your Breast Cancer Risk Assessment Summary', margin + 10, 18);
//             doc.setDrawColor(...themeColor);
//             doc.setLineWidth(0.4);
//             doc.line(margin + 10, 20, pageWidth - margin, 20);
//             y = 32;
//         };

//         const addFooter = (pageNumber, totalPages) => {
//             doc.setFont('helvetica', 'normal');
//             doc.setFontSize(8);
//             doc.setTextColor(150);
//             const footerText = `Page ${pageNumber} | Generated: ${new Date().toLocaleDateString()}`;
//             doc.text(footerText, pageWidth / 2, pageHeight - 8, { align: 'center' });
//         };

//         const addPageWithTemplate = () => {
//            const currentPage = doc.internal.getNumberOfPages();
//            const totalPagesGuess = currentPage + 1;
//            addFooter(currentPage, totalPagesGuess);
//            doc.addPage();
//            addHeader();
//         };

//         const renderSectionHeader = (title) => {
//             if (y > pageHeight - 30) addPageWithTemplate();
//             y += 10;
//             doc.setFontSize(13);
//             doc.setFont('helvetica', 'bold');
//             doc.setTextColor(...themeColor);
//             doc.text(title, margin + 10, y);
//             y += 10;
//         };

//         // --- CORRECTED Q&A Rendering Logic ---
//         const renderQAPair = (questionObject, answerText) => {
//             const qaMargin = margin + 15;
//             const boxX = margin + 10;
//             const boxWidth = pageWidth - (margin * 2) - 10;
//             const textWidth = boxWidth - 16; // Available width for text (box padding 8 left/right)

//             // Sanitize inputs
//             const questionTitleAndBody = sanitizeText(`${questionObject.title || ''} ${questionObject.text || ''}`);
//             // Prepend "A: " to the answer
//             const answer = sanitizeText(`A: ${answerText || ''}`);

//             // Set font sizes BEFORE splitting text
//             const questionFontSize = 9; // Use one size for the whole question part
//             const answerFontSize = 9;

//             doc.setFont('helvetica', 'bold'); // Question is bold
//             doc.setFontSize(questionFontSize);
//             const questionLines = doc.splitTextToSize(questionTitleAndBody, textWidth);
//             const questionHeight = doc.getTextDimensions(questionLines, {fontSize: questionFontSize}).h;

//             doc.setFont('helvetica', 'normal'); // Answer is normal
//             doc.setFontSize(answerFontSize);
//             const answerLines = doc.splitTextToSize(answer, textWidth - 5); // Indent answer slightly
//             const answerHeight = doc.getTextDimensions(answerLines, {fontSize: answerFontSize}).h;

//             const boxPaddingVertical = 8;
//             const spaceBetweenQA = 4; // Space between question and answer text

//             // Calculate total height needed INSIDE the box
//             const contentHeight = questionHeight + spaceBetweenQA + answerHeight;
//             const totalBoxHeight = contentHeight + (boxPaddingVertical * 2);

//             // Check for page break BEFORE drawing anything
//             if (y + totalBoxHeight > pageHeight - 20) {
//                 addPageWithTemplate();
//             }

//             // Draw the Q&A box
//             doc.setFillColor(253, 253, 253);
//             doc.setDrawColor(225, 225, 225);
//             doc.setLineWidth(0.2);
//             doc.roundedRect(boxX, y, boxWidth, totalBoxHeight, 3, 3, 'FD');

//             let textY = y + boxPaddingVertical; // Start text with top padding

//             // Render Question Text (Title + Body together, bold)
//             doc.setFont('helvetica', 'bold');
//             doc.setFontSize(questionFontSize);
//             doc.setTextColor(50, 50, 50);
//             doc.text(questionLines, qaMargin, textY + 3); // Adjust Y slightly for baseline
//             textY += questionHeight + spaceBetweenQA;

//             // Render Answer Text (Normal, with A: prefix)
//             doc.setFont('helvetica', 'normal'); // Ensure answer is normal font
//             doc.setFontSize(answerFontSize);
//             doc.setTextColor(80, 80, 80);
//             doc.text(answerLines, qaMargin + 5, textY + 3); // Indent answer, adjust Y

//             y += totalBoxHeight + 8; // Move y past the current box with margin
//         };


//         // --- START PDF GENERATION ---
//         addHeader();

//         // --- 1. RENDER RISK SCORE --- (Unchanged)
//         if (score !== null) {
//           doc.setFillColor(240, 230, 255);
//           doc.roundedRect(margin + 10, y, pageWidth - (margin * 2) - 10, 22, 3, 3, 'F');
//           doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(40, 40, 40);
//           doc.text('Risk Score:', margin + 15, y + 13);
//           doc.setFontSize(20); doc.setTextColor(...themeColor);
//           doc.text(`${score}`, pageWidth - margin - 15, y + 15, { align: 'right' });
//           y += 32;
//         }

//         // --- 2. RENDER INTERPRETATION TABLE (With Highlighting) ---
//          if (score !== null) {
//              if (y > pageHeight - 60) addPageWithTemplate();
//              renderSectionHeader("What Your Risk Score Means");

//              const tableStartY = y;
//              const cellPadding = 3;
//              const headerFontSize = 9;
//              const rowFontSize = 7.5;
//              const colWidths = [35, 30, (pageWidth - margin*2 - 10 - 35 - 30) / 2, (pageWidth - margin*2 - 10 - 35 - 30) / 2 ];
//              const tableWidth = colWidths.reduce((a, b) => a + b, 0);
//              const tableX = margin + 10;

//              doc.setFont('helvetica', 'bold'); doc.setFontSize(headerFontSize);
//              doc.setFillColor(230, 230, 250); doc.setTextColor(40, 40, 40);
//              doc.setDrawColor(180, 180, 180); doc.setLineWidth(0.2);
//              doc.rect(tableX, y, tableWidth, 9, 'FD');

//              let currentX = tableX + cellPadding;
//              const headerY = y + 6;
//              doc.text('Risk Level', currentX, headerY); currentX += colWidths[0];
//              doc.text('Score Range', currentX, headerY); currentX += colWidths[1];
//              doc.text('What It Means', currentX, headerY); currentX += colWidths[2];
//              doc.text('What To Do', currentX, headerY);
//              y += 9;

//              riskInterpretationData.forEach((row, index) => {
//                  const levelLines = doc.splitTextToSize(row.level, colWidths[0] - cellPadding * 2);
//                  const rangeLines = doc.splitTextToSize(row.range, colWidths[1] - cellPadding * 2);
//                  const meaningLines = doc.splitTextToSize(row.meaning, colWidths[2] - cellPadding * 2);
//                  const actionLines = doc.splitTextToSize(row.action, colWidths[3] - cellPadding * 2);

//                  const levelHeight = doc.getTextDimensions(levelLines, {fontSize: rowFontSize}).h;
//                  const rangeHeight = doc.getTextDimensions(rangeLines, {fontSize: rowFontSize}).h;
//                  const meaningHeight = doc.getTextDimensions(meaningLines, {fontSize: rowFontSize}).h;
//                  const actionHeight = doc.getTextDimensions(actionLines, {fontSize: rowFontSize}).h;
//                  const rowHeight = Math.max(levelHeight, rangeHeight, meaningHeight, actionHeight) + (cellPadding * 2);

//                  if (y + rowHeight > pageHeight - 20) {
//                      addPageWithTemplate();
//                      // Redraw header on new page
//                      doc.setFont('helvetica', 'bold'); doc.setFontSize(headerFontSize); doc.setFillColor(230, 230, 250); doc.setTextColor(40, 40, 40);
//                      doc.setDrawColor(180, 180, 180); doc.setLineWidth(0.2);
//                      doc.rect(tableX, y, tableWidth, 9, 'FD');
//                      currentX = tableX + cellPadding;
//                      doc.text('Risk Level', currentX, y + 6); currentX += colWidths[0];
//                      doc.text('Score Range', currentX, y + 6); currentX += colWidths[1];
//                      doc.text('What It Means', currentX, y + 6); currentX += colWidths[2];
//                      doc.text('What To Do', currentX, y + 6);
//                      y += 9;
//                  }

//                  const isHighlighted = row.level === userRiskLevel;
//                  if (isHighlighted) {
//                      doc.setFillColor(highlightColor[0], highlightColor[1], highlightColor[2]); // Set highlight fill
//                      doc.rect(tableX, y, tableWidth, rowHeight, 'F'); // Draw highlight background
//                  } else if (index % 2 !== 0) { // Keep alternating row color if not highlighted
//                      doc.setFillColor(250, 250, 250);
//                      doc.rect(tableX, y, tableWidth, rowHeight, 'F');
//                  }

//                  doc.setTextColor(isHighlighted ? 60 : 80, isHighlighted ? 60 : 80, isHighlighted ? 60 : 80);
//                  doc.setFont('helvetica', 'normal');
//                  doc.setFontSize(rowFontSize);

//                  let textY = y + cellPadding + 3;
//                  currentX = tableX + cellPadding;

//                  doc.setFont('helvetica', (isHighlighted ? 'bold' : 'bold')); // Level is always bold
//                  doc.text(levelLines, currentX, textY);
//                  currentX += colWidths[0];

//                  doc.setFont('helvetica', (isHighlighted ? 'bold' : 'normal')); // Optionally bold highlighted row text
//                  doc.text(rangeLines, currentX, textY);
//                  currentX += colWidths[1];
//                  doc.text(meaningLines, currentX, textY);
//                  currentX += colWidths[2];
//                  doc.text(actionLines, currentX, textY);

//                  doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.1);
//                  doc.rect(tableX, y, tableWidth, rowHeight);
//                  let lineX = tableX;
//                  for (let i = 0; i < colWidths.length; i++) {
//                    lineX += colWidths[i];
//                    if (i < colWidths.length - 1) {
//                      doc.line(lineX, y, lineX, y + rowHeight);
//                    }
//                  }
//                  y += rowHeight;
//              });
//              y += 10;
//          }

//         // --- NEW: ADD DISCLAIMER TEXT ---
//         // Check space before adding disclaimer (calculate its approximate height)
//         // --- ADD DISCLAIMER TEXT (Corrected for Width) ---
//         if (y > pageHeight - 40) addPageWithTemplate(); // Check space before disclaimer
//         const disclaimerX = margin + 10;
//         const disclaimerY = y + 5; // Start position for disclaimer block
//         const redColor = [224, 57, 68]; // Red for asterisk
//         const disclaimerFontSize = 9;
//         const disclaimerText = "This Report is intended for research purposes only. The Breast cancer risk assessment algorithm is currently under development and should not be considered clinically validated. For medically relevant decisions and clinically valid results, please consult a qualified clinician.";
        
//         // Draw Asterisk in Red
//         doc.setFont('helvetica', 'bold');
//         doc.setFontSize(disclaimerFontSize + 1);
//         doc.setTextColor(redColor[0], redColor[1], redColor[2]);
//         doc.text("*", disclaimerX, disclaimerY);

//         // Draw "Disclaimer:" in Bold Grey
//         doc.setFont('helvetica', 'bold');
//         doc.setFontSize(disclaimerFontSize);
//         doc.setTextColor(100, 100, 100);
//         const disclaimerLabel = "Disclaimer:";
//         const disclaimerLabelWidth = doc.getTextWidth(disclaimerLabel);
//         doc.text(disclaimerLabel, disclaimerX + 2, disclaimerY);
        
//         // Calculate the available width for the main text
//         const textStartX = disclaimerX + 2 + disclaimerLabelWidth + 2; // X position where the text will start
//         const availableTextWidth = pageWidth - textStartX - margin; // Total width from start point to right margin

//         // Draw main disclaimer text in normal grey, with correct wrapping
//         doc.setFont('helvetica', 'normal');
//         doc.setTextColor(120, 120, 120);
//         const disclaimerLines = doc.splitTextToSize(disclaimerText, availableTextWidth);
//         doc.text(disclaimerLines, textStartX, disclaimerY);
        
//         // Update y position based on the height of the wrapped text
//         const disclaimerHeight = doc.getTextDimensions(disclaimerLines, {fontSize: disclaimerFontSize}).h;
//         y += disclaimerHeight + 10; // Move y down past the disclaimer + margin
//         // --- END OF DISCLAIMER ADDITION ---

//         // --- 3. RENDER Q&A DATA (Using the corrected renderQAPair) ---
//         let mainQuestionCounter = 0;
//         formStructure.forEach((section) => {
//             const questionsToRender = [];
//             const findAnsweredQuestions = (questions, parentNumber) => {
//                 questions.forEach((qConfig, index) => {
//                     const name = qConfig.name || qConfig.key; const answer = formData[name];
//                     let displayNumber;
//                     if (parentNumber) displayNumber = `${parentNumber}${String.fromCharCode(97 + index)}`;
//                     else { mainQuestionCounter++; displayNumber = mainQuestionCounter; }
//                     if (answer !== undefined && answer !== null && answer !== '' && (!Array.isArray(answer) || answer.length > 0)) {
//                         questionsToRender.push({
//                             // Pass both title and body separately  
//                             questionObject: {
//                                 title: `Q ${displayNumber}:`,
//                                 text: questionnaireData[qConfig.key]?.question
//                             },
//                             answer: Array.isArray(answer) ? answer.join(', ') : answer.toString(),
//                         });
//                     }
//                     if (qConfig.subQuestions && qConfig.condition && formData[qConfig.condition.key] === qConfig.condition.value) {
//                         findAnsweredQuestions(qConfig.subQuestions, displayNumber);
//                     }
//                 });
//             };
//             findAnsweredQuestions(section.questions);

//             if (questionsToRender.length > 0) {
//                 renderSectionHeader(section.title);
//                 // Pass the question object and answer text to the corrected renderer
//                 questionsToRender.forEach((qa) => renderQAPair(qa.questionObject, qa.answer));
//             }
//         });

//         // Add footers to all pages (Calculate total pages AFTER generation)
//         const totalPages = doc.internal.getNumberOfPages();
//         for (let i = 1; i <= totalPages; i++) {
//             doc.setPage(i);
//             addFooter(i, totalPages);
//         }

//         doc.save('Breast-Cancer-Risk-Summary.pdf');
//     };

//     // --- JSX Return - UNCHANGED except for adding className to table row ---
//     return (
//     <div className="thank-you-overlay">
//       <div className="thank-you-dialog">
//         <button className="close-button" onClick={() => window.location.reload()}>&times;</button>
//         <div className="thank-you-header">
//           <CheckCircle className="success-icon" size={40} /> 
//           <h3>Submission Complete</h3>
//         </div>
//         <p>Thank you for completing the questionnaire!</p>
        
//         {score !== null && (
//           <div className="risk-result-container">
//             <p>Risk Score:</p>
//             <h2 className="risk-score">{score}</h2> 
//           </div>
//         )}

//         {score !== null && (
//           <div className="interpretation-container">
//             <h4>What Your Risk Score Means</h4>
//             <table className="risk-interpretation-table">
//               <thead>
//                 <tr>
//                   <th>Risk Level</th>
//                   <th>Score Range</th>
//                   <th>What It Means</th>
//                   <th>What To Do</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {riskInterpretationData.map((row, index) => (
//                   <tr 
//                     key={index} 
//                     className={row.level === userRiskLevel ? 'highlighted-risk-row' : ''}
//                   >
//                     <td>{row.level}</td>
//                     <td>{row.range}</td>
//                     <td>{row.meaning}</td>
//                     <td>{row.action}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             {/* --- NEW DISCLAIMER TEXT --- */}
//             <p className="disclaimer-text">
//               <span className="disclaimer-asterisk">*</span>
//               <strong>Disclaimer</strong>:
//                 This Report is intended for research purposes only. The Breast cancer risk assessment algorithm is currently under development and should not be considered clinically validated. For medically relevant decisions and clinically valid results, please consult a qualified clinician.
//             </p>
//           </div>
//         )}

//         <div className="action-buttons">
//           <button className="ok-button" onClick={() => window.location.reload()}>Ok</button>
//           <button className="download-button" onClick={handleDownloadPdf}>
//             <Download size={18} style={{ marginRight: '8px' }} /> 
//             Download Summary (PDF)
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ThankYou;


// Thankyou old



// import React from 'react';
// import './ThankYou.css';
// import { formStructure } from './Questionnaire';
// import jsPDF from 'jspdf';
// import { Download, CheckCircle } from 'lucide-react';

// // Data for the interpretation table
// const riskInterpretationData = [
//     { level: "Normal Risk", range: "Below 0.4004", meaning: "Your risk is lower than most women (below the 50th percentile).", action: "Keep up with routine checkups, like yearly breast exams by a doctor from 30 years of age." },
//     { level: "Moderate Risk", range: "0.4004 to 0.574", meaning: "Your risk is average or slightly higher (50th to 75th percentile).", action: "Consider breast exams every 6 months from 30 years of age and talk to your doctor about prevention." },
//     { level: "High Risk", range: "0.574 to 0.795", meaning: "Your risk is higher (75th to 95th percentile).", action: "Get breast exams every 4-6 months from 25 years of age and possibly imaging (like mammograms) as advised by your doctor." },
//     { level: "Very High Risk", range: "0.795 and above", meaning: "Your risk is very high (top 5% of women).", action: "Be extra vigilant with breast exams every 4 months from at least 25 years of age and more frequent imaging as per your doctor's advice." },
// ];

// // Helper function to determine the risk level based on the score
// const getRiskLevel = (score) => {
//     const numScore = parseFloat(score);
//     if (isNaN(numScore)) return null;
//     if (numScore < 0.4004) return "Normal Risk";
//     if (numScore >= 0.4004 && numScore < 0.574) return "Moderate Risk";
//     if (numScore >= 0.574 && numScore < 0.795) return "High Risk";
//     if (numScore >= 0.795) return "Very High Risk";
//     return null;
// };


// function ThankYou({ riskResult, formData, questionnaireData, sessionId }) {

//     const score = riskResult !== null ? (parseFloat(riskResult) / 100).toFixed(2) : null;
//     const userRiskLevel = score !== null ? getRiskLevel(score) : null;

//     const handleDownloadPdf = () => {
//         if (!formData) {
//             alert('Form data is not available to generate a PDF.');
//             return;
//         }

//         const doc = new jsPDF();
//         const pageWidth = doc.internal.pageSize.getWidth();
//         const pageHeight = doc.internal.pageSize.getHeight();
//         const margin = 15;
//         let y = 0;

//         const themeColor = [98, 0, 238];
//         const highlightColor = [255, 249, 230]; // Light Yellow for table row highlight

//         const sanitizeText = (text) => {
//             if (!text) return '';
//             return text.replace(/₹/g, 'Rs.').replace(/\s+/g, ' ').trim();
//         };

//         const addHeader = () => {
//             doc.setFillColor(242, 237, 255);
//             doc.rect(0, 0, margin + 5, pageHeight, 'F');
//             doc.setFont('helvetica', 'bold');
//             doc.setFontSize(14);
//             doc.setTextColor(40, 40, 40);
//             doc.text('Your Breast Cancer Risk Assessment Summary', margin + 10, 18);
//             doc.setDrawColor(...themeColor);
//             doc.setLineWidth(0.4);
//             doc.line(margin + 10, 20, pageWidth - margin, 20);
//             y = 32;
//         };

//         const addFooter = (pageNumber, totalPages) => {
//             doc.setFont('helvetica', 'normal');
//             doc.setFontSize(8);
//             doc.setTextColor(150);
//             const footerText = `Page ${pageNumber} | Generated: ${new Date().toLocaleDateString()}`;
//             doc.text(footerText, pageWidth / 2, pageHeight - 8, { align: 'center' });
//         };

//         const addPageWithTemplate = () => {
//            const currentPage = doc.internal.getNumberOfPages();
//            const totalPagesGuess = currentPage + 1;
//            addFooter(currentPage, totalPagesGuess);
//            doc.addPage();
//            addHeader();
//         };

//         const renderSectionHeader = (title) => {
//             if (y > pageHeight - 30) addPageWithTemplate();
//             y += 10;
//             doc.setFontSize(13);
//             doc.setFont('helvetica', 'bold');
//             doc.setTextColor(...themeColor);
//             doc.text(title, margin + 10, y);
//             y += 10;
//         };

//         // --- CORRECTED Q&A Rendering Logic ---
//         const renderQAPair = (questionObject, answerText) => {
//             const qaMargin = margin + 15;
//             const boxX = margin + 10;
//             const boxWidth = pageWidth - (margin * 2) - 10;
//             const textWidth = boxWidth - 16; // Available width for text (box padding 8 left/right)

//             // Sanitize inputs
//             const questionTitleAndBody = sanitizeText(`${questionObject.title || ''} ${questionObject.text || ''}`);
//             // Prepend "A: " to the answer
//             const answer = sanitizeText(`A: ${answerText || ''}`);

//             // Set font sizes BEFORE splitting text
//             const questionFontSize = 9; // Use one size for the whole question part
//             const answerFontSize = 9;

//             doc.setFont('helvetica', 'bold'); // Question is bold
//             doc.setFontSize(questionFontSize);
//             const questionLines = doc.splitTextToSize(questionTitleAndBody, textWidth);
//             const questionHeight = doc.getTextDimensions(questionLines, {fontSize: questionFontSize}).h;

//             doc.setFont('helvetica', 'normal'); // Answer is normal
//             doc.setFontSize(answerFontSize);
//             const answerLines = doc.splitTextToSize(answer, textWidth - 5); // Indent answer slightly
//             const answerHeight = doc.getTextDimensions(answerLines, {fontSize: answerFontSize}).h;

//             const boxPaddingVertical = 8;
//             const spaceBetweenQA = 4; // Space between question and answer text

//             // Calculate total height needed INSIDE the box
//             const contentHeight = questionHeight + spaceBetweenQA + answerHeight;
//             const totalBoxHeight = contentHeight + (boxPaddingVertical * 2);

//             // Check for page break BEFORE drawing anything
//             if (y + totalBoxHeight > pageHeight - 20) {
//                 addPageWithTemplate();
//             }

//             // Draw the Q&A box
//             doc.setFillColor(253, 253, 253);
//             doc.setDrawColor(225, 225, 225);
//             doc.setLineWidth(0.2);
//             doc.roundedRect(boxX, y, boxWidth, totalBoxHeight, 3, 3, 'FD');

//             let textY = y + boxPaddingVertical; // Start text with top padding

//             // Render Question Text (Title + Body together, bold)
//             doc.setFont('helvetica', 'bold');
//             doc.setFontSize(questionFontSize);
//             doc.setTextColor(50, 50, 50);
//             doc.text(questionLines, qaMargin, textY + 3); // Adjust Y slightly for baseline
//             textY += questionHeight + spaceBetweenQA;

//             // Render Answer Text (Normal, with A: prefix)
//             doc.setFont('helvetica', 'normal'); // Ensure answer is normal font
//             doc.setFontSize(answerFontSize);
//             doc.setTextColor(80, 80, 80);
//             doc.text(answerLines, qaMargin + 5, textY + 3); // Indent answer, adjust Y

//             y += totalBoxHeight + 8; // Move y past the current box with margin
//         };


//         // --- START PDF GENERATION ---
//         addHeader();

//         // --- 1. RENDER RISK SCORE --- (Unchanged)
//         if (score !== null) {
//           doc.setFillColor(240, 230, 255);
//           doc.roundedRect(margin + 10, y, pageWidth - (margin * 2) - 10, 22, 3, 3, 'F');
//           doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(40, 40, 40);
//           doc.text('Risk Score:', margin + 15, y + 13);
//           doc.setFontSize(20); doc.setTextColor(...themeColor);
//           doc.text(`${score}`, pageWidth - margin - 15, y + 15, { align: 'right' });
//           y += 32;
//         }

//         // --- 2. RENDER INTERPRETATION TABLE (With Highlighting) ---
//          if (score !== null) {
//              if (y > pageHeight - 60) addPageWithTemplate();
//              renderSectionHeader("What Your Risk Score Means");

//              const tableStartY = y;
//              const cellPadding = 3;
//              const headerFontSize = 9;
//              const rowFontSize = 7.5;
//              const colWidths = [35, 30, (pageWidth - margin*2 - 10 - 35 - 30) / 2, (pageWidth - margin*2 - 10 - 35 - 30) / 2 ];
//              const tableWidth = colWidths.reduce((a, b) => a + b, 0);
//              const tableX = margin + 10;

//              doc.setFont('helvetica', 'bold'); doc.setFontSize(headerFontSize);
//              doc.setFillColor(230, 230, 250); doc.setTextColor(40, 40, 40);
//              doc.setDrawColor(180, 180, 180); doc.setLineWidth(0.2);
//              doc.rect(tableX, y, tableWidth, 9, 'FD');

//              let currentX = tableX + cellPadding;
//              const headerY = y + 6;
//              doc.text('Risk Level', currentX, headerY); currentX += colWidths[0];
//              doc.text('Score Range', currentX, headerY); currentX += colWidths[1];
//              doc.text('What It Means', currentX, headerY); currentX += colWidths[2];
//              doc.text('What To Do', currentX, headerY);
//              y += 9;

//              riskInterpretationData.forEach((row, index) => {
//                  const levelLines = doc.splitTextToSize(row.level, colWidths[0] - cellPadding * 2);
//                  const rangeLines = doc.splitTextToSize(row.range, colWidths[1] - cellPadding * 2);
//                  const meaningLines = doc.splitTextToSize(row.meaning, colWidths[2] - cellPadding * 2);
//                  const actionLines = doc.splitTextToSize(row.action, colWidths[3] - cellPadding * 2);

//                  const levelHeight = doc.getTextDimensions(levelLines, {fontSize: rowFontSize}).h;
//                  const rangeHeight = doc.getTextDimensions(rangeLines, {fontSize: rowFontSize}).h;
//                  const meaningHeight = doc.getTextDimensions(meaningLines, {fontSize: rowFontSize}).h;
//                  const actionHeight = doc.getTextDimensions(actionLines, {fontSize: rowFontSize}).h;
//                  const rowHeight = Math.max(levelHeight, rangeHeight, meaningHeight, actionHeight) + (cellPadding * 2);

//                  if (y + rowHeight > pageHeight - 20) {
//                      addPageWithTemplate();
//                      // Redraw header on new page
//                      doc.setFont('helvetica', 'bold'); doc.setFontSize(headerFontSize); doc.setFillColor(230, 230, 250); doc.setTextColor(40, 40, 40);
//                      doc.setDrawColor(180, 180, 180); doc.setLineWidth(0.2);
//                      doc.rect(tableX, y, tableWidth, 9, 'FD');
//                      currentX = tableX + cellPadding;
//                      doc.text('Risk Level', currentX, y + 6); currentX += colWidths[0];
//                      doc.text('Score Range', currentX, y + 6); currentX += colWidths[1];
//                      doc.text('What It Means', currentX, y + 6); currentX += colWidths[2];
//                      doc.text('What To Do', currentX, y + 6);
//                      y += 9;
//                  }

//                  const isHighlighted = row.level === userRiskLevel;
//                  if (isHighlighted) {
//                      doc.setFillColor(highlightColor[0], highlightColor[1], highlightColor[2]); // Set highlight fill
//                      doc.rect(tableX, y, tableWidth, rowHeight, 'F'); // Draw highlight background
//                  } else if (index % 2 !== 0) { // Keep alternating row color if not highlighted
//                      doc.setFillColor(250, 250, 250);
//                      doc.rect(tableX, y, tableWidth, rowHeight, 'F');
//                  }

//                  doc.setTextColor(isHighlighted ? 60 : 80, isHighlighted ? 60 : 80, isHighlighted ? 60 : 80);
//                  doc.setFont('helvetica', 'normal');
//                  doc.setFontSize(rowFontSize);

//                  let textY = y + cellPadding + 3;
//                  currentX = tableX + cellPadding;

//                  doc.setFont('helvetica', (isHighlighted ? 'bold' : 'bold')); // Level is always bold
//                  doc.text(levelLines, currentX, textY);
//                  currentX += colWidths[0];

//                  doc.setFont('helvetica', (isHighlighted ? 'bold' : 'normal')); // Optionally bold highlighted row text
//                  doc.text(rangeLines, currentX, textY);
//                  currentX += colWidths[1];
//                  doc.text(meaningLines, currentX, textY);
//                  currentX += colWidths[2];
//                  doc.text(actionLines, currentX, textY);

//                  doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.1);
//                  doc.rect(tableX, y, tableWidth, rowHeight);
//                  let lineX = tableX;
//                  for (let i = 0; i < colWidths.length; i++) {
//                    lineX += colWidths[i];
//                    if (i < colWidths.length - 1) {
//                      doc.line(lineX, y, lineX, y + rowHeight);
//                    }
//                  }
//                  y += rowHeight;
//              });
//              y += 10;
//          }

//         // --- NEW: ADD DISCLAIMER TEXT ---
//         // Check space before adding disclaimer (calculate its approximate height)
//         // --- ADD DISCLAIMER TEXT (Corrected for Width) ---
//         if (y > pageHeight - 40) addPageWithTemplate(); // Check space before disclaimer
//         const disclaimerX = margin + 10;
//         const disclaimerY = y + 5; // Start position for disclaimer block
//         const redColor = [224, 57, 68]; // Red for asterisk
//         const disclaimerFontSize = 9;
//         const disclaimerText = "This Report is intended for research purposes only. The Breast cancer risk assessment algorithm is currently under development and should not be considered clinically validated. For medically relevant decisions and clinically valid results, please consult a qualified clinician.";
        
//         // Draw Asterisk in Red
//         doc.setFont('helvetica', 'bold');
//         doc.setFontSize(disclaimerFontSize + 1);
//         doc.setTextColor(redColor[0], redColor[1], redColor[2]);
//         doc.text("*", disclaimerX, disclaimerY);

//         // Draw "Disclaimer:" in Bold Grey
//         doc.setFont('helvetica', 'bold');
//         doc.setFontSize(disclaimerFontSize);
//         doc.setTextColor(100, 100, 100);
//         const disclaimerLabel = "Disclaimer:";
//         const disclaimerLabelWidth = doc.getTextWidth(disclaimerLabel);
//         doc.text(disclaimerLabel, disclaimerX + 2, disclaimerY);
        
//         // Calculate the available width for the main text
//         const textStartX = disclaimerX + 2 + disclaimerLabelWidth + 2; // X position where the text will start
//         const availableTextWidth = pageWidth - textStartX - margin; // Total width from start point to right margin

//         // Draw main disclaimer text in normal grey, with correct wrapping
//         doc.setFont('helvetica', 'normal');
//         doc.setTextColor(120, 120, 120);
//         const disclaimerLines = doc.splitTextToSize(disclaimerText, availableTextWidth);
//         doc.text(disclaimerLines, textStartX, disclaimerY);
        
//         // Update y position based on the height of the wrapped text
//         const disclaimerHeight = doc.getTextDimensions(disclaimerLines, {fontSize: disclaimerFontSize}).h;
//         y += disclaimerHeight + 10; // Move y down past the disclaimer + margin
//         // --- END OF DISCLAIMER ADDITION ---

//         // --- 3. RENDER Q&A DATA (Using the corrected renderQAPair) ---
//         let mainQuestionCounter = 0;
//         formStructure.forEach((section) => {
//             const questionsToRender = [];
//             const findAnsweredQuestions = (questions, parentNumber) => {
//                 questions.forEach((qConfig, index) => {
//                     const name = qConfig.name || qConfig.key; const answer = formData[name];
//                     let displayNumber;
//                     if (parentNumber) displayNumber = `${parentNumber}${String.fromCharCode(97 + index)}`;
//                     else { mainQuestionCounter++; displayNumber = mainQuestionCounter; }
//                     if (answer !== undefined && answer !== null && answer !== '' && (!Array.isArray(answer) || answer.length > 0)) {
//                         questionsToRender.push({
//                             // Pass both title and body separately  
//                             questionObject: {
//                                 title: `Q ${displayNumber}:`,
//                                 text: questionnaireData[qConfig.key]?.question
//                             },
//                             answer: Array.isArray(answer) ? answer.join(', ') : answer.toString(),
//                         });
//                     }
//                     if (qConfig.subQuestions && qConfig.condition && formData[qConfig.condition.key] === qConfig.condition.value) {
//                         findAnsweredQuestions(qConfig.subQuestions, displayNumber);
//                     }
//                 });
//             };
//             findAnsweredQuestions(section.questions);

//             if (questionsToRender.length > 0) {
//                 renderSectionHeader(section.title);
//                 // Pass the question object and answer text to the corrected renderer
//                 questionsToRender.forEach((qa) => renderQAPair(qa.questionObject, qa.answer));
//             }
//         });

//         // Add footers to all pages (Calculate total pages AFTER generation)
//         const totalPages = doc.internal.getNumberOfPages();
//         for (let i = 1; i <= totalPages; i++) {
//             doc.setPage(i);
//             addFooter(i, totalPages);
//         }

//         // doc.save('Breast-Cancer-Risk-Summary.pdf');
//         doc.save(`Risk-Summary-${sessionId || 'UnknownSession'}.pdf`);
//     };

//     // --- JSX Return ---
//     return (
//     <div className="thank-you-overlay">
//       <div className="thank-you-dialog">
//         {/* <img src="/tanuh.png" alt="TANUH Logo" className="logo tanuh-logo" />

//         <img src="/IISc_logo.png" alt="IISC Logo" className="logo iisc-logo" /> */}




//         <button className="close-button" onClick={() => window.location.reload()}>&times;</button>
//         <div className="thank-you-header">
//           <CheckCircle className="success-icon" size={40} /> 
//           <h3>Submission Complete</h3>
//         </div>
//         <p>Thank you for completing the questionnaire!</p>
        
//         {score !== null && (
//           <div className="risk-result-container">
//             <p>Risk Score:</p>
//             <h2 className="risk-score">{score}</h2> 
//           </div>
//         )}

//         {score !== null && (
//           <div className="interpretation-container">
//             <h4>What Your Risk Score Means</h4>
//             <table className="risk-interpretation-table">
//               <thead>
//                 <tr>
//                   <th>Risk Level</th>
//                   <th>Score Range</th>
//                   <th>What It Means</th>
//                   <th>What To Do</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {riskInterpretationData.map((row, index) => (
//                   <tr 
//                     key={index} 
//                     className={row.level === userRiskLevel ? 'highlighted-risk-row' : ''}
//                   >
//                     {/* --- MODIFICATION: Added data-label attributes --- */}
//                     <td data-label="Risk Level">{row.level}</td>
//                     <td data-label="Score Range">{row.range}</td>
//                     <td data-label="What It Means">{row.meaning}</td>
//                     <td data-label="What To Do">{row.action}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             {/* --- NEW DISCLAIMER TEXT --- */}
//             <p className="disclaimer-text">
//               <span className="disclaimer-asterisk">*</span>
//               <strong>Disclaimer</strong>:
//                 This Report is intended for research purposes only. The Breast cancer risk assessment algorithm is currently under development and should not be considered clinically validated. For medically relevant decisions and clinically valid results, please consult a qualified clinician.
//             </p>
//           </div>
//         )}

//         <div className="action-buttons">
//           <button className="ok-button" onClick={() => window.location.reload()}>Ok</button>
//           <button className="download-button" onClick={handleDownloadPdf}>
//             <Download size={18} style={{ marginRight: '8px' }} /> 
//             Download Summary (PDF)
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ThankYou;



// before tranlation


// import React from 'react';
// import './ThankYou.css';
// import { formStructure } from './Questionnaire'; // This import is untouched
// import jsPDF from 'jspdf';
// import { Download, CheckCircle } from 'lucide-react';
// // --- MODIFICATION: Import the new JSON file ---
// import thankYouData from '../assets/thankyou.json' with { type: 'json' };

// // --- MODIFICATION: Data is now sourced from the imported JSON ---
// const riskInterpretationData = thankYouData.interpretation.data;

// // Helper function to determine the risk level based on the score (Unchanged)
// const getRiskLevel = (score) => {
//     const numScore = parseFloat(score);
//     if (isNaN(numScore)) return null;
//     if (numScore < 0.4004) return "Normal Risk";
//     if (numScore >= 0.4004 && numScore < 0.574) return "Moderate Risk";
//     if (numScore >= 0.574 && numScore < 0.795) return "High Risk";
//     if (numScore >= 0.795) return "Very High Risk";
//     return null;
// };


// function ThankYou({ riskResult, formData, questionnaireData, sessionId }) {

//     const score = riskResult !== null ? (parseFloat(riskResult) / 100).toFixed(2) : null;
//     const userRiskLevel = score !== null ? getRiskLevel(score) : null;

//     const handleDownloadPdf = () => {
//         if (!formData) {
//             // --- MODIFIED ---
//             alert(thankYouData.pdf.alertNoData);
//             return;
//         }

//         const doc = new jsPDF();
//         const pageWidth = doc.internal.pageSize.getWidth();
//         const pageHeight = doc.internal.pageSize.getHeight();
//         const margin = 15;
//         let y = 0;

//         const themeColor = [98, 0, 238];
//         const highlightColor = [255, 249, 230]; 

//         const sanitizeText = (text) => {
//             if (!text) return '';
//             return text.replace(/₹/g, 'Rs.').replace(/\s+/g, ' ').trim();
//         };

//         const addHeader = () => {
//             doc.setFillColor(242, 237, 255);
//             doc.rect(0, 0, margin + 5, pageHeight, 'F');
//             doc.setFont('helvetica', 'bold');
//             doc.setFontSize(14);
//             doc.setTextColor(40, 40, 40);
//             // --- MODIFIED ---
//             doc.text(thankYouData.pdf.mainTitle, margin + 10, 18);
//             doc.setDrawColor(...themeColor);
//             doc.setLineWidth(0.4);
//             doc.line(margin + 10, 20, pageWidth - margin, 20);
//             y = 32;
//         };

//         const addFooter = (pageNumber, totalPages) => {
//             doc.setFont('helvetica', 'normal');
//             doc.setFontSize(8);
//             doc.setTextColor(150);
//             // --- MODIFIED ---
//             const footerText = `${thankYouData.pdf.footerPage} ${pageNumber} | ${thankYouData.pdf.footerGenerated}: ${new Date().toLocaleDateString()}`;
//             doc.text(footerText, pageWidth / 2, pageHeight - 8, { align: 'center' });
//         };

//         const addPageWithTemplate = () => {
//            const currentPage = doc.internal.getNumberOfPages();
//            const totalPagesGuess = currentPage + 1;
//            addFooter(currentPage, totalPagesGuess);
//            doc.addPage();
//            addHeader();
//         };

//         const renderSectionHeader = (title) => {
//             if (y > pageHeight - 30) addPageWithTemplate();
//             y += 10;
//             doc.setFontSize(13);
//             doc.setFont('helvetica', 'bold');
//             doc.setTextColor(...themeColor);
//             doc.text(title, margin + 10, y);
//             y += 10;
//         };

//         // --- Q&A Rendering Logic --- (Unchanged, but text is now from JSON)
//         const renderQAPair = (questionObject, answerText) => {
//             const qaMargin = margin + 15;
//             const boxX = margin + 10;
//             const boxWidth = pageWidth - (margin * 2) - 10;
//             const textWidth = boxWidth - 16; 

//             const questionTitleAndBody = sanitizeText(`${questionObject.title || ''} ${questionObject.text || ''}`);
//             // --- MODIFIED ---
//             const answer = sanitizeText(`${thankYouData.pdf.answerPrefix} ${answerText || ''}`);

//             const questionFontSize = 9; 
//             const answerFontSize = 9;

//             doc.setFont('helvetica', 'bold'); 
//             doc.setFontSize(questionFontSize);
//             const questionLines = doc.splitTextToSize(questionTitleAndBody, textWidth);
//             const questionHeight = doc.getTextDimensions(questionLines, {fontSize: questionFontSize}).h;

//             doc.setFont('helvetica', 'normal'); 
//             doc.setFontSize(answerFontSize);
//             const answerLines = doc.splitTextToSize(answer, textWidth - 5); 
//             const answerHeight = doc.getTextDimensions(answerLines, {fontSize: answerFontSize}).h;

//             const boxPaddingVertical = 8;
//             const spaceBetweenQA = 4; 

//             const contentHeight = questionHeight + spaceBetweenQA + answerHeight;
//             const totalBoxHeight = contentHeight + (boxPaddingVertical * 2);

//             if (y + totalBoxHeight > pageHeight - 20) {
//                 addPageWithTemplate();
//             }

//             doc.setFillColor(253, 253, 253);
//             doc.setDrawColor(225, 225, 225);
//             doc.setLineWidth(0.2);
//             doc.roundedRect(boxX, y, boxWidth, totalBoxHeight, 3, 3, 'FD');

//             let textY = y + boxPaddingVertical; 

//             doc.setFont('helvetica', 'bold');
//             doc.setFontSize(questionFontSize);
//             doc.setTextColor(50, 50, 50);
//             doc.text(questionLines, qaMargin, textY + 3); 
//             textY += questionHeight + spaceBetweenQA;

//             doc.setFont('helvetica', 'normal'); 
//             doc.setFontSize(answerFontSize);
//             doc.setTextColor(80, 80, 80);
//             doc.text(answerLines, qaMargin + 5, textY + 3); 

//             y += totalBoxHeight + 8; 
//         };


//         // --- START PDF GENERATION ---
//         addHeader();

//         // --- 1. RENDER RISK SCORE ---
//         if (score !== null) {
//           doc.setFillColor(240, 230, 255);
//           doc.roundedRect(margin + 10, y, pageWidth - (margin * 2) - 10, 22, 3, 3, 'F');
//           doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(40, 40, 40);
//           // --- MODIFIED ---
//           doc.text(thankYouData.riskScoreLabel, margin + 15, y + 13);
//           doc.setFontSize(20); doc.setTextColor(...themeColor);
//           doc.text(`${score}`, pageWidth - margin - 15, y + 15, { align: 'right' });
//           y += 32;
//         }

//         // --- 2. RENDER INTERPRETATION TABLE (With Highlighting) ---
//          if (score !== null) {
//              if (y > pageHeight - 60) addPageWithTemplate();
//              // --- MODIFIED ---
//              renderSectionHeader(thankYouData.interpretation.title);

//              const tableStartY = y;
//              const cellPadding = 3;
//              const headerFontSize = 9;
//              const rowFontSize = 7.5;
//              const colWidths = [35, 30, (pageWidth - margin*2 - 10 - 35 - 30) / 2, (pageWidth - margin*2 - 10 - 35 - 30) / 2 ];
//              const tableWidth = colWidths.reduce((a, b) => a + b, 0);
//              const tableX = margin + 10;

//              doc.setFont('helvetica', 'bold'); doc.setFontSize(headerFontSize);
//              doc.setFillColor(230, 230, 250); doc.setTextColor(40, 40, 40);
//              doc.setDrawColor(180, 180, 180); doc.setLineWidth(0.2);
//              doc.rect(tableX, y, tableWidth, 9, 'FD');

//              let currentX = tableX + cellPadding;
//              const headerY = y + 6;
//              // --- MODIFIED (All 4 headers) ---
//              doc.text(thankYouData.interpretation.headers.level, currentX, headerY); currentX += colWidths[0];
//              doc.text(thankYouData.interpretation.headers.range, currentX, headerY); currentX += colWidths[1];
//              doc.text(thankYouData.interpretation.headers.meaning, currentX, headerY); currentX += colWidths[2];
//              doc.text(thankYouData.interpretation.headers.action, currentX, headerY);
//              y += 9;

//              // This loop now uses 'riskInterpretationData' variable defined at the top
//              riskInterpretationData.forEach((row, index) => {
//                  const levelLines = doc.splitTextToSize(row.level, colWidths[0] - cellPadding * 2);
//                  const rangeLines = doc.splitTextToSize(row.range, colWidths[1] - cellPadding * 2);
//                  const meaningLines = doc.splitTextToSize(row.meaning, colWidths[2] - cellPadding * 2);
//                  const actionLines = doc.splitTextToSize(row.action, colWidths[3] - cellPadding * 2);

//                  const levelHeight = doc.getTextDimensions(levelLines, {fontSize: rowFontSize}).h;
//                  const rangeHeight = doc.getTextDimensions(rangeLines, {fontSize: rowFontSize}).h;
//                  const meaningHeight = doc.getTextDimensions(meaningLines, {fontSize: rowFontSize}).h;
//                  const actionHeight = doc.getTextDimensions(actionLines, {fontSize: rowFontSize}).h;
//                  const rowHeight = Math.max(levelHeight, rangeHeight, meaningHeight, actionHeight) + (cellPadding * 2);

//                  if (y + rowHeight > pageHeight - 20) {
//                      addPageWithTemplate();
//                      // Redraw header on new page
//                      doc.setFont('helvetica', 'bold'); doc.setFontSize(headerFontSize); doc.setFillColor(230, 230, 250); doc.setTextColor(40, 40, 40);
//                      doc.setDrawColor(180, 180, 180); doc.setLineWidth(0.2);
//                      doc.rect(tableX, y, tableWidth, 9, 'FD');
//                      currentX = tableX + cellPadding;
//                      // --- MODIFIED (All 4 headers) ---
//                      doc.text(thankYouData.interpretation.headers.level, currentX, y + 6); currentX += colWidths[0];
//                      doc.text(thankYouData.interpretation.headers.range, currentX, y + 6); currentX += colWidths[1];
//                      doc.text(thankYouData.interpretation.headers.meaning, currentX, y + 6); currentX += colWidths[2];
//                      doc.text(thankYouData.interpretation.headers.action, currentX, y + 6);
//                      y += 9;
//                  }

//                  const isHighlighted = row.level === userRiskLevel;
//                  if (isHighlighted) {
//                      doc.setFillColor(highlightColor[0], highlightColor[1], highlightColor[2]); 
//                      doc.rect(tableX, y, tableWidth, rowHeight, 'F'); 
//                  } else if (index % 2 !== 0) { 
//                      doc.setFillColor(250, 250, 250);
//                      doc.rect(tableX, y, tableWidth, rowHeight, 'F');
//                  }

//                  doc.setTextColor(isHighlighted ? 60 : 80, isHighlighted ? 60 : 80, isHighlighted ? 60 : 80);
//                  doc.setFont('helvetica', 'normal');
//                  doc.setFontSize(rowFontSize);

//                  let textY = y + cellPadding + 3;
//                  currentX = tableX + cellPadding;

//                  doc.setFont('helvetica', (isHighlighted ? 'bold' : 'bold')); 
//                  doc.text(levelLines, currentX, textY);
//                  currentX += colWidths[0];

//                  doc.setFont('helvetica', (isHighlighted ? 'bold' : 'normal')); 
//                  doc.text(rangeLines, currentX, textY);
//                  currentX += colWidths[1];
//                  doc.text(meaningLines, currentX, textY);
//                  currentX += colWidths[2];
//                  doc.text(actionLines, currentX, textY);

//                  doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.1);
//                  doc.rect(tableX, y, tableWidth, rowHeight);
//                  let lineX = tableX;
//                  for (let i = 0; i < colWidths.length; i++) {
//                    lineX += colWidths[i];
//                    if (i < colWidths.length - 1) {
//                      doc.line(lineX, y, lineX, y + rowHeight);
//                    }
//                  }
//                  y += rowHeight;
//              });
//              y += 10;
//         }

//         // --- ADD DISCLAIMER TEXT (Corrected for Width) ---
//         if (y > pageHeight - 40) addPageWithTemplate(); 
//         const disclaimerX = margin + 10;
//         const disclaimerY = y + 5; 
//         const redColor = [224, 57, 68]; 
//         const disclaimerFontSize = 9;
//         // --- MODIFIED ---
//         const disclaimerText = thankYouData.disclaimer.text;
        
//         // Draw Asterisk in Red
//         doc.setFont('helvetica', 'bold');
//         doc.setFontSize(disclaimerFontSize + 1);
//         doc.setTextColor(redColor[0], redColor[1], redColor[2]);
//         // --- MODIFIED ---
//         doc.text(thankYouData.disclaimer.asterisk, disclaimerX, disclaimerY);

//         // Draw "Disclaimer:" in Bold Grey
//         doc.setFont('helvetica', 'bold');
//         doc.setFontSize(disclaimerFontSize);
//         doc.setTextColor(100, 100, 100);
//         // --- MODIFIED ---
//         const disclaimerLabel = `${thankYouData.disclaimer.title}:`;
//         const disclaimerLabelWidth = doc.getTextWidth(disclaimerLabel);
//         doc.text(disclaimerLabel, disclaimerX + 2, disclaimerY);
        
//         const textStartX = disclaimerX + 2 + disclaimerLabelWidth + 2; 
//         const availableTextWidth = pageWidth - textStartX - margin; 

//         // Draw main disclaimer text in normal grey, with correct wrapping
//         doc.setFont('helvetica', 'normal');
//         doc.setTextColor(120, 120, 120);
//         const disclaimerLines = doc.splitTextToSize(disclaimerText, availableTextWidth);
//         doc.text(disclaimerLines, textStartX, disclaimerY);
        
//         const disclaimerHeight = doc.getTextDimensions(disclaimerLines, {fontSize: disclaimerFontSize}).h;
//         y += disclaimerHeight + 10; 
//         // --- END OF DISCLAIMER ADDITION ---

//         // --- 3. RENDER Q&A DATA (Logic 100% Unchanged) ---

//         // ***** THIS IS THE FIX *****
//         // We check if 'questionnaireData' has a 'questions' key.
//         // If yes, we use that. If no, we use 'questionnaireData' directly.
//         const questionsObject = (questionnaireData && questionnaireData.questions) ? questionnaireData.questions : questionnaireData;
//         // ***************************

//         let mainQuestionCounter = 0;
//         formStructure.forEach((section) => {
//             const questionsToRender = [];
//             const findAnsweredQuestions = (questions, parentNumber) => {
//                 questions.forEach((qConfig, index) => {
//                     const name = qConfig.name || qConfig.key; const answer = formData[name];
//                     let displayNumber;
//                     if (parentNumber) displayNumber = `${parentNumber}${String.fromCharCode(97 + index)}`;
//                     else { mainQuestionCounter++; displayNumber = mainQuestionCounter; }
                    
//                     // Check if 'questionsObject' is valid before trying to access it
//                     const questionText = questionsObject ? questionsObject[qConfig.key]?.question : '';

//                     if (answer !== undefined && answer !== null && answer !== '' && (!Array.isArray(answer) || answer.length > 0)) {
//                         questionsToRender.push({
//                             questionObject: {
//                                 // --- MODIFIED (Text only) ---
//                                 title: `${thankYouData.pdf.questionPrefix} ${displayNumber}:`,
//                                 // --- MODIFIED: Use the 'questionsObject' we defined above ---
//                                 text: questionText
//                             },
//                             answer: Array.isArray(answer) ? answer.join(', ') : answer.toString(),
//                         });
//                     }
//                     if (qConfig.subQuestions && qConfig.condition && formData[qConfig.condition.key] === qConfig.condition.value) {
//                         findAnsweredQuestions(qConfig.subQuestions, displayNumber);
//                     }
//                 });
//             };
//             findAnsweredQuestions(section.questions);

//             if (questionsToRender.length > 0) {
//                 renderSectionHeader(section.title);
//                 questionsToRender.forEach((qa) => renderQAPair(qa.questionObject, qa.answer));
//             }
//         });

//         // Add footers to all pages
//         const totalPages = doc.internal.getNumberOfPages();
//         for (let i = 1; i <= totalPages; i++) {
//             doc.setPage(i);
//             addFooter(i, totalPages);
//         }

//         // --- MODIFIED ---
//         doc.save(`${thankYouData.pdf.fileNamePrefix}-${sessionId || thankYouData.pdf.unknownSession}.pdf`);
//     };

//     // --- JSX Return ---
//     return (
//     <div className="thank-you-overlay">
//       <div className="thank-you-dialog">
//         {/* --- MODIFIED (but still commented out) ---
//         <img src="/tanuh.png" alt={thankYouData.logos.tanuhAlt} className="logo tanuh-logo" />
//         <img src="/IISc_logo.png" alt={thankYouData.logos.iiscAlt} className="logo iisc-logo" />
//         */}

//         <button className="close-button" onClick={() => window.location.reload()}>&times;</button>
//         <div className="thank-you-header">
//           <CheckCircle className="success-icon" size={40} /> 
//           {/* --- MODIFIED --- */}
//           <h3>{thankYouData.title}</h3>
//         </div>
//         {/* --- MODIFIED --- */}
//         <p>{thankYouData.message}</p>
        
//         {score !== null && (
//           <div className="risk-result-container">
//             {/* --- MODIFIED --- */}
//             <p>{thankYouData.riskScoreLabel}</p>
//             <h2 className="risk-score">{score}</h2> 
//           </div>
//         )}

//         {score !== null && (
//           <div className="interpretation-container">
//             {/* --- MODIFIED --- */}
//             <h4>{thankYouData.interpretation.title}</h4>
//             <table className="risk-interpretation-table">
//               <thead>
//                 <tr>
//                   {/* --- MODIFIED (All 4 headers) --- */}
//                   <th>{thankYouData.interpretation.headers.level}</th>
//                   <th>{thankYouData.interpretation.headers.range}</th>
//                   <th>{thankYouData.interpretation.headers.meaning}</th>
//                   <th>{thankYouData.interpretation.headers.action}</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {/* This loop now uses 'riskInterpretationData' from JSON */}
//                 {riskInterpretationData.map((row, index) => (
//                   <tr 
//                     key={index} 
//                     className={row.level === userRiskLevel ? 'highlighted-risk-row' : ''}
//                   >
//                     {/* --- MODIFIED (All 4 data-labels) --- */}
//                     <td data-label={thankYouData.interpretation.headers.level}>{row.level}</td>
//                     <td data-label={thankYouData.interpretation.headers.range}>{row.range}</td>
//                     <td data-label={thankYouData.interpretation.headers.meaning}>{row.meaning}</td>
//                     <td data-label={thankYouData.interpretation.headers.action}>{row.action}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
            
//             {/* --- MODIFIED (Disclaimer) --- */}
//             <p className="disclaimer-text">
//               <span className="disclaimer-asterisk">{thankYouData.disclaimer.asterisk}</span>
//               <strong>{thankYouData.disclaimer.title}</strong>:
//               {' '}{thankYouData.disclaimer.text}
//             </p>
//           </div>
//         )}

//         <div className="action-buttons">
//           {/* --- MODIFIED --- */}
//           <button className="ok-button" onClick={() => window.location.reload()}>
//             {thankYouData.buttons.ok}
//           </button>
//           <button className="download-button" onClick={handleDownloadPdf}>
//             <Download size={18} style={{ marginRight: '8px' }} /> 
//             {/* --- MODIFIED --- */}
//             {thankYouData.buttons.download}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ThankYou;






// working code for thankyou after translation



// import React from 'react';
// import './ThankYou.css';
// // REMOVED: Invalid import
// // import { formStructure } from './Questionnaire'; 
// import jsPDF from 'jspdf';
// import { Download, CheckCircle } from 'lucide-react';
// // NEW: Import the translation hook
// import { useTranslation } from 'react-i18next';
// import { t } from 'i18next';


// // Helper function to determine the risk level based on the score
// const getRiskLevel = (score, t) => {
//     // Get the translated level names from the JSON
//     // We must check if 't' is available and 'returnObjects' works
//     const rows = t('interpretation.data', { returnObjects: true });
//     // Fallback to English array if translation fails
//     const levels = Array.isArray(rows) ? rows.map(r => r.level) : ["Normal Risk", "Moderate Risk", "High Risk", "Very High Risk"];
    
//     const numScore = parseFloat(score);
//     if (isNaN(numScore)) return null;
//     if (numScore < 0.4004) return levels[0];
//     if (numScore >= 0.4004 && numScore < 0.574) return levels[1];
//     if (numScore >= 0.574 && numScore < 0.795) return levels[2];
//     if (numScore >= 0.795) return levels[3];
//     return null;
// };

// // NEW: Accept 'formStructure' and 'questionnaireData' as props
// function ThankYou({ riskResult, formData, questionnaireData, sessionId, formStructure }) {
//   // alert("ThankYou component rendered");

//   // NEW: Initialize hooks for 'thankyou' and 'questionnaire' namespaces
//   const { t: tThankYou } = useTranslation('thankyou');
//   const { t: tQuestions } = useTranslation('questionnaire');

//   // alert(`Translation Test: ${JSON.stringify(tThankYou('interpretation.title'))}`);
//   const score = riskResult !== null ? (parseFloat(riskResult) / 100).toFixed(2) : null;
//   // alert(`Risk Score: ${score}`);
  
//   // NEW: Load interpretation data and user level from the hook
//   // const riskInterpretationData = tThankYou('interpretationContainer.rows', { returnObjects: true }) || [];
//   const riskInterpretationData = tThankYou('interpretation.data', { returnObjects: true }) || [];
//   // alert(`Risk Interpretation Data: ${"working"}`);

//   const userRiskLevel = score !== null ? getRiskLevel(score, tThankYou) : null;
//   // alert(`User Risk Level: ${userRiskLevel}`);

//   const handleDownloadPdf = () => {
//     if (!formData) {
//       alert(tThankYou('pdf.alertNoData', 'Form data is not available to generate a PDF.'));
//       return;
//     }
    
//     // --- This entire PDF generation function is now safe ---
//     // It uses the 'formStructure' and 'questionnaireData' passed in as props
//     // And it uses the 'tThankYou' and 'tQuestions' functions for all text
    
//     const doc = new jsPDF();
//     const pageWidth = doc.internal.pageSize.getWidth();
//     const pageHeight = doc.internal.pageSize.getHeight();
//     const margin = 15;
//     let y = 0; 
//     const themeColor = [98, 0, 238];
//     const highlightColor = [255, 249, 230]; 

//     const sanitizeText = (text) => {
//       if (!text) return '';
//       return text.replace(/₹/g, 'Rs.').replace(/\s+/g, ' ').trim();
//     };

//     const addHeader = () => {
//       doc.setFillColor(242, 237, 255); doc.rect(0, 0, margin + 5, pageHeight, 'F');
//       doc.setFont('helvetica', 'bold'); doc.setFontSize(14); doc.setTextColor(40, 40, 40);
//       doc.text(tThankYou('pdf.mainTitle'), margin + 10, 18);
//       doc.setDrawColor(...themeColor); doc.setLineWidth(0.4); doc.line(margin + 10, 20, pageWidth - margin, 20);
//       y = 32;
//     };

//     const addFooter = (pageNumber, totalPages) => {
//       doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(150);
//       const footerText = `${tThankYou('pdf.footerPage')} ${pageNumber} of ${totalPages} | ${tThankYou('pdf.footerGenerated')}: ${new Date().toLocaleDateString()}`;
//       doc.text(footerText, pageWidth / 2, pageHeight - 8, { align: 'center' });
//     };
    
//     const addPageWithTemplate = () => {
//        const currentPage = doc.internal.getNumberOfPages();
//        addFooter(currentPage, currentPage + 1);
//        doc.addPage();
//        addHeader();
//     };

//     const renderSectionHeader = (title) => {
//       if (y > pageHeight - 30) addPageWithTemplate();
//       y += 10; doc.setFontSize(13); doc.setFont('helvetica', 'bold'); doc.setTextColor(...themeColor);
//       doc.text(title, margin + 10, y); y += 10;
//     };
    
//     const renderQAPair = (questionObject, answerText) => {
//         const qaMargin = margin + 15; const boxX = margin + 10;
//         const boxWidth = pageWidth - (margin * 2) - 10; const textWidth = boxWidth - 16;
//         const questionTitle = sanitizeText(questionObject.title || '');
//         const questionBody = sanitizeText(questionObject.text || '');
//         const answer = sanitizeText(`A: ${answerText || ''}`);
//         const titleFontSize = 9.5; const bodyFontSize = 9; const answerFontSize = 9;
//         doc.setFont('helvetica', 'bold'); doc.setFontSize(titleFontSize);
//         const titleHeight = doc.getTextDimensions(questionTitle, {maxWidth: textWidth, fontSize: titleFontSize}).h;
//         doc.setFont('helvetica', 'normal'); doc.setFontSize(bodyFontSize);
//         const questionLines = doc.splitTextToSize(questionBody, textWidth);
//         const questionBodyHeight = doc.getTextDimensions(questionLines, {fontSize: bodyFontSize}).h;
//         doc.setFontSize(answerFontSize);
//         const answerLines = doc.splitTextToSize(answer, textWidth - 5);
//         const answerHeight = doc.getTextDimensions(answerLines, {fontSize: answerFontSize}).h;
//         const boxPaddingVertical = 8; const spaceBetweenTitleBody = 2; const spaceBetweenBodyAnswer = 5;
//         const contentHeight = titleHeight + spaceBetweenTitleBody + questionBodyHeight + spaceBetweenBodyAnswer + answerHeight;
//         const totalBoxHeight = contentHeight + (boxPaddingVertical * 2);
//         if (y + totalBoxHeight > pageHeight - 20) { addPageWithTemplate(); }
//         doc.setFillColor(253, 253, 253); doc.setDrawColor(225, 225, 225); doc.setLineWidth(0.2);
//         doc.roundedRect(boxX, y, boxWidth, totalBoxHeight, 3, 3, 'FD');
//         let textY = y + boxPaddingVertical;
//         doc.setFont('helvetica', 'bold'); doc.setFontSize(titleFontSize); doc.setTextColor(40, 40, 40);
//         doc.text(questionTitle, qaMargin, textY + 3); textY += titleHeight + spaceBetweenTitleBody;
//         doc.setFont('helvetica', 'normal'); doc.setFontSize(bodyFontSize); doc.setTextColor(100, 100, 100);
//         doc.text(questionLines, qaMargin, textY + 3); textY += questionBodyHeight + spaceBetweenBodyAnswer;
//         doc.setFont('helvetica', 'italic'); doc.setFontSize(answerFontSize); doc.setTextColor(60, 60, 60);
//         doc.text(answerLines, qaMargin + 5, textY + 3);
//         y += totalBoxHeight + 8;
//     };

//     addHeader();
    
//     if (score !== null) {
//       doc.setFillColor(240, 230, 255); doc.roundedRect(margin + 10, y, pageWidth - (margin * 2) - 10, 22, 3, 3, 'F');
//       doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(40, 40, 40);
//       doc.text(tThankYou('riskScoreLabel'), margin + 15, y + 13);
//       doc.setFontSize(20); doc.setTextColor(...themeColor);
//       doc.text(`${score}`, pageWidth - margin - 15, y + 15, { align: 'right' });
//       y += 32;
//     }
    
//      if (score !== null) {
//          if (y > pageHeight - 60) addPageWithTemplate();
//          renderSectionHeader(tThankYou('interpretation.title'));

//          const tableStartY = y; const cellPadding = 3; const headerFontSize = 9; const rowFontSize = 8;
//          const colWidths = [35, 30, (pageWidth - margin*2 - 10 - 35 - 30) / 2, (pageWidth - margin*2 - 10 - 35 - 30) / 2 ];
//          const tableWidth = colWidths.reduce((a, b) => a + b, 0); const tableX = margin + 10;
//          doc.setFont('helvetica', 'bold'); doc.setFontSize(headerFontSize);
//          doc.setFillColor(230, 230, 250); doc.setTextColor(40, 40, 40);
//          doc.setDrawColor(180, 180, 180); doc.setLineWidth(0.2);
//          doc.rect(tableX, y, tableWidth, 9, 'FD');
//          let currentX = tableX + cellPadding; const headerY = y + 6;
//          doc.text(tThankYou('interpretation.headers.level'), currentX, headerY); currentX += colWidths[0];
//          doc.text(tThankYou('interpretation.headers.range'), currentX, headerY); currentX += colWidths[1];
//          doc.text(tThankYou('interpretation.headers.meaning'), currentX, headerY); currentX += colWidths[2];
//          doc.text(tThankYou('interpretation.headers.action'), currentX, headerY);
//          y += 9;

//          riskInterpretationData.forEach((row, index) => {
//              const levelLines = doc.splitTextToSize(row.level, colWidths[0] - cellPadding * 2);
//              const rangeLines = doc.splitTextToSize(row.range, colWidths[1] - cellPadding * 2);
//              const meaningLines = doc.splitTextToSize(row.meaning, colWidths[2] - cellPadding * 2);
//              const actionLines = doc.splitTextToSize(row.action, colWidths[3] - cellPadding * 2);
//              const levelHeight = doc.getTextDimensions(levelLines, {fontSize: rowFontSize}).h;
//              const rangeHeight = doc.getTextDimensions(rangeLines, {fontSize: rowFontSize}).h;
//              const meaningHeight = doc.getTextDimensions(meaningLines, {fontSize: rowFontSize}).h;
//              const actionHeight = doc.getTextDimensions(actionLines, {fontSize: rowFontSize}).h;
//              const rowHeight = Math.max(levelHeight, rangeHeight, meaningHeight, actionHeight) + (cellPadding * 2);
//              if (y + rowHeight > pageHeight - 20) {
//                  addPageWithTemplate();
//                  doc.setFont('helvetica', 'bold'); doc.setFontSize(headerFontSize); doc.setFillColor(230, 230, 250); doc.setTextColor(40, 40, 40);
//                  doc.setDrawColor(180, 180, 180); doc.setLineWidth(0.2); doc.rect(tableX, y, tableWidth, 9, 'FD');
//                  currentX = tableX + cellPadding;
//                  doc.text(tThankYou('interpretation.headers.level'), currentX, y + 6); currentX += colWidths[0];
//                  doc.text(tThankYou('interpretation.headers.range'), currentX, y + 6); currentX += colWidths[1];
//                  doc.text(tThankYou('interpretation.headers.meaning'), currentX, y + 6); currentX += colWidths[2];
//                  doc.text(tThankYou('interpretation.headers.action'), currentX, y + 6);
//                  y += 9;
//              }
//              const isHighlighted = row.level === userRiskLevel;
//              if (isHighlighted) { doc.setFillColor(highlightColor[0], highlightColor[1], highlightColor[2]); doc.rect(tableX, y, tableWidth, rowHeight, 'F'); }
//              else if (index % 2 !== 0) { doc.setFillColor(250, 250, 250); doc.rect(tableX, y, tableWidth, rowHeight, 'F'); }
//              doc.setTextColor(isHighlighted ? 60 : 80, isHighlighted ? 60 : 80, isHighlighted ? 60 : 80);
//              doc.setFont('helvetica', 'normal'); doc.setFontSize(rowFontSize);
//              let textY = y + cellPadding + 3; currentX = tableX + cellPadding;
//              doc.setFont('helvetica', (isHighlighted ? 'bold' : 'bold')); doc.text(levelLines, currentX, textY); currentX += colWidths[0];
//              doc.setFont('helvetica', (isHighlighted ? 'bold' : 'normal')); doc.text(rangeLines, currentX, textY); currentX += colWidths[1];
//              doc.text(meaningLines, currentX, textY); currentX += colWidths[2];
//              doc.text(actionLines, currentX, textY);
//              doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.1); doc.rect(tableX, y, tableWidth, rowHeight);
//              let lineX = tableX;
//              for (let i = 0; i < colWidths.length; i++) { lineX += colWidths[i]; if (i < colWidths.length - 1) { doc.line(lineX, y, lineX, y + rowHeight); } }
//              y += rowHeight;
//          });
//          y += 10;
//      }

//     if (y > pageHeight - 40) addPageWithTemplate();
//     const disclaimerX = margin + 10; const disclaimerY = y + 5; const redColor = [224, 57, 68]; const disclaimerFontSize = 7.5;
//     const disclaimerText = tThankYou('disclaimer.text');
//     const disclaimerLabel = tThankYou('disclaimer.title');
//     doc.setFont('helvetica', 'bold'); doc.setFontSize(disclaimerFontSize + 1); doc.setTextColor(redColor[0], redColor[1], redColor[2]);
//     doc.text("*", disclaimerX, disclaimerY);
//     doc.setFont('helvetica', 'bold'); doc.setFontSize(disclaimerFontSize); doc.setTextColor(100, 100, 100);
//     const disclaimerLabelWidth = doc.getTextWidth(disclaimerLabel + ":");
//     doc.text(disclaimerLabel + ":", disclaimerX + 2, disclaimerY);
//     const textStartX = disclaimerX + 2 + disclaimerLabelWidth + 2; const availableTextWidth = pageWidth - textStartX - margin;
//     doc.setFont('helvetica', 'normal'); doc.setTextColor(120, 120, 120);
//     const disclaimerLines = doc.splitTextToSize(disclaimerText, availableTextWidth);
//     doc.text(disclaimerLines, textStartX, disclaimerY);
//     const disclaimerHeight = doc.getTextDimensions(disclaimerLines, {fontSize: disclaimerFontSize}).h;
//     y += disclaimerHeight + 10;
        
//     let mainQuestionCounter = 0;
//     // 'formStructure' is now correctly passed as a prop
//     formStructure.forEach((section) => {
//         const questionsToRender = [];
//         const findAnsweredQuestions = (questions, parentNumber) => {
//             if (!Array.isArray(questions)) return;
//             questions.forEach((qConfig, index) => {
//                 const name = qConfig.name || qConfig.key; const answer = formData[name];
//                 let displayNumber;
//                 if (parentNumber) displayNumber = `${parentNumber}${String.fromCharCode(97 + index)}`;
//                 else { mainQuestionCounter++; displayNumber = mainQuestionCounter; }
//                 if (answer !== undefined && answer !== null && answer !== '' && (!Array.isArray(answer) || answer.length > 0)) {
//                     questionsToRender.push({
//                         questionObject: {
//                             title: `${tThankYou('pdf.questionPrefix')} ${displayNumber}`,
//                             // Use 'tQuestions' to get text from questionnaire.json
//                             text: tQuestions(`questions.${qConfig.key}.question`)
//                         },
//                         answer: Array.isArray(answer) ? answer.join(', ') : answer.toString(),
//                     });
//                 }
//                 // Use translated "Yes" to check condition
//                 const translatedConditionValue = (qConfig.condition && qConfig.condition.key) ? tQuestions(`questions.${qConfig.condition.key}.answers.0`) : null;
//                 if (qConfig.subQuestions && qConfig.condition && formData[qConfig.condition.key] === translatedConditionValue) {
//                     findAnsweredQuestions(qConfig.subQuestions, displayNumber);
//                 }
//             });
//         };
//         findAnsweredQuestions(section.questions);

//         if (questionsToRender.length > 0) {
//             renderSectionHeader(tQuestions(section.title)); // Use tQuestions for section title
//             questionsToRender.forEach((qa) => renderQAPair(qa.questionObject, qa.answer));
//         }
//     });

//     const totalPages = doc.internal.getNumberOfPages();
//     for (let i = 1; i <= totalPages; i++) {
//         doc.setPage(i);
//         addFooter(i, totalPages);
//     }
    
//     doc.save(`${tThankYou('pdf.fileNamePrefix')}-${sessionId || 'UnknownSession'}.pdf`);
//   };

//   // --- JSX Return ---
//   // Loading check (important!)
//   if (!Array.isArray(formStructure) || !questionnaireData.Q1 || !Array.isArray(riskInterpretationData)) {
//     return (
//         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
//             Loading content...
//         </div>
//     );
//   }

//   return (
//     <div className="thank-you-overlay">
//       <div className="thank-you-dialog">
//         {/* <img src="/tanuh.png" alt={tQuestions('ui.logos.tanuhAlt')} className="logo tanuh-logo" />
//         <img src="/IISc_logo.png" alt={tQuestions('ui.logos.iiscAlt')} className="logo iisc-logo" /> */}

//         <button className="close-button" onClick={() => window.location.reload()}>&times;</button>
//         <div className="thank-you-header">
//           <CheckCircle className="success-icon" size={40} />
//           <h3>{tThankYou('title')}</h3>
//         </div>
//         <p>{tThankYou('message')}</p>
        
//         {score !== null && (
//           <div className="risk-result-container">
//             <p>{tThankYou('riskScoreLabel')}</p>
//             <h2 className="risk-score">{score}</h2>
//           </div>
//         )}

//         {score !== null && (
//           <div className="interpretation-container">
//             <h4>{tThankYou('interpretation.title')}</h4>
//             <table className="risk-interpretation-table">
//               <thead>
//                 <tr>
//                   <th>{tThankYou('interpretation.headers.level')}</th>
//                   <th>{tThankYou('interpretation.headers.range')}</th>
//                   <th>{tThankYou('interpretation.headers.meaning')}</th>
//                   <th>{tThankYou('interpretation.headers.action')}</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {riskInterpretationData.map((row, index) => (
//                   <tr
//                     key={index}
//                     className={row.level === userRiskLevel ? 'highlighted-risk-row' : ''}
//                   >
//                     <td>{row.level}</td>
//                     <td>{row.range}</td>
//                     <td>{row.meaning}</td>
//                     <td>{row.action}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <p className="disclaimer-text">
//               <span className="disclaimer-asterisk">*</span>
//               <strong>{tThankYou('disclaimer.title')}</strong>
//               {tThankYou('disclaimer.text')}
//             </p>
//           </div>
//         )}

//         <div className="action-buttons">
//           <button className="ok-button" onClick={() => window.location.reload()}>{tThankYou('buttons.ok')}</button>
//           <button className="download-button" onClick={handleDownloadPdf}>
//             <Download size={18} style={{ marginRight: '8px' }} />
//             {tThankYou('buttons.download')}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // REMOVED: Invalid export
// // export { formStructure }; 
// export default ThankYou;




// final working code after translation


// import React, { useRef } from 'react'; // useRef is already imported
// import './ThankYou.css';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import { Download, CheckCircle } from 'lucide-react';
// import { useTranslation } from 'react-i18next';
// import { t } from 'i18next';


// // Helper function to determine the risk level based on the score
// const getRiskLevel = (score, t) => {
//     const rows = t('interpretation.data', { returnObjects: true });
//     const levels = Array.isArray(rows) ? rows.map(r => r.level) : ["Normal Risk", "Moderate Risk", "High Risk", "Very High Risk"];

//     const numScore = parseFloat(score);
//     if (isNaN(numScore)) return null;
//     if (numScore < 0.4004) return levels[0];
//     if (numScore >= 0.4004 && numScore < 0.574) return levels[1];
//     if (numScore >= 0.574 && numScore < 0.795) return levels[2];
//     if (numScore >= 0.795) return levels[3];
//     return null;
// };

// // Accept 'formStructure' and 'questionnaireData' as props
// function ThankYou({ riskResult, formData, questionnaireData, sessionId, formStructure }) {
//     const { t: tThankYou } = useTranslation('thankyou');
//     const { t: tQuestions } = useTranslation('questionnaire');
//     const pdfContentRef = useRef(null); // Ref for the hidden HTML content
    
//     // NEW: Ref to track the main question number across sections
//     const mainQuestionCounterRef = useRef(0);

//     const score = riskResult !== null ? (parseFloat(riskResult) / 100).toFixed(2) : null;
//     const riskInterpretationData = tThankYou('interpretation.data', { returnObjects: true }) || [];
//     const userRiskLevel = score !== null ? getRiskLevel(score, tThankYou) : null;

//     const handleDownloadPdf = async () => {
//         if (!formData || !pdfContentRef.current) {
//             alert(tThankYou('pdf.alertNoData', 'Form data is not available to generate a PDF.'));
//             return;
//         }

//         // Reset question counter every time PDF is generated
//         mainQuestionCounterRef.current = 0;

//         const input = pdfContentRef.current;

//         // Temporarily make the hidden content visible for html2canvas
//         const originalStyle = {
//             position: input.style.position,
//             top: input.style.top,
//             left: input.style.left,
//             display: input.style.display,
//         };
//         input.style.position = 'absolute';
//         input.style.top = '0px';
//         input.style.left = '0px';
//         input.style.display = 'block';

//         const canvas = await html2canvas(input, {
//             scale: 2, // Higher scale for better quality
//             useCORS: true,
//             logging: false,
//             // Allow the canvas to expand as tall as the content
//             windowHeight: input.scrollHeight, 
//             windowWidth: input.scrollWidth,
//         });
        
//         // Restore original styles to hide it again
//         input.style.position = originalStyle.position;
//         input.style.top = originalStyle.top;
//         input.style.left = originalStyle.left;
//         input.style.display = originalStyle.display;

//         const imgData = canvas.toDataURL('image/jpeg', 1.0);
//         const imgWidth = 210; // A4 size width in mm
//         const pageHeight = 297; // A4 size height in mm
//         const imgHeight = canvas.height * imgWidth / canvas.width;
//         let heightLeft = imgHeight;

//         const doc = new jsPDF('p', 'mm', 'a4');
//         let position = 0;

//         // Add the image to the PDF
//         doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
//         heightLeft -= pageHeight;

//         // Handle multi-page content
//         while (heightLeft > 0) { // Use > 0 for a clearer condition
//             position = -heightLeft; // Position is relative to the top of the image
//             doc.addPage();
//             doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
//             heightLeft -= pageHeight;
//         }

//         // Save the PDF
//         doc.save(`${tThankYou('pdf.fileNamePrefix')}-${sessionId || 'UnknownSession'}.pdf`);
//     };

//     // --- Data Mapping for Hidden Content ---
//     const getAnswerForQuestion = (qConfig) => {
//         const name = qConfig.name || qConfig.key;
//         const answer = formData[name];

//         if (answer !== undefined && answer !== null && answer !== '' && (!Array.isArray(answer) || answer.length > 0)) {
//             return Array.isArray(answer) ? answer.join(', ') : answer.toString();
//         }
//         return null;
//     }

//     // --- FIX #8: REWRITTEN renderQuestionnaire ---
//     // This function now correctly uses the mainQuestionCounterRef
//     const renderQuestionnaire = (questions, parentNumber, mainQuestionCounter) => {
//         if (!Array.isArray(questions)) return null;

//         let elements = [];
//         let subQuestionIndex = 0; // Tracks 'a', 'b', 'c' for sub-questions

//         questions.forEach((qConfig) => {
//             if (qConfig.type === 'section-title') return; // Skip titles

//             const answer = getAnswerForQuestion(qConfig);
//             let currentDisplayNumber;

//             // Determine display number logic
//             if (parentNumber) {
//                 // This is a sub-question
//                 currentDisplayNumber = `${parentNumber}${String.fromCharCode(97 + subQuestionIndex)}`;
//             } else {
//                 // This is a main question
//                 mainQuestionCounter.current++; // Increment the main counter
//                 currentDisplayNumber = mainQuestionCounter.current;
//             }
            
//             // Render the Q&A pair if an answer exists
//             if (answer) {
//                 elements.push(
//                     <div className="pdf-qa-pair" key={qConfig.key}>
//                         <div className="pdf-question">
//                             <h5 className="pdf-question-title">{tThankYou('pdf.questionPrefix')} {currentDisplayNumber}</h5>
//                             <p className="pdf-question-text">{tQuestions(`questions.${qConfig.key}.question`)}</p>
//                         </div>
//                         <p className="pdf-answer">
//                             <strong>A:</strong> {answer}
//                         </p>
//                     </div>
//                 );
//                 // Only increment sub-question index if an answer was rendered
//                 if (parentNumber) subQuestionIndex++;
//             }
            
//             // Sub-question logic and rendering
//             const translatedConditionValue = (qConfig.condition && qConfig.condition.key) ? tQuestions(`questions.${qConfig.condition.key}.answers.0`) : null;
//             if (qConfig.subQuestions && qConfig.condition && formData[qConfig.condition.key] === translatedConditionValue) {
                
//                 // Pass the *current* display number as the *new* parent number
//                 elements.push(
//                     <div className="pdf-subquestions-container" key={`${qConfig.key}-sub`}>
//                         {renderQuestionnaire(qConfig.subQuestions, currentDisplayNumber, mainQuestionCounter)}
//                     </div>
//                 );
//             }
//         });

//         return elements;
//     };


//     // Loading Check
//     if (!Array.isArray(formStructure) || !Array.isArray(riskInterpretationData) || !questionnaireData) {
//         return (
//             <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
//                 Loading content...
//             </div>
//         );
//     }

//     // This is the visible component
//     return (
//         <div className="thank-you-overlay">
//             {/* The Hidden Content to be converted to PDF (start) */}
//             <div ref={pdfContentRef} className="pdf-content-wrapper">
//                 {/* PDF Header */}
//                 <div className="pdf-header">
//                     <h1 className="pdf-main-title">{tThankYou('pdf.mainTitle')}</h1>
//                     <div className="pdf-session-info">
//                         <span>{tThankYou('pdf.footerGenerated')}: {new Date().toLocaleDateString()}</span>
//                         {/* --- FIX #4: Removed Session ID Span --- */}
//                     </div>
//                 </div>

//                 {/* Risk Score */}
//                 {score !== null && (
//                     <div className="pdf-risk-result-container">
//                         <span className="pdf-risk-label">{tThankYou('riskScoreLabel')}</span>
//                         <span className="pdf-risk-score">{score}</span>
//                     </div>
//                 )}

//                 {/* Interpretation Table */}
//                 {score !== null && (
//                     <div className="pdf-interpretation-section">
//                         <h2 className="pdf-section-title">{tThankYou('interpretation.title')}</h2>
//                         <table className="pdf-risk-interpretation-table">
//                             <thead>
//                                 <tr>
//                                     <th>{tThankYou('interpretation.headers.level')}</th>
//                                     <th>{tThankYou('interpretation.headers.range')}</th>
//                                     <th>{tThankYou('interpretation.headers.meaning')}</th>
//                                     <th>{tThankYou('interpretation.headers.action')}</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {riskInterpretationData.map((row, index) => (
//                                     <tr
//                                         key={index}
//                                         className={row.level === userRiskLevel ? 'pdf-highlighted-risk-row' : ''}
//                                     >
//                                         <td>{row.level}</td>
//                                         <td>{row.range}</td>
//                                         <td>{row.meaning}</td>
//                                         <td>{row.action}</td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}

//                 {/* Disclaimer */}
//                 <p className="pdf-disclaimer-text">
//                     <span className="pdf-disclaimer-asterisk">*</span>
//                     <strong>{tThankYou('disclaimer.title')}:</strong> {tThankYou('disclaimer.text')}
//                 </p>

//                 {/* Questionnaire Section */}
//                 {formStructure.map((section, sectionIndex) => (
//                     <div className="pdf-questionnaire-section" key={sectionIndex}>
//                         <h2 className="pdf-section-title">{tQuestions(section.title)}</h2>
//                         {/* --- FIX #8: Pass the mainQuestionCounterRef --- */}
//                         {renderQuestionnaire(section.questions, null, mainQuestionCounterRef)}
//                     </div>
//                 ))}
//             </div>
//             {/* The Hidden Content to be converted to PDF (end) */}


//             {/* The VISIBLE thank-you dialog (original code) */}
//             <div className="thank-you-dialog">
//                 <button className="close-button" onClick={() => window.location.reload()}>&times;</button>
//                 <div className="thank-you-header">
//                     <CheckCircle className="success-icon" size={40} />
//                     <h3>{tThankYou('title')}</h3>
//                 </div>
//                 <p>{tThankYou('message')}</p>

//                 {score !== null && (
//                     <div className="risk-result-container">
//                         <p>{tThankYou('riskScoreLabel')}</p>
//                         <h2 className="risk-score">{score}</h2>
//                     </div>
//                 )}

//                 {score !== null && (
//                     <div className="interpretation-container">
//                         <h4>{tThankYou('interpretation.title')}</h4>
//                         <table className="risk-interpretation-table">
//                             <thead>
//                                 <tr>
//                                     <th>{tThankYou('interpretation.headers.level')}</th>
//                                     <th>{tThankYou('interpretation.headers.range')}</th>
//                                     <th>{tThankYou('interpretation.headers.meaning')}</th>
//                                     <th>{tThankYou('interpretation.headers.action')}</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {riskInterpretationData.map((row, index) => (
//                                     <tr
//                                         key={index}
//                                         className={row.level === userRiskLevel ? 'highlighted-risk-row' : ''}
//                                     >
//                                         <td>{row.level}</td>
//                                         <td>{row.range}</td>
//                                         <td>{row.meaning}</td>
//                                         <td>{row.action}</td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                         <p className="disclaimer-text">
//                             <strong>{tThankYou('disclaimer.title')}</strong>
//                             <span className="disclaimer-asterisk">*</span>:
//                             {tThankYou('disclaimer.text')}
//                         </p>
//                     </div>
//                 )}

//                 <div className="action-buttons">
//                     <button className="ok-button" onClick={() => window.location.reload()}>{tThankYou('buttons.ok')}</button>
//                     <button className="download-button" onClick={handleDownloadPdf}>
//                         <Download size={18} style={{ marginRight: '8px' }} />
//                         {tThankYou('buttons.download')}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default ThankYou;



import React from 'react';
import './ThankYou.css';
// import { formStructure } from './Questionnaire'; // This import is untouched
import jsPDF from 'jspdf';
import { Download, CheckCircle } from 'lucide-react';
// --- MODIFICATION: Import the new JSON file ---
import thankYouData from '../assets/thankyou.json' with { type: 'json' };
import { useTranslation } from 'react-i18next';


// Helper function to determine the risk level based on the score (Unchanged)
const getRiskLevel = (score, t) => {
    const rows = t('interpretation.data', { returnObjects: true });
    const levels = Array.isArray(rows) ? rows.map(r => r.level) : ["Normal Risk", "Moderate Risk", "High Risk", "Very High Risk"];

    const numScore = parseFloat(score);
    if (isNaN(numScore)) return null;
    if (numScore < 0.4004) return levels[0];
    if (numScore >= 0.4004 && numScore < 0.574) return levels[1];
    if (numScore >= 0.574 && numScore < 0.795) return levels[2];
    if (numScore >= 0.795) return levels[3];
    return null;
};

// const getRiskAction = (score, t) => {
//     const rows = t('interpretation.data', { returnObjects: true });
//     const levels = Array.isArray(rows) ? rows.map(r => r.action) : ["Normal Risk", "Moderate Risk", "High Risk", "Very High Risk"];

//     const numScore = parseFloat(score);
//     if (isNaN(numScore)) return null;
//     if (numScore < 0.4004) return levels[0];
//     if (numScore >= 0.4004 && numScore < 0.574) return levels[1];
//     if (numScore >= 0.574 && numScore < 0.795) return levels[2];
//     if (numScore >= 0.795) return levels[3];
//     return null;
// };


const getRiskLevelEn = (score) => {
    const numScore = parseFloat(score);
    if (isNaN(numScore)) return null;
    if (numScore < 0.4004) return "Normal Risk";
    if (numScore >= 0.4004 && numScore < 0.574) return "Moderate Risk";
    if (numScore >= 0.574 && numScore < 0.795) return "High Risk";
    if (numScore >= 0.795) return "Very High Risk";
    return null;
};


// const getRiskActionEn = (score) => {
//     const numScore = parseFloat(score);
//     if (isNaN(numScore)) return null;
//     if (numScore < 0.4004) return "Keep up with routine checkups, like yearly breast exams by a doctor from 30 years of age.";
//     if (numScore >= 0.4004 && numScore < 0.574) return "Consider breast exams every 6 months from 30 years of age and talk to your doctor about prevention.";
//     if (numScore >= 0.574 && numScore < 0.795) return "Get breast exams every 4-6 months from 25 years of age and possibly imaging (like mammograms) as advised by your doctor.";
//     if (numScore >= 0.795) return "Be extra vigilant with breast exams every 4 months from at least 25 years of age and more frequent imaging as per your doctor's advice.";
//     return null;
// };

function ThankYou({ riskResult, formData, sessionId, formStructure, questionnaireData }) {

    const { t: tThankYou } = useTranslation('thankyou');
    // const { t: tQuestions } = useTranslation('questionnaire');
    // const pdfContentRef = useRef(null); // Ref for the hidden HTML content
    
    // // NEW: Ref to track the main question number across sections
    // const mainQuestionCounterRef = useRef(0);

    const score = riskResult !== null ? (parseFloat(riskResult) / 100).toFixed(2) : null;
    const riskInterpretationData = tThankYou('interpretation.data', { returnObjects: true }) || [];
    const riskInterpretationDataEn = thankYouData.interpretation.data || [];

    const userRiskLevel = score !== null ? getRiskLevel(score, tThankYou) : null;
    const userRiskLevelEn = score !== null ? getRiskLevelEn(score) : null;

    // const userRiskAction = score !== null ? getRiskAction(score, tThankYou) : null;
    // const userRiskActionEn = score !== null ? getRiskActionEn(score) : null;

   

    const handleDownloadPdf = () => {
        if (!formData) {
            // --- MODIFIED ---
            alert(thankYouData.pdf.alertNoData);
            return;
        }

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 15;
        let y = 0;

        const themeColor = [98, 0, 238];


        const sanitizeText = (text) => {
            if (!text) return '';
            return text.replace(/₹/g, 'Rs.').replace(/\s+/g, ' ').trim();
        };

        const addHeader = () => {
            doc.setFillColor(242, 237, 255);
            doc.rect(0, 0, margin + 5, pageHeight, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.setTextColor(40, 40, 40);
            // --- MODIFIED ---
            doc.text(thankYouData.pdf.mainTitle, margin + 10, 18);
            doc.setDrawColor(...themeColor);
            doc.setLineWidth(0.4);
            doc.line(margin + 10, 20, pageWidth - margin, 20);
            y = 32;
        };

        const addFooter = (pageNumber, totalPages) => {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(150);
            // --- MODIFIED ---
            const footerText = `${thankYouData.pdf.footerPage} ${pageNumber} | ${thankYouData.pdf.footerGenerated}: ${new Date().toLocaleDateString()}`;
            doc.text(footerText, pageWidth / 2, pageHeight - 8, { align: 'center' });
        };

        const addPageWithTemplate = () => {
           const currentPage = doc.internal.getNumberOfPages();
           const totalPagesGuess = currentPage + 1;
           addFooter(currentPage, totalPagesGuess);
           doc.addPage();
           addHeader();
        };

        const renderSectionHeader = (title) => {
            if (y > pageHeight - 30) addPageWithTemplate();
            y += 10;
            doc.setFontSize(13);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...themeColor);
            doc.text(title, margin + 10, y);
            y += 10;
        };

        // --- Q&A Rendering Logic --- (Unchanged, but text is now from JSON)
        const renderQAPair = (questionObject, answerText) => {
            const qaMargin = margin + 15;
            const boxX = margin + 10;
            const boxWidth = pageWidth - (margin * 2) - 10;
            const textWidth = boxWidth - 16; 

            const questionTitleAndBody = sanitizeText(`${questionObject.title || ''} ${questionObject.text || ''}`);
            // --- MODIFIED ---
            const answer = sanitizeText(`${thankYouData.pdf.answerPrefix} ${answerText || ''}`);

            const questionFontSize = 9; 
            const answerFontSize = 9;

            doc.setFont('helvetica', 'bold'); 
            doc.setFontSize(questionFontSize);
            const questionLines = doc.splitTextToSize(questionTitleAndBody, textWidth);
            const questionHeight = doc.getTextDimensions(questionLines, {fontSize: questionFontSize}).h;

            doc.setFont('helvetica', 'normal'); 
            doc.setFontSize(answerFontSize);
            const answerLines = doc.splitTextToSize(answer, textWidth - 5); 
            const answerHeight = doc.getTextDimensions(answerLines, {fontSize: answerFontSize}).h;

            const boxPaddingVertical = 8;
            const spaceBetweenQA = 4; 

            const contentHeight = questionHeight + spaceBetweenQA + answerHeight;
            const totalBoxHeight = contentHeight + (boxPaddingVertical * 2);

            if (y + totalBoxHeight > pageHeight - 20) {
                addPageWithTemplate();
            }

            doc.setFillColor(253, 253, 253);
            doc.setDrawColor(225, 225, 225);
            doc.setLineWidth(0.2);
            doc.roundedRect(boxX, y, boxWidth, totalBoxHeight, 3, 3, 'FD');

            let textY = y + boxPaddingVertical; 

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(questionFontSize);
            doc.setTextColor(50, 50, 50);
            doc.text(questionLines, qaMargin, textY + 3); 
            textY += questionHeight + spaceBetweenQA;

            doc.setFont('helvetica', 'normal'); 
            doc.setFontSize(answerFontSize);
            doc.setTextColor(80, 80, 80);
            doc.text(answerLines, qaMargin + 5, textY + 3); 

            y += totalBoxHeight + 8; 
        };


        // --- START PDF GENERATION ---
        addHeader();

        // --- 1. RENDER RISK SCORE ---
        if (score !== null) {
          doc.setFillColor(240, 230, 255);
          doc.roundedRect(margin + 10, y, pageWidth - (margin * 2) - 10, 22, 3, 3, 'F');
          doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(40, 40, 40);
          // --- MODIFIED ---
          doc.text(thankYouData.riskScoreLabel, margin + 15, y + 13);
          doc.setFontSize(20); doc.setTextColor(...themeColor);
          doc.text(`${userRiskLevelEn}`, pageWidth - margin - 15, y + 15, { align: 'right' });
          y += 32;
        }

        // --- 2. RENDER INTERPRETATION TABLE (With Highlighting) ---
        //  if (score !== null) {
        //      if (y > pageHeight - 60) addPageWithTemplate();
        //      // --- MODIFIED ---
        //      renderSectionHeader(thankYouData.interpretation.title);

        //      const tableStartY = y;
        //      const cellPadding = 3;
        //      const headerFontSize = 9;
        //      const rowFontSize = 7.5;
        //      const colWidths = [35, 30, (pageWidth - margin*2 - 10 - 35 - 30) / 2, (pageWidth - margin*2 - 10 - 35 - 30) / 2 ];
        //      const tableWidth = colWidths.reduce((a, b) => a + b, 0);
        //      const tableX = margin + 10;

        //      doc.setFont('helvetica', 'bold'); doc.setFontSize(headerFontSize);
        //      doc.setFillColor(230, 230, 250); doc.setTextColor(40, 40, 40);
        //      doc.setDrawColor(180, 180, 180); doc.setLineWidth(0.2);
        //      doc.rect(tableX, y, tableWidth, 9, 'FD');

        //      let currentX = tableX + cellPadding;
        //      const headerY = y + 6;
        //      // --- MODIFIED (All 4 headers) ---
        //      doc.text(thankYouData.interpretation.headers.level, currentX, headerY); currentX += colWidths[0];
        //      doc.text(thankYouData.interpretation.headers.range, currentX, headerY); currentX += colWidths[1];
        //      doc.text(thankYouData.interpretation.headers.meaning, currentX, headerY); currentX += colWidths[2];
        //      doc.text(thankYouData.interpretation.headers.action, currentX, headerY);
        //      y += 9;

        //      // This loop now uses 'riskInterpretationData' variable defined at the top
        //      riskInterpretationDataEn.forEach((row, index) => {
        //          const levelLines = doc.splitTextToSize(row.level, colWidths[0] - cellPadding * 2);
        //          const rangeLines = doc.splitTextToSize(row.range, colWidths[1] - cellPadding * 2);
        //          const meaningLines = doc.splitTextToSize(row.meaning, colWidths[2] - cellPadding * 2);
        //          const actionLines = doc.splitTextToSize(row.action, colWidths[3] - cellPadding * 2);

        //          const levelHeight = doc.getTextDimensions(levelLines, {fontSize: rowFontSize}).h;
        //          const rangeHeight = doc.getTextDimensions(rangeLines, {fontSize: rowFontSize}).h;
        //          const meaningHeight = doc.getTextDimensions(meaningLines, {fontSize: rowFontSize}).h;
        //          const actionHeight = doc.getTextDimensions(actionLines, {fontSize: rowFontSize}).h;
        //          const rowHeight = Math.max(levelHeight, rangeHeight, meaningHeight, actionHeight) + (cellPadding * 2);

        //          if (y + rowHeight > pageHeight - 20) {
        //              addPageWithTemplate();
        //              // Redraw header on new page
        //              doc.setFont('helvetica', 'bold'); doc.setFontSize(headerFontSize); doc.setFillColor(230, 230, 250); doc.setTextColor(40, 40, 40);
        //              doc.setDrawColor(180, 180, 180); doc.setLineWidth(0.2);
        //              doc.rect(tableX, y, tableWidth, 9, 'FD');
        //              currentX = tableX + cellPadding;
        //              // --- MODIFIED (All 4 headers) ---
        //              doc.text(thankYouData.interpretation.headers.level, currentX, headerY); currentX += colWidths[0];
        //              doc.text(thankYouData.interpretation.headers.range, currentX, headerY); currentX += colWidths[1];
        //              doc.text(thankYouData.interpretation.headers.meaning, currentX, headerY); currentX += colWidths[2];
        //              doc.text(thankYouData.interpretation.headers.action, currentX, headerY);
        //              y += 9;
        //          }

        //          const isHighlighted = row.level === userRiskLevel;
        //          if (isHighlighted) {
        //              doc.setFillColor(highlightColor[0], highlightColor[1], highlightColor[2]); 
        //              doc.rect(tableX, y, tableWidth, rowHeight, 'F'); 
        //          } else if (index % 2 !== 0) { 
        //              doc.setFillColor(250, 250, 250);
        //              doc.rect(tableX, y, tableWidth, rowHeight, 'F');
        //          }

        //          doc.setTextColor(isHighlighted ? 60 : 80, isHighlighted ? 60 : 80, isHighlighted ? 60 : 80);
        //          doc.setFont('helvetica', 'normal');
        //          doc.setFontSize(rowFontSize);

        //          let textY = y + cellPadding + 3;
        //          currentX = tableX + cellPadding;

        //          doc.setFont('helvetica', (isHighlighted ? 'bold' : 'bold')); 
        //          doc.text(levelLines, currentX, textY);
        //          currentX += colWidths[0];

        //          doc.setFont('helvetica', (isHighlighted ? 'bold' : 'normal')); 
        //          doc.text(rangeLines, currentX, textY);
        //          currentX += colWidths[1];
        //          doc.text(meaningLines, currentX, textY);
        //          currentX += colWidths[2];
        //          doc.text(actionLines, currentX, textY);

        //          doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.1);
        //          doc.rect(tableX, y, tableWidth, rowHeight);
        //          let lineX = tableX;
        //          for (let i = 0; i < colWidths.length; i++) {
        //            lineX += colWidths[i];
        //            if (i < colWidths.length - 1) {
        //              doc.line(lineX, y, lineX, y + rowHeight);
        //            }
        //          }
        //          y += rowHeight;
        //      });
        //      y += 10;
        // }

        if (score !== null) {
            if (y > pageHeight - 60) addPageWithTemplate();

            // --- NEW SECTION: "What To Do" ---
            renderSectionHeader(thankYouData.interpretation.headers.action);

            // Find the highlighted (user) row
            const highlightedRow = riskInterpretationDataEn.find(
                (row) => row.level === userRiskLevelEn
            );

            // Add box styling
            const boxX = margin + 10;
            const boxWidth = pageWidth - margin * 2 - 20;
            const boxPadding = 6;
            const boxLineSpacing = 4;
            const actionText = highlightedRow
                ? highlightedRow.action
                : "No specific action available.";

            // Split long text
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            const wrappedText = doc.splitTextToSize(actionText, boxWidth - boxPadding * 2);
            const boxHeight =
                doc.getTextDimensions(wrappedText, { fontSize: 10 }).h + boxPadding * 2;

            // Check for page overflow
            if (y + boxHeight > pageHeight - 40) addPageWithTemplate();

            // Draw shaded box
            doc.setFillColor(245, 245, 255);
            doc.setDrawColor(180, 180, 200);
            doc.setLineWidth(0.3);
            doc.roundedRect(boxX, y, boxWidth, boxHeight, 3, 3, 'FD');

            // Write the action text inside
            doc.setTextColor(50, 50, 70);
            doc.text(
                wrappedText,
                boxX + boxPadding,
                y + boxPadding + boxLineSpacing
            );

            y += boxHeight + 10;
        }


        // --- ADD DISCLAIMER TEXT (Corrected for Width) ---
        if (y > pageHeight - 40) addPageWithTemplate(); 
        const disclaimerX = margin + 10;
        const disclaimerY = y + 5; 
        const redColor = [224, 57, 68]; 
        const disclaimerFontSize = 9;
        // --- MODIFIED ---
        const disclaimerText = thankYouData.disclaimer.text;
        
        // Draw Asterisk in Red
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(disclaimerFontSize + 1);
        doc.setTextColor(redColor[0], redColor[1], redColor[2]);
        // --- MODIFIED ---
        doc.text(thankYouData.disclaimer.asterisk, disclaimerX, disclaimerY);

        // Draw "Disclaimer:" in Bold Grey
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(disclaimerFontSize);
        doc.setTextColor(100, 100, 100);
        // --- MODIFIED ---
        const disclaimerLabel = `${thankYouData.disclaimer.title}:`;
        const disclaimerLabelWidth = doc.getTextWidth(disclaimerLabel);
        doc.text(disclaimerLabel, disclaimerX + 2, disclaimerY);
        
        const textStartX = disclaimerX + 2 + disclaimerLabelWidth + 2; 
        const availableTextWidth = pageWidth - textStartX - margin; 

        // Draw main disclaimer text in normal grey, with correct wrapping
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(120, 120, 120);
        const disclaimerLines = doc.splitTextToSize(disclaimerText, availableTextWidth);
        doc.text(disclaimerLines, textStartX, disclaimerY);
        
        const disclaimerHeight = doc.getTextDimensions(disclaimerLines, {fontSize: disclaimerFontSize}).h;
        y += disclaimerHeight + 10; 
        // --- END OF DISCLAIMER ADDITION ---

        // --- 3. RENDER Q&A DATA (Logic 100% Unchanged) ---

        // ***** THIS IS THE FIX *****
        // We check if 'questionnaireData' has a 'questions' key.
        // If yes, we use that. If no, we use 'questionnaireData' directly.
        const questionsObject = (questionnaireData && questionnaireData.questions) ? questionnaireData.questions : questionnaireData;
        // ***************************

        let mainQuestionCounter = 0;
        formStructure.forEach((section) => {
            const questionsToRender = [];
            const findAnsweredQuestions = (questions, parentNumber) => {
                questions.forEach((qConfig, index) => {
                    const name = qConfig.name || qConfig.key; const answer = formData[name];
                    let displayNumber;
                    if (parentNumber) displayNumber = `${parentNumber}${String.fromCharCode(97 + index)}`;
                    else { mainQuestionCounter++; displayNumber = mainQuestionCounter; }
                    
                    // Check if 'questionsObject' is valid before trying to access it
                    const questionText = questionsObject ? questionsObject[qConfig.key]?.question : '';

                    if (answer !== undefined && answer !== null && answer !== '' && (!Array.isArray(answer) || answer.length > 0)) {
                        questionsToRender.push({
                            questionObject: {
                                // --- MODIFIED (Text only) ---
                                title: `${thankYouData.pdf.questionPrefix} ${displayNumber}:`,
                                // --- MODIFIED: Use the 'questionsObject' we defined above ---
                                text: questionText
                            },
                            answer: Array.isArray(answer) ? answer.join(', ') : answer.toString(),
                        });
                    }
                    if (qConfig.subQuestions && qConfig.condition && formData[qConfig.condition.key] === qConfig.condition.value) {
                        findAnsweredQuestions(qConfig.subQuestions, displayNumber);
                    }
                });
            };
            findAnsweredQuestions(section.questions);

            if (questionsToRender.length > 0) {
                renderSectionHeader(section.title);
                questionsToRender.forEach((qa) => renderQAPair(qa.questionObject, qa.answer));
            }
        });

        // Add footers to all pages
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            addFooter(i, totalPages);
        }

        // --- MODIFIED ---
        doc.save(`${thankYouData.pdf.fileNamePrefix}-${sessionId || 'UnknownSession'}.pdf`);
    };

    // --- JSX Return ---
    return (
    <div className="thank-you-overlay">
      <div className="thank-you-dialog">
        {/* --- MODIFIED (but still commented out) ---
        <img src="/tanuh.png" alt={thankYouData.logos.tanuhAlt} className="logo tanuh-logo" />
        <img src="/IISc_logo.png" alt={thankYouData.logos.iiscAlt} className="logo iisc-logo" />
        */}

        <button className="close-button" onClick={() => window.location.reload()}>&times;</button>
        <div className="thank-you-header">
          <CheckCircle className="success-icon" size={40} /> 
          {/* --- MODIFIED --- */}
          <h3>{tThankYou('title')}</h3>
        </div>
        {/* --- MODIFIED --- */}
        <p>{tThankYou('message')}</p>
        
        {score !== null && (
          <div className="risk-result-container">
            {/* --- MODIFIED --- */}
            <p>{tThankYou('riskScoreLabel')}</p>
            <h2 className="risk-score">{userRiskLevel}</h2> 
          </div>
        )}

        {/* {score !== null && (
          <div className="interpretation-container">
            <h4>{tThankYou('interpretation.title')}</h4>
            <table className="risk-interpretation-table">
              <thead>
                <tr>
                  <th>{tThankYou('interpretation.headers.level')}</th>
                  <th>{tThankYou('interpretation.headers.range')}</th>
                  <th>{tThankYou('interpretation.headers.meaning')}</th>
                  <th>{tThankYou('interpretation.headers.action')}</th>
                </tr>
              </thead>
              <tbody>
                {riskInterpretationData.map((row, index) => (
                  <tr 
                    key={index} 
                    className={row.level === userRiskLevel ? 'highlighted-risk-row' : ''}
                  >
                    <td data-label={tThankYou('interpretation.headers.level')}>{row.level}</td>
                    <td data-label={tThankYou('interpretation.headers.range')}>{row.range}</td>
                    <td data-label={tThankYou('interpretation.headers.meaning')}>{row.meaning}</td>
                    <td data-label={tThankYou('interpretation.headers.action')}>{row.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <p className="disclaimer-text">
              <span className="disclaimer-asterisk">{tThankYou('disclaimer.asterisk')}</span>
              <strong>{tThankYou('disclaimer.title')}</strong>:
              {' '}{tThankYou('disclaimer.text')}
            </p>
          </div>
        )} */}

        {score !== null && (() => {
            const highlightedRow = riskInterpretationData.find(
                (row) => row.level === userRiskLevel
            );

            return (
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
            );
        })()}



        <div className="action-buttons">
          {/* --- MODIFIED --- */}
          <button className="ok-button" onClick={() => window.location.reload()}>
            {tThankYou('buttons.ok')}
          </button>
          <button className="download-button" onClick={handleDownloadPdf}>
            <Download size={18} style={{ marginRight: '8px' }} /> 
            {/* --- MODIFIED --- */}
            {tThankYou('buttons.download')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ThankYou;
