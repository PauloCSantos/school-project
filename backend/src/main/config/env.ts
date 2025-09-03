import 'dotenv/config';

export type AppEnvironment = 'development' | 'production';

function ensureEnv(name: string): string {
  const v = process.env[name];
  if (!v || v.trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return v;
}

const PORT_RAW = process.env.PORT ?? '3000';
const PORT = Number(PORT_RAW);
if (!Number.isInteger(PORT) || PORT <= 0) {
  throw new Error(`Invalid PORT: "${PORT_RAW}". It must be a positive integer.`);
}

const JWT_SECRET = ensureEnv('JWT_SECRET');
const ENVIRONMENT = ensureEnv('ENVIRONMENT');

export const config = Object.freeze({
  env: ENVIRONMENT as AppEnvironment,
  port: PORT,
  jwt: Object.freeze({ secret: JWT_SECRET }),
});

export const isProd = config.env === 'production';
