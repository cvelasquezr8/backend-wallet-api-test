import { AuthRepository } from '@domain/repositories/auth.repository';
import { CustomError } from '@domain/errors/custom.error';

interface LogoutUseCase {
	execute(token: string): Promise<void>;
}

export class LogoutUser implements LogoutUseCase {
	constructor(private readonly authRepository: AuthRepository) {}

	async execute(token: string): Promise<void> {
		if (!token) throw CustomError.badRequest('Token is missing');

		await this.authRepository.logout(token);
	}
}
