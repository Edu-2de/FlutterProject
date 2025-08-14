// Setup para testes
process.env.JWT_SECRET = 'test-jwt-secret-key';
process.env.NODE_ENV = 'test';
process.env.DB_USER = 'testuser';
process.env.DB_HOST = 'localhost';
process.env.DB_NAME = 'testdb';
process.env.DB_PASSWORD = 'testpass';
process.env.DB_PORT = '5432';

// Mock do pool de conexões do banco
jest.mock('../../database/connection', () => ({
  query: jest.fn(),
}));
