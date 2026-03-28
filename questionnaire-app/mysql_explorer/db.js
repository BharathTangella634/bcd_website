// mysql_explorer/db.js
// ESM module to create a MySQL connection pool using mysql2 and .env values
// Usage: import { getPool, testConnection } from './db.js'

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import process from 'node:process';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

// Resolve .env in questionnaire-app/.env relative to this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../backend/.env');

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  // Fallback to default .env loading (if any)
  dotenv.config();
}

function required(name, value) {
  if (!value || value === '') {
    console.error(`❌ Missing required env var ${name}`);
    throw new Error(`Missing required env var ${name}`);
  }
  return value;
}

// Do NOT throw at module load time when env is missing; defer validation to connection time.
const config = {
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT || 3306),
  database: process.env.MYSQL_DB,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  // Optional extra connection options via MYSQL_QUERY (e.g., charset=utf8mb4&ssl=false)
  // We'll parse simple key=value pairs joined by & and apply a few known ones.
};

function parseExtraOptions(query) {
  if (!query) return {};
  return query.split('&').reduce((acc, pair) => {
    const [k, v] = pair.split('=');
    if (!k) return acc;
    const key = k.trim();
    const val = (v ?? '').trim();
    switch (key) {
      case 'charset':
        acc.charset = val; break;
      case 'ssl':
        // allow 'true'/'false'
        acc.ssl = val === 'true' ? {} : false; break;
      case 'connectTimeout':
        acc.connectTimeout = Number(val); break;
      case 'timezone':
        acc.timezone = val; break;
      default:
        // Attach unknown options under "flags" for mysql2 where applicable
        acc[key] = val;
    }
    return acc;
  }, {});
}

const extra = parseExtraOptions(process.env.MYSQL_QUERY || '');

// SSL configuration
if (process.env.MYSQL_SSL_CA || process.env.MYSQL_SSL_CERT || process.env.MYSQL_SSL_KEY) {
  const sslConfig = {};
  
  // Try to find the files in common locations:
  // 1. Path as provided (absolute or relative to CWD)
  // 2. Relative to questionnaire-app/ (project root for this app)
  
  const resolveSslFile = (envVar) => {
    const filePath = process.env[envVar];
    if (!filePath) return null;
    
    // 1. Try path as provided (relative to CWD or absolute)
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath);
    }
    
    // 2. Try relative to the app root (one level up from this file)
    const appRootPath = path.resolve(__dirname, '..', filePath);
    if (fs.existsSync(appRootPath)) {
      return fs.readFileSync(appRootPath);
    }

    // 3. Try relative to /app (common in Docker)
    const dockerPath = path.resolve('/app', filePath);
    if (fs.existsSync(dockerPath)) {
      return fs.readFileSync(dockerPath);
    }
    
    console.warn(`⚠️ Warning: SSL file not found for ${envVar}: ${filePath}`);
    return null;
  };

  if (process.env.MYSQL_SSL_CA) sslConfig.ca = resolveSslFile('MYSQL_SSL_CA');
  if (process.env.MYSQL_SSL_CERT) sslConfig.cert = resolveSslFile('MYSQL_SSL_CERT');
  if (process.env.MYSQL_SSL_KEY) sslConfig.key = resolveSslFile('MYSQL_SSL_KEY');
  
  // Fix for DeprecationWarning: Setting the TLS ServerName to an IP address is not permitted by RFC 6066
  // If the host is an IP address, we should set servername to false or a specific hostname.
  const isIP = (host) => /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(host) || host.includes(':');
  if (config.host && isIP(config.host)) {
    sslConfig.servername = 'localhost'; // Use dummy servername
    sslConfig.rejectUnauthorized = false; // Trust the remote cert
    sslConfig.checkServerIdentity = () => undefined; // Bypass the Node.js IP check
  }
  
  if (Object.keys(sslConfig).length > 0) {
    extra.ssl = sslConfig;
  }
}

let pool;

function ensureConfig() {
  // Validate required env vars at connection time rather than module load.
  required('MYSQL_HOST', config.host);
  required('MYSQL_DB', config.database);
  required('MYSQL_USER', config.user);
  required('MYSQL_PASSWORD', config.password);
}

export function getPool() {
  if (!pool) {
    ensureConfig();
    pool = mysql.createPool({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ...extra,
    });
  }
  return pool;
}

export async function testConnection() {
  const p = getPool();
  const [rows] = await p.query('SELECT 1 AS ok');
  return rows?.[0]?.ok === 1;
}

export async function closePool() {
  if (pool) {
    await pool.end();
    pool = undefined;
  }
}

export const dbName = config.database;
