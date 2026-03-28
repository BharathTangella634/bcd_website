-- SQL Script to extract Hospital/Institute distribution for completed sessions
-- This joins the session_table (to filter for scored results) with session_data_table (to get the institute answer)

SELECT 
    sd.answer AS institute_name, 
    COUNT(s.session_id) AS total_subjects
FROM session_table s
JOIN session_data_table sd ON s.session_id = sd.session_id
WHERE s.snehita_lifetime_risk IS NOT NULL
  AND sd.question IN ('Institute Name', 'Enter the Hospital ID(If any, else leave):')
  AND sd.answer IS NOT NULL 
  AND sd.answer != ''
GROUP BY sd.answer
ORDER BY total_subjects DESC;
