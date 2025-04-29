import { WalletRepository } from '@domain/repositories/wallet.repository';
import { CustomError } from '@domain/errors/custom.error';

interface DeleteWalletUseCase {
	execute(id: string, userId: string): Promise<void>;
}

export class DeleteWallet implements DeleteWalletUseCase {
	constructor(private readonly walletRepository: WalletRepository) {}

	async execute(id: string, userId: string): Promise<void> {
		const deleted = await this.walletRepository.delete(id, userId);
		if (!deleted)
			throw CustomError.notFound('Wallet not found or not owned by user');
	}
}
