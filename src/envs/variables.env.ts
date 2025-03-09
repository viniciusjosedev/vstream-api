export const variablesEnv = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.port || 8080,
  jwtSecret: process.env.JWT_SECRET || 'secret',
  jwtExpires: process.env.JWT_EXPIRES || '30d',
  jwtPassphrase: process.env.JWT_PASSPHRASE,
  cookies: process.env.COOKIES || '',
};
