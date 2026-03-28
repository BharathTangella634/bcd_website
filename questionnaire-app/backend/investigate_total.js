import { getPool } from '../mysql_explorer/db.js';

async function investigate() {
    const pool = getPool();
    try {
        const [rows] = await pool.query(`
            SELECT sd.question, sd.answer, COUNT(DISTINCT s.session_id) as c
            FROM session_table s
            JOIN session_data_table sd ON s.session_id = sd.session_id
            WHERE s.snehita_lifetime_risk IS NOT NULL
            GROUP BY sd.question, sd.answer
            ORDER BY c DESC
        `);
        console.log('--- ALL SCORED SESSIONS BY Q/A ---');
        // I'll filter for what looks like a hospital/institute
        rows.filter(r => r.question.toLowerCase().includes('hospital') || r.question.toLowerCase().includes('institute'))
            .forEach(r => console.log(`${r.question}: ${r.answer} => (${r.c})`));

    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}
investigate();
