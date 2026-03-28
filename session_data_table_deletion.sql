SET SQL_SAFE_UPDATES = 0;

-- 1) Delete from child table
DELETE FROM bcd_questionnaire.session_data_table
WHERE session_id IN (
    SELECT session_id
    FROM bcd_questionnaire.session_table
    WHERE snehita_lifetime_risk IS NULL
       OR snehita_lifetime_risk = ''
);

-- 2) Now delete from parent table
DELETE FROM bcd_questionnaire.session_table
WHERE snehita_lifetime_risk IS NULL
   OR snehita_lifetime_risk = '';
   
SET SQL_SAFE_UPDATES = 1;