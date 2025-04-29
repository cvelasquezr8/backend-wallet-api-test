import { WalletRepository } from '@domain/repositories/wallet.repository';
import { WalletEntity } from '@domain/entities/wallet.entity';
import { UpdateWalletDto } from '@domain/dtos/wallet/update-wallet.dto';
import { CustomError } from '@domain/errors/custom.error';

interface UpdateWalletUseCase {
	execute(
		id: string,
		userId: string,
		dto: UpdateWalletDto,
	): Promise<WalletEntity>;
}

export class UpdateWallet implements UpdateWalletUseCase {
	constructor(private readonly walletRepository: WalletRepository) {}

	async execute(
		id: string,
		userId: string,
		dto: UpdateWalletDto,
	): Promise<WalletEntity> {
		const [error, validatedDto] = UpdateWalletDto.create(dto);
		if (error || !validatedDto)
			throw CustomError.badRequest(error ?? 'Invalid payload');

		const wallet = await this.walletRepository.update(
			id,
			userId,
			validatedDto,
		);
		if (!wallet)
			throw CustomError.notFound('Wallet not found or not owned by user');

		return wallet;
	}
}
