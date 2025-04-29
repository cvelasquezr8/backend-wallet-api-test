import { JwtAdapter } from '@config/jwt';
import { RegisterUserDto } from '@domain/dtos/auth/register-user.dto';
import { CustomError } from '@domain/errors/custom.error';
import { UserToken } from '@domain/interfaces/auth';
import { AuthRepository } from '@domain/repositories/auth.repository';

interface RegisterUserUseCase {
	execute(registerUserDto: RegisterUserDto): Promise<UserToken>;
}

type SignToken = (payload: Object, duration?: string) => Promise<string | null>;

export class RegisterUser implements RegisterUserUseCase {
	constructor(
		private readonly authRepository: AuthRepository,
		private readonly signToken: SignToken = JwtAdapter.generateToken,
	) {}

	async execute(registerUserDto: RegisterUserDto): Promise<UserToken> {
		const user = await this.authRepository.register(registerUserDto);
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
