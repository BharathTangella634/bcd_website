import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { v4 as uuidv4 } from 'uuid';
import { getPool } from '../mysql_explorer/db.js';
// import questionnaireData from '../src/assets/questionnaire.json' with { type: 'json' };
// import questionnaireData from './questionnaire.json' with { type: 'json' };

// import questionnaireJson from '../src/assets/questionnaire.json' with { type: 'json' };
import questionnaireJson from './questionnaire.json' with { type: 'json' };


const questionnaireData = questionnaireJson.questions; 
const formStructure = questionnaireJson.formStructure;

const app = express();
const PORT = process.env.PORT || 3001;

app.use(morgan('combined'));
app.use(cors());
app.use(express.json());
app.set('trust proxy', true);


function calculateSnehithaRisk(formData) {
    console.log('--- Starting Snehitha Risk Calculation ---');
    console.log('Received Form Data:', JSON.stringify(formData, null, 2));

    // --- 1. Map form answers to variables (with defaults) ---
    // Safely parse numbers, defaulting to 0 if they are missing or not a number.
    const age = parseInt(formData.Q1, 10) || 0;
    const ageAtMenarche = parseInt(formData.Q10, 10) || 0; // From sub-question of Q9
    
    // Convert text answers to 0 or 1 based on the exact text from questionnaire.json
    const irregularCycles = formData.Q12_Current === 'No' ? 1 : 0;
    const breastfeeding24M = formData.Q17 === 'greater than 24 months' ? 1 : 0;
    const firstDegreeRelatives = formData.Q21 === 'First Order (Mother, Sibling, Father)' ? 1 : 0;
    const previousBiopsy = formData.Q40 === 'Yes' ? 1 : 0;

    // --- 2. Handle composite variables ---
    const isNullipara = formData.Q14 === 'No'; // Q14: "Have you given birth...?"
    const ageAtFirstBirth_25_29 = formData.Q16 === '25 to 29';
    const ageAtFirstBirth_gte30 = formData.Q16 === 'After 30';

    const ageAtFirstLiveBirth2529OrNullipara = (isNullipara || ageAtFirstBirth_25_29) ? 1 : 0;
    const ageAtFirstLiveBirth30OrMore = ageAtFirstBirth_gte30 ? 1 : 0;

    // --- Log the interpreted values for debugging ---
    console.log('Interpreted Variables:');
    console.log(`  - Age: ${age}`);
    console.log(`  - Age at Menarche: ${ageAtMenarche}`);
    console.log(`  - Irregular Cycles: ${irregularCycles} (from '${formData.Q12_Current}')`);
    console.log(`  - Breastfeeding >24M: ${breastfeeding24M} (from '${formData.Q17}')`);
    console.log(`  - First-Degree Relatives: ${firstDegreeRelatives} (from '${formData.Q21}')`);
    console.log(`  - Previous Biopsy: ${previousBiopsy} (from '${formData.Q40}')`);
    console.log(`  - Age at First Birth 25-29 or Nullipara: ${ageAtFirstLiveBirth2529OrNullipara}`);
    console.log(`  - Age at First Birth >=30: ${ageAtFirstLiveBirth30OrMore}`);

    // --- 3. Calculate logit(p) using the provided formula ---
    const logitP = -0.940 +
        (0.027 * age) -
        (0.082 * ageAtMenarche) +
        (0.453 * irregularCycles) -
        (0.892 * breastfeeding24M) +
        (0.810 * firstDegreeRelatives) +
        (1.420 * previousBiopsy) +
        (0.811 * ageAtFirstLiveBirth2529OrNullipara) +
        (1.035 * ageAtFirstLiveBirth30OrMore);

    // --- 4. Convert logit(p) to probability ---
    const probability = 1 / (1 + Math.exp(-logitP));

    // --- 5. Format to percentage and handle potential NaN errors ---
    let riskPercentage = (probability * 100).toFixed(2);
    if (isNaN(riskPercentage)) {
        console.error("Calculation resulted in NaN. Defaulting to 0.00. Please check inputs.");
        riskPercentage = "0.00";
    }
    
    console.log(`Final Calculation: Logit(p)=${logitP.toFixed(4)}, Probability=${probability.toFixed(4)}, Risk=${riskPercentage}%`);
    console.log('--- Risk Calculation Finished ---');
    return riskPercentage;
}


// === NEW ENDPOINT: To start a session ===
app.post('/api/session/start', async (req, res) => {
    const pool = getPool();
    const sessionId = uuidv4();
    const sessionStartTime = new Date();
    const ipAddress = req.ip; // Get user's IP address

    console.log(`🚀 Starting new session for IP: ${ipAddress}`);

    try {
        const sessionSql = 'INSERT INTO session_table (session_id, ip_address, session_start_time) VALUES (?, ?, ?)';
        await pool.query(sessionSql, [sessionId, ipAddress, sessionStartTime]);
        
        console.log(`✅ Session created with ID: ${sessionId}`);
        // Send the new session ID back to the frontend
        res.status(200).json({ success: true, sessionId: sessionId });

    } catch (err) {
        console.error('❌ Error creating session:', err);
        res.status(500).json({ success: false, message: 'Failed to create a session.' });
    }
});
// Endpoint to submit answers
app.post('/api/submit', async (req, res) => {
    const { sessionId, formDataEn } = req.body; 
    console.log(`🚀 Received submission for session ID: ${sessionId}`);
    if (!sessionId || !formDataEn) {
        console.warn('⚠️ Missing sessionId or formDataEn in request body');
        return res.status(400).json({ success: false, message: 'Session ID and form data are required.' });
    }
    const pool = getPool();
    let connection;

    try {
        // --- NEW: Calculate the risk before saving ---
        const riskPercentage = calculateSnehithaRisk(formDataEn);
        
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // --- NEW: Helper to get ordered keys from formStructure ---
        const getOrderedKeys = (structure) => {
            const keys = [];
            const traverse = (questions) => {
                if (!Array.isArray(questions)) return;
                questions.forEach(q => {
                    const qKey = q.name || q.key;
                    if (qKey) keys.push(qKey);
                    if (q.otherOptionId) keys.push(q.otherOptionId);
                    if (q.subQuestions) traverse(q.subQuestions);
                });
            };
            structure.forEach(section => traverse(section.questions));
            return keys;
        };

        const orderedKeys = getOrderedKeys(formStructure);
        // Also add keys that might be in formDataEn but not in formStructure (like Q46 language)
        const allKeys = [...new Set([...orderedKeys, ...Object.keys(formDataEn)])];

        // --- Use a common timestamp and increment it for each answer to ensure uniqueness and sequence ---
        let currentTimestamp = new Date();

        for (const questionKey of allKeys) {
            if (Object.prototype.hasOwnProperty.call(formDataEn, questionKey)) {
                const answerValue = formDataEn[questionKey];
                const sessionDataId = uuidv4();
                const finalAnswer = Array.isArray(answerValue) ? answerValue.join(', ') : answerValue;

                // --- Look up the full question text ---
                const questionText = questionnaireData[questionKey]?.question || questionKey;

                const answerSql = 'INSERT INTO session_data_table (session_data_id, session_id, question, answer, created_at) VALUES (?, ?, ?, ?, ?)';
                await connection.query(answerSql, [sessionDataId, sessionId, questionText, finalAnswer, new Date(currentTimestamp)]);
                
                // Increment timestamp by 1 second for each question to ensure they are unique and sequential in the DB
                currentTimestamp.setSeconds(currentTimestamp.getSeconds() + 1);
            }
        }
        
        // --- MODIFIED: Update session_table with end_time AND the calculated risk ---
        const updateSessionSql = 'UPDATE session_table SET session_end_time = ?, snehita_lifetime_risk = ? WHERE session_id = ?';
        // await connection.query(updateSessionSql, [new Date(), `${riskPercentage}%`, sessionId]);
        await connection.query(updateSessionSql, [new Date(), (riskPercentage / 100).toFixed(2), sessionId]);

        console.log(`✅ Finalized session ${sessionId} with risk ${riskPercentage}%`);
        
        await connection.commit();
        // --- MODIFIED: Send the risk percentage back to the frontend ---
        res.status(200).json({ success: true, message: 'Questionnaire submitted successfully!', riskPercentage: riskPercentage });

    } catch (err) {
        if (connection) await connection.rollback();
        console.error('❌ Error during database submission:', err);
        res.status(500).json({ success: false, message: 'Database submission failed' });
    } finally {
        if (connection) connection.release();
    }
});

// Health check endpoints
app.get('/api/health', (req, res) => {
    console.log('GET /api/health - responding OK');
    res.status(200).json({ success: true, message: 'Backend is healthy!' });
});

app.get('/health', (req, res) => {
    console.log('GET /health - responding OK');
    res.status(200).json({ success: true, message: 'Backend is healthy!' });
});

// Test DB connection endpoint
app.get('/api/db-test', async (req, res) => {
    console.log('🚀 Received DB test request');
    try {
        const pool = getPool();
        const [rows] = await pool.query('SELECT 1 AS ok');
        console.log('✅ DB Test successful');
        res.status(200).json({ success: true, message: 'Database connected!', result: rows });
    } catch (err) {
        console.error('❌ DB Test Error:', err);
        res.status(500).json({ success: false, message: 'Database connection failed.', error: err.message });
    }
});

app.listen(PORT, async () => {
    console.log(`🚀 Server is running on http://0.0.0.0:${PORT}`);
    
    // Check DB connection on startup
    try {
        const pool = getPool();
        await pool.query('SELECT 1');
        console.log('✅ Connected to database successfully.');
    } catch (err) {
        console.error('❌ Database connection failed on startup:', err.message);
    }
});

// app.listen(PORT, '0.0.0.0', () => {
//     console.log(`🚀 Server is running on port ${PORT} (accessible in Docker)`);
// });


