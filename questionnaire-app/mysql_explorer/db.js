// mysql_explorer/db.js
// ESM module — Cloud SQL Connector (private IP) or direct MySQL pool
// Usage: import { getPool, testConnection } from './db.js'

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import process from 'node:process';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../backend/.env');

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

function getConfig() {
  return {
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT || 3306),
    database: process.env.MYSQL_DB,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  };
}

const POOL_OPTS = {
  waitForConnections: true,
  connectionLimit: Number(process.env.MYSQL_POOL_SIZE || 25),
  queueLimit: 0,
  connectTimeout: 10_000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10_000,
  maxIdle: 5,
  idleTimeout: 60_000,
  charset: 'utf8mb4',
};

let pool;
let connector;

async function buildConnectorPool() {
  const { Connector, IpAddressTypes } = await import('@google-cloud/cloud-sql-connector');

  const cloudSqlConnectionName = process.env.CLOUD_SQL_CONNECTION_NAME || '';
  const connectorIpType = (process.env.CLOUD_SQL_IP_TYPE || 'PRIVATE').toUpperCase();
  const config = getConfig();

  connector = new Connector();
  const ipType = connectorIpType === 'PUBLIC' ? IpAddressTypes.PUBLIC : IpAddressTypes.PRIVATE;
  const clientOpts = await connector.getOptions({
    instanceConnectionName: cloudSqlConnectionName,
    ipType,
  });

  return mysql.createPool({
    ...clientOpts,
    user: config.user,
    password: config.password,
    database: config.database,
    ...POOL_OPTS,
  });
}

function buildDirectPool() {
  const config = getConfig();
  return mysql.createPool({
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.user,
    password: config.password,
    ...POOL_OPTS,
  });
}

export async function getPool() {
  if (!pool) {
    const useConnector = (process.env.USE_CLOUD_SQL_CONNECTOR || '').toLowerCase() === 'true';
    const connectionName = process.env.CLOUD_SQL_CONNECTION_NAME || '';
    if (useConnector && connectionName) {
      pool = await buildConnectorPool();
    } else {
      pool = buildDirectPool();
    }
  }
  return pool;
}

export async function testConnection() {
  const p = await getPool();
  const [rows] = await p.query('SELECT 1 AS ok');
  return rows?.[0]?.ok === 1;
}

export async function closePool() {
  if (pool) {
    await pool.end();
    pool = undefined;
  }
  if (connector) {
    connector.close();
    connector = undefined;
  }
}

export function getDbName() {
  return process.env.MYSQL_DB;
}
