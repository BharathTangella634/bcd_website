SELECT COUNT(*) AS total_matching
FROM bcd_questionnaire.session_data_table
WHERE answer IN (
  'Shanmuga Hospital Limited',
  'Sri Chamundeshwari Medical College Hospital & Research Institute'
);