import { WalletRepository } from '@domain/repositories/wallet.repository';
import { WalletEntity } from '@domain/entities/wallet.entity';

interface FindWalletsUseCase {
	execute(userId: string): Promise<WalletEntity[]>;
}

export class FindWallets implements FindWalletsUseCase {
	constructor(private readonly walletRepository: WalletRepository) {}

	async execute(userId: string): Promise<WalletEntity[]> {
		return this.walletRepository.findAllByUser(userId);
	}
}
