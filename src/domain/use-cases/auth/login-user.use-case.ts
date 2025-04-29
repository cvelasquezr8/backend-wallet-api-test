import { JwtAdapter } from '@config/jwt';
import { LoginUserDto } from '@domain/dtos/auth/login-user.dto';
import { RegisterUserDto } from '@domain/dtos/auth/register-user.dto';
import { CustomError } from '@domain/errors/custom.error';
import { UserToken } from '@domain/interfaces/auth';
import { AuthRepository } from '@domain/repositories/auth.repository';

interface LoginUserUseCase {
	execute(registerUserDto: RegisterUserDto): Promise<UserToken>;
}

type SignToken = (payload: Object, duration?: string) => Promise<string | null>;

export class LoginUser implements LoginUserUseCase {
	constructor(
		private readonly authRepository: AuthRepository,
		private readonly signToken: SignToken = JwtAdapter.generateToken,
	) {}

	async execute(loginUserDto: LoginUserDto): Promise<UserToken> {
		const user = await this.authRepository.login(loginUserDto);
		const token = await this.signToken({ id: user.id }, '2h');
		if (!token)
			throw CustomError.internalServerError('Failed to generate token');

		return {
			token: token,
			user: {
				id: user.id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
			},
		};
	}
}
