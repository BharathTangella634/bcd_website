// mysql_explorer/export_schema_csv.js
// Script to export all tables and columns for the configured database to a CSV file.
// Run: npm run schema:export

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPool, closePool, getDbName, testConnection } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_FILE = path.resolve(__dirname, 'schema_export.csv');

function csvEscape(value) {
  if (value === null || value === undefined) return '';
  const s = String(value);
  if (/[",\n]/.test(s)) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

async function fetchSchema() {
  const pool = await getPool();
  const sql = `
    SELECT 
      c.TABLE_SCHEMA AS schema_name,
      c.TABLE_NAME AS table_name,
      t.TABLE_TYPE AS table_type,
      c.ORDINAL_POSITION AS column_position,
      c.COLUMN_NAME AS column_name,
      c.DATA_TYPE AS data_type,
      c.COLUMN_TYPE AS column_type,
      c.IS_NULLABLE AS is_nullable,
      c.COLUMN_DEFAULT AS column_default,
      c.EXTRA AS extra,
      c.COLUMN_KEY AS column_key,
      c.CHARACTER_MAXIMUM_LENGTH AS char_max_length,
      c.NUMERIC_PRECISION AS numeric_precision,
      c.NUMERIC_SCALE AS numeric_scale,
      c.COLUMN_COMMENT AS column_comment,
      CASE WHEN pk.CONSTRAINT_NAME IS NOT NULL THEN 'YES' ELSE 'NO' END AS is_primary_key,
      pk.CONSTRAINT_NAME AS primary_key_name,
      pk.ORDINAL_POSITION AS pk_ordinal_position,
      CASE WHEN fk.CONSTRAINT_NAME IS NOT NULL THEN 'YES' ELSE 'NO' END AS is_foreign_key,
      fk.CONSTRAINT_NAME AS foreign_key_name,
      fk.REFERENCED_TABLE_SCHEMA AS referenced_table_schema,
      fk.REFERENCED_TABLE_NAME AS referenced_table_name,
      fk.REFERENCED_COLUMN_NAME AS referenced_column_name,
      rc.UPDATE_RULE AS fk_update_rule,
      rc.DELETE_RULE AS fk_delete_rule
    FROM INFORMATION_SCHEMA.COLUMNS c
    JOIN INFORMATION_SCHEMA.TABLES t 
      ON t.TABLE_SCHEMA = c.TABLE_SCHEMA AND t.TABLE_NAME = c.TABLE_NAME
    LEFT JOIN (
      SELECT kcu.TABLE_SCHEMA, kcu.TABLE_NAME, kcu.COLUMN_NAME, kcu.CONSTRAINT_NAME, kcu.ORDINAL_POSITION
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu
      JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
        ON tc.CONSTRAINT_SCHEMA = kcu.CONSTRAINT_SCHEMA
       AND tc.TABLE_SCHEMA = kcu.TABLE_SCHEMA
       AND tc.TABLE_NAME = kcu.TABLE_NAME
       AND tc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME
      WHERE tc.CONSTRAINT_TYPE = 'PRIMARY KEY'
    ) pk
      ON pk.TABLE_SCHEMA = c.TABLE_SCHEMA AND pk.TABLE_NAME = c.TABLE_NAME AND pk.COLUMN_NAME = c.COLUMN_NAME
    LEFT JOIN (
      SELECT kcu.CONSTRAINT_SCHEMA, kcu.TABLE_SCHEMA, kcu.TABLE_NAME, kcu.COLUMN_NAME,
             kcu.CONSTRAINT_NAME, kcu.REFERENCED_TABLE_SCHEMA, kcu.REFERENCED_TABLE_NAME, kcu.REFERENCED_COLUMN_NAME
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu
      JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
        ON tc.CONSTRAINT_SCHEMA = kcu.CONSTRAINT_SCHEMA
       AND tc.TABLE_SCHEMA = kcu.TABLE_SCHEMA
       AND tc.TABLE_NAME = kcu.TABLE_NAME
       AND tc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME
      WHERE tc.CONSTRAINT_TYPE = 'FOREIGN KEY'
    ) fk
      ON fk.TABLE_SCHEMA = c.TABLE_SCHEMA AND fk.TABLE_NAME = c.TABLE_NAME AND fk.COLUMN_NAME = c.COLUMN_NAME
    LEFT JOIN INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS rc
      ON rc.CONSTRAINT_SCHEMA = fk.CONSTRAINT_SCHEMA AND rc.CONSTRAINT_NAME = fk.CONSTRAINT_NAME
    WHERE c.TABLE_SCHEMA = ?
    ORDER BY c.TABLE_NAME, c.ORDINAL_POSITION
  `;
  const [rows] = await pool.query(sql, [getDbName()]);
  return rows;
}

async function main() {
  console.log(`[mysql_explorer] Testing connection to database: ${getDbName()}`);
  const ok = await testConnection();
  if (!ok) {
    throw new Error('Database connection test failed. Please verify .env settings.');
  }
  console.log('[mysql_explorer] Connected. Fetching schema info...');
  const rows = await fetchSchema();
  console.log(`[mysql_explorer] Retrieved ${rows.length} column rows. Writing CSV...`);

  const headers = [
    'schema_name','table_name','table_type','column_position','column_name','data_type','column_type','is_nullable','column_default','extra','column_key','char_max_length','numeric_precision','numeric_scale','column_comment',
    'is_primary_key','primary_key_name','pk_ordinal_position','is_foreign_key','foreign_key_name','referenced_table_schema','referenced_table_name','referenced_column_name','fk_update_rule','fk_delete_rule'
  ];

  const out = fs.createWriteStream(OUTPUT_FILE, { encoding: 'utf8' });
  out.write(headers.join(',') + '\n');
  for (const r of rows) {
    const line = headers.map(h => csvEscape(r[h])).join(',');
    out.write(line + '\n');
  }
  out.end();
  await new Promise(res => out.on('finish', res));
  console.log(`[mysql_explorer] CSV written to: ${OUTPUT_FILE}`);
}

main()
  .catch(err => {
    console.error('[mysql_explorer] Error:', err?.message || err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closePool().catch(() => {});
  });
