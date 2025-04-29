import { WalletRepository } from '@domain/repositories/wallet.repository';
import { CreateWalletDto } from '@domain/dtos/wallet/create-wallet.dto';
import { WalletEntity } from '@domain/entities/wallet.entity';
import { CustomError } from '@domain/errors/custom.error';

interface CreateWalletUseCase {
	execute(userId: string, dto: CreateWalletDto): Promise<WalletEntity>;
}

export class CreateWallet implements CreateWalletUseCase {
	constructor(private readonly walletRepository: WalletRepository) {}

	async execute(userId: string, dto: CreateWalletDto): Promise<WalletEntity> {
		const [error, validatedDto] = CreateWalletDto.create(dto);
		if (error || !validatedDto)
			throw CustomError.badRequest(error ?? 'Invalid payload');

		return this.walletRepository.create(userId, validatedDto);
	}
}
