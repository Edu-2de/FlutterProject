import { AuthController } from '../controllers/authController';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserService } from '../services/UserService';
import { messages } from '../utils/messages';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

jest.mock('../services/UserService', () => ({
  UserService: {
    findUserByEmail: jest.fn(),
    createUser: jest.fn(),
  },
}));

const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockJwt = jwt as jest.Mocked<typeof jwt>;
const mockUserService = UserService as jest.Mocked<typeof UserService>;

describe('AuthController', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: any;

  beforeEach(() => {
    mockReq = {
      body: {},
      user: undefined,
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      mockReq.body = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone: '123456789',
        password: 'Password123!',
      };

      mockUserService.findUserByEmail.mockResolvedValue(null); 
      (mockBcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword'); 
      mockUserService.createUser.mockResolvedValue({ id: 1 }); 

      await AuthController.register(mockReq, mockRes, mockNext);

      expect(mockUserService.findUserByEmail).toHaveBeenCalledWith('john.doe@example.com');
      expect(mockBcrypt.hash).toHaveBeenCalledWith('Password123!', 10);
      expect(mockUserService.createUser).toHaveBeenCalledWith(
        'John',
        'Doe',
        'john.doe@example.com',
        '123456789',
        'hashedPassword'
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: messages.success.USER_REGISTERED,
        code: 'USER_REGISTERED',
        data: { userId: 1 },
      });
    });

    it('should return an error if email already exists', async () => {
      mockReq.body = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone: '123456789',
        password: 'Password123!',
      };

      mockUserService.findUserByEmail.mockResolvedValue({ id: 1 });

      await AuthController.register(mockReq, mockRes, mockNext);

      expect(mockUserService.findUserByEmail).toHaveBeenCalledWith('john.doe@example.com');
      expect(mockNext).toHaveBeenCalledWith({
        status: 409,
        message: messages.errors.EMAIL_ALREADY_EXISTS,
        code: 'EMAIL_ALREADY_EXISTS',
      });
    });

    it('should return an error if validation fails', async () => {
      mockReq.body = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'invalid-email',
        phone: '123456789',
        password: 'Password123!',
      };

      await AuthController.register(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith({
        status: 400,
        message: expect.stringContaining('email'),
        code: 'VALIDATION_ERROR',
      });
    });
  });

  describe('login', () => {
    it('should log in a user successfully', async () => {
      mockReq.body = {
        email: 'john.doe@example.com',
        password: 'Password123!',
      };

      const mockUser = {
        id: 1,
        email: 'john.doe@example.com',
        password: 'hashedPassword',
        first_name: 'John',
        role: 'customer',
      };

      mockUserService.findUserByEmail.mockResolvedValue({ rows: [mockUser] }); 
      (mockBcrypt.compare as jest.Mock).mockResolvedValue(true); 
      (mockJwt.sign as jest.Mock).mockReturnValue('mockedToken'); 

      await AuthController.login(mockReq, mockRes, mockNext);

      expect(mockUserService.findUserByEmail).toHaveBeenCalledWith('john.doe@example.com');
      expect(mockBcrypt.compare).toHaveBeenCalledWith('Password123!', 'hashedPassword');
      expect(mockJwt.sign).toHaveBeenCalledWith(
        { id: mockUser.id, email: mockUser.email, role: mockUser.role },
        expect.any(String),
        { expiresIn: '15m' }
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: messages.success.LOGIN_SUCCESS,
        code: 'LOGIN_SUCCESS',
        data: {
          token: 'mockedToken',
          user: {
            id: mockUser.id,
            email: mockUser.email,
            name: mockUser.first_name,
            role: mockUser.role,
          },
        },
      });
    });

    it('should return an error if email does not exist', async () => {
      mockReq.body = {
        email: 'john.doe@example.com',
        password: 'Password123!',
      };

      mockUserService.findUserByEmail.mockResolvedValue(null);

      await AuthController.login(mockReq, mockRes, mockNext);

      expect(mockUserService.findUserByEmail).toHaveBeenCalledWith('john.doe@example.com');
      expect(mockNext).toHaveBeenCalledWith({
        status: 401,
        message: messages.errors.INVALID_CREDENTIALS,
        code: 'INVALID_CREDENTIALS',
      });
    });

    it('should return an error if password is incorrect', async () => {
      mockReq.body = {
        email: 'john.doe@example.com',
        password: 'WrongPassword!',
      };

      const mockUser = {
        id: 1,
        email: 'john.doe@example.com',
        password: 'hashedPassword',
        first_name: 'John',
        role: 'customer',
      };

      mockUserService.findUserByEmail.mockResolvedValue({ rows: [mockUser] });
      (mockBcrypt.compare as jest.Mock).mockResolvedValue(false); 

      await AuthController.login(mockReq, mockRes, mockNext);

      expect(mockUserService.findUserByEmail).toHaveBeenCalledWith('john.doe@example.com');
      expect(mockBcrypt.compare).toHaveBeenCalledWith('WrongPassword!', 'hashedPassword');
      expect(mockNext).toHaveBeenCalledWith({
        status: 401,
        message: messages.errors.INVALID_CREDENTIALS,
        code: 'INVALID_CREDENTIALS',
      });
    });
  });
});
