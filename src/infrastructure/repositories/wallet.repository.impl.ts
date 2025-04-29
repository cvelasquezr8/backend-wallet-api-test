import {
	CreateWalletDto,
	WalletDatasource,
	WalletEntity,
	WalletRepository,
} from '@domain/index';

export class WalletRepositoryImpl implements WalletRepository {
	constructor(private readonly walletDataSource: WalletDatasource) {}

	create(
		userId: string,
		walletCreateDto: CreateWalletDto,
	): Promise<WalletEntity> {
		return this.walletDataSource.create(userId, walletCreateDto);
	}

	findAllByUser(userId: string): Promise<WalletEntity[]> {
		return this.walletDataSource.findAllByUser(userId);
	}

	findById(id: string, userId: string): Promise<WalletEntity | null> {
		return this.walletDataSource.findById(id, userId);
	}

	update(
		id: string,
		userId: string,
		walletUpdateDto: CreateWalletDto,
	): Promise<WalletEntity | null> {
		return this.walletDataSource.update(id, userId, walletUpdateDto);
	}

	delete(id: string, userId: string): Promise<boolean> {
		return this.walletDataSource.delete(id, userId);
	}
}
