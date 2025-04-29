import { BcryptAdapter, JwtAdapter } from '@config/index';
import { prisma } from '@data/postgres';
import {
	AuthDatasource,
	RegisterUserDto,
	UserEntity,
	CustomError,
	LoginUserDto,
} from '@domain/index';
import { logger } from '@config/index';
import { UserMapper } from '@infrastructure/mappers/user.mapper';

type HashFunction = (password: string) => string;
type ComparePassword = (password: string, hashed: string) => boolean;

export class AuthDataSourceImpl implements AuthDatasource {
	constructor(
		private readonly hashFunction: HashFunction = BcryptAdapter.hash,
		private readonly comparePassword: ComparePassword = BcryptAdapter.compare,
	) {}

	private findUserByEmail(email: string): Promise<UserEntity | null> {
		return prisma.user.findUnique({ where: { email } });
	}

	async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
		const { email, password } = loginUserDto;

		try {
			//1. Check if the user exists
			const user = await this.findUserByEmail(email);
			if (!user) throw CustomError.badRequest('Invalid credentials');

			//2. Check if the password is correct
			const isMatching = this.comparePassword(password, user.password);
			if (!isMatching)
				throw CustomError.badRequest('Invalid credentials');

			logger.info(`User ${email} logged in successfully`);
			//3. Return user data
			return UserMapper.userEntityFromObject(user);
		} catch (error) {
			if (error instanceof CustomError) {
				logger.error(`Error in login: ${error.message}`);
				throw error;
			}

			logger.error('Error in login: Internal server error');
			throw CustomError.internalServerError();
		}
	}

	async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
		const { email, firstName, lastName, password } = registerUserDto;
		try {
			//1. Check if the user already exists
			const userExists = await this.findUserByEmail(email);
			if (userExists) throw CustomError.badRequest('User already exists');

			//2. Hash the password
			const hashedPassword = this.hashFunction(password);

			//3. Create a new user in the database
			const user = await prisma.user.create({
				data: {
					firstName,
					lastName,
					email,
					password: hashedPassword,
				},
			});

			logger.info(`User ${email} registered successfully`);
			//4. Return the created user
			return UserMapper.userEntityFromObject(user);
		} catch (error) {
			if (error instanceof CustomError) {
				logger.error(`Error in register: ${error.message}`);
				throw error;
			}

			logger.error('Error in register: Internal server error');
			throw CustomError.internalServerError();
		}
	}

	async logout(token: string): Promise<void> {
		try {
			const payload = JwtAdapter.decodeToken(token);
			if (!payload?.exp) throw CustomError.badRequest('Invalid token');

			const expiresAt = new Date(payload.exp * 1000);

			await prisma.revokedToken.create({
				data: {
					token,
					expiresAt,
				},
			});

			logger.info(`User logged out successfully`);
		} catch (error) {
			logger.error('Error in logout. Internal server error.');
			throw CustomError.internalServerError('Logout failed');
		}
	}
}
