import Redis from 'ioredis';

const redis = new Redis(); 


export async function blacklistToken(token: string, expSeconds: number): Promise<void> {
  await redis.set(`blacklist:${token}`, 'true', 'EX', expSeconds);
}

export async function isTokenBlacklisted(token: string): Promise<boolean> {
  const result = await redis.get(`blacklist:${token}`);
  return result === 'true';
}