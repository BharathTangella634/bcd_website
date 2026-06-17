import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const PROJECT_ID = 'bcd-prototypes';

const SECRET_MAP = {
  'tanuh-mysql-user': 'MYSQL_USER',
  'tanuh-mysql-password': 'MYSQL_PASSWORD',
  'tanuh-mysql-db': 'MYSQL_DB',
  'tanuh-cloud-sql-connection-name': 'CLOUD_SQL_CONNECTION_NAME',
};

export async function loadSecrets() {
  try {
    const client = new SecretManagerServiceClient();
    const entries = Object.entries(SECRET_MAP);

    const results = await Promise.all(
      entries.map(async ([secretName, envVar]) => {
        if (process.env[envVar]) return null;
        const name = `projects/${PROJECT_ID}/secrets/${secretName}/versions/latest`;
        const [version] = await client.accessSecretVersion({ name });
        return [envVar, version.payload.data.toString('utf8')];
      })
    );

    for (const result of results) {
      if (result) {
        const [envVar, value] = result;
        process.env[envVar] = value;
      }
    }

    console.log('✅ Secrets loaded from Secret Manager');
  } catch (err) {
    console.warn('⚠️  Secret Manager unavailable, falling back to env vars:', err.message);
  }
}
