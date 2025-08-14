import { AuthController } from '../controllers/authController';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserService } from '../services/UserService';
import { messages } from '../utils/messages';
import pool from '../database/connection';

jest.mock('../database/connection', () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
  },
}));

const mockPool = pool as jest.Mocked<typeof pool>;

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
    findUserById: jest.fn(),
    getUsersProfile: jest.fn(),
    findUserByPhone: jest.fn(),
    deleteUserProfile: jest.fn(),
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

  describe('getUserProfile', () => {
    it('should get user profile successfully', async () => {
      const mockUser = {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone: '123456789',
        role: 'customer',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      };

      mockReq.user = {
        id: 1,
        email: 'john.doe@example.com',
        role: 'customer',
      };

      mockUserService.findUserById.mockResolvedValue(mockUser);

      await AuthController.getUserProfile(mockReq, mockRes, mockNext);

      expect(mockUserService.findUserById).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: messages.success.PROFILE_FETCHED,
        code: 'PROFILE_FETCHED',
        data: mockUser,
      });
    });

    it('should return an error if user is not authenticated', async () => {
      mockReq.user = undefined;

      await AuthController.getUserProfile(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith({
        status: 401,
        message: messages.errors.UNAUTHORIZED_ACCESS,
        code: 'UNAUTHORIZED_ACCESS',
      });
      expect(mockUserService.findUserById).not.toHaveBeenCalled();
    });

    it('should return an error if user profile is not found', async () => {
      mockReq.user = {
        id: 1,
        email: 'john.doe@example.com',
        role: 'customer',
      };

      mockUserService.findUserById.mockResolvedValue(null);

      await AuthController.getUserProfile(mockReq, mockRes, mockNext);

      expect(mockUserService.findUserById).toHaveBeenCalledWith(1);
      expect(mockNext).toHaveBeenCalledWith({
        status: 404,
        message: messages.errors.USER_NOT_FOUND,
        code: 'USER_NOT_FOUND',
      });
    });

    it('should return an error if userId is missing from req.user', async () => {
      mockReq.user = {
        email: 'john.doe@example.com',
        role: 'customer',
      };

      await AuthController.getUserProfile(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith({
        status: 401,
        message: messages.errors.UNAUTHORIZED_ACCESS,
        code: 'UNAUTHORIZED_ACCESS',
      });
      expect(mockUserService.findUserById).not.toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      mockReq.user = {
        id: 1,
        email: 'john.doe@example.com',
        role: 'customer',
      };

      const serviceError = new Error('Database connection failed');
      mockUserService.findUserById.mockRejectedValue(serviceError);

      await AuthController.getUserProfile(mockReq, mockRes, mockNext);

      expect(mockUserService.findUserById).toHaveBeenCalledWith(1);
      expect(mockNext).toHaveBeenCalledWith(serviceError);
    });
  });

  describe('getUserProfileById', () => {
    it('should get user profile successfully', async () => {
      const mockUser = {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone: '123456789',
        role: 'customer',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      };

      mockReq.params = { userId: '1' };

      mockUserService.findUserById.mockResolvedValueOnce(mockUser);

      await AuthController.getUserProfileById(mockReq, mockRes, mockNext);

      expect(mockUserService.findUserById).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: messages.success.PROFILE_FETCHED,
        code: 'PROFILE_FETCHED',
        data: mockUser,
      });
    });

    it('should return an error if userId is missing', async () => {
      mockReq.params = { userId: undefined };

      await AuthController.getUserProfileById(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith({
        status: 401,
        message: messages.errors.UNAUTHORIZED_ACCESS,
        code: 'UNAUTHORIZED_ACCESS',
      });
      expect(mockUserService.findUserById).not.toHaveBeenCalled();
    });

    it('should return an error if user profile is not found', async () => {
      mockReq.params = { userId: '1' };

      mockUserService.findUserById.mockResolvedValueOnce(null);

      await AuthController.getUserProfileById(mockReq, mockRes, mockNext);

      expect(mockUserService.findUserById).toHaveBeenCalledWith(1);
      expect(mockNext).toHaveBeenCalledWith({
        status: 404,
        message: messages.errors.USER_NOT_FOUND,
        code: 'USER_NOT_FOUND',
      });
    });

    it('should handle service errors', async () => {
      mockReq.user = {
        id: 1,
        email: 'john.doe@example.com',
        role: 'customer',
      };

      const serviceError = new Error('Database connection failed');
      mockUserService.findUserById.mockRejectedValue(serviceError);

      await AuthController.getUserProfile(mockReq, mockRes, mockNext);

      expect(mockUserService.findUserById).toHaveBeenCalledWith(1);
      expect(mockNext).toHaveBeenCalledWith(serviceError);
    });
  });

  describe('getAllUsersProfile', () => {
    it('should be users profile successfully', async () => {
      const mockUsers = [
        {
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          phone: '123456789',
          role: 'customer',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
        {
          id: 2,
          first_name: 'Marta',
          last_name: 'Rol',
          email: 'marta.fol@example.com',
          phone: '543216789',
          role: 'customer',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
        {
          id: 3,
          first_name: 'Helen',
          last_name: 'Rig',
          email: 'helen.rig@example.com',
          phone: '123459876',
          role: 'customer',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
      ];

      mockUserService.getUsersProfile.mockResolvedValueOnce(mockUsers);

      await AuthController.getAllUsersProfile(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: messages.success.PROFILES_FETCHED,
        code: 'PROFILES_FETCHED',
        data: mockUsers,
      });
    });

    it('should return an error if user profiles are not found', async () => {
      mockUserService.getUsersProfile.mockResolvedValueOnce(null);

      await AuthController.getAllUsersProfile(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith({
        status: 404,
        message: messages.errors.USERS_NOT_FOUND,
        code: 'USERS_NOT_FOUND',
      });

      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });
  });

  describe('updateUserProfile', () => {
    it('should be able to successfully update the user', async () => {
      const mockUser = {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone: '123456789',
        role: 'customer',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      };

      const updatedUser = {
        id: 1,
        first_name: 'Jonas',
        last_name: 'Kobe',
        email: 'jonas.doe@example.com',
        phone: '987654321',
        role: 'customer',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      };

      mockReq.user = {
        id: 1,
        email: 'john.doe@example.com',
        role: 'customer',
      };

      mockReq.body = {
        first_name: 'Jonas',
        last_name: 'Kobe',
        email: 'jonas.doe@example.com',
        phone: '987654321',
        password: 'Abc1234@#',
      };

      mockUserService.findUserById.mockResolvedValue(mockUser);
      mockUserService.findUserByEmail.mockResolvedValueOnce(null);
      mockUserService.findUserByPhone.mockResolvedValueOnce(null);
      (mockBcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      (mockPool.query as jest.Mock).mockResolvedValue({ rows: [updatedUser] } as any);

      await AuthController.updateUserProfile(mockReq, mockRes, mockNext);

   
      console.log('mockNext calls:', mockNext.mock.calls);
      console.log('mockRes.json calls:', mockRes.json.mock.calls);
      console.log('mockRes.status calls:', mockRes.status.mock.calls);


      expect(mockNext).not.toHaveBeenCalled();

   
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'User updated successfully',
        user: updatedUser,
      });
    });
  });
});
