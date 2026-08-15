export const logger = {
  info: (message: string, meta?: Record<string, unknown>) => {
    console.log(JSON.stringify({ level: 'INFO', timestamp: new Date().toISOString(), message, ...maskSecrets(meta) }));
  },
  warn: (message: string, meta?: Record<string, unknown>) => {
    console.warn(JSON.stringify({ level: 'WARN', timestamp: new Date().toISOString(), message, ...maskSecrets(meta) }));
  },
  error: (message: string, error?: unknown, meta?: Record<string, unknown>) => {
    const errObj = error instanceof Error ? { name: error.name, message: error.message } : { error };
    console.error(JSON.stringify({ level: 'ERROR', timestamp: new Date().toISOString(), message, ...errObj, ...maskSecrets(meta) }));
  }
};

function maskSecrets(meta?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!meta) return undefined;
  const masked = { ...meta };
  const sensitiveKeys = ['password', 'token', 'authorization', 'cookie', 'secret', 'key'];
  for (const key of Object.keys(masked)) {
    if (sensitiveKeys.some(s => key.toLowerCase().includes(s))) {
      masked[key] = '[REDACTED]';
    }
  }
  return masked;
}
