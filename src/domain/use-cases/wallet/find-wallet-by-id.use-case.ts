import { WalletRepository } from '@domain/repositories/wallet.repository';
import { WalletEntity } from '@domain/entities/wallet.entity';
import { CustomError } from '@domain/errors/custom.error';

interface FindWalletByIdUseCase {
	execute(id: string, userId: string): Promise<WalletEntity>;
}

export class FindWalletById implements FindWalletByIdUseCase {
	constructor(private readonly walletRepository: WalletRepository) {}

	async execute(id: string, userId: string): Promise<WalletEntity> {
		const wallet = await this.walletRepository.findById(id, userId);
		if (!wallet) throw CustomError.notFound('Wallet not found');
		return wallet;
	}
}
