import { prisma } from '@data/postgres';
import {
	CreateWalletDto,
	CustomError,
	UpdateWalletDto,
	WalletDatasource,
	WalletEntity,
} from '@domain/index';
import { WalletMapper } from '@infrastructure/mappers/wallet.mapper';
import { logger } from '@config/index';

export class WalletDataSourceImpl implements WalletDatasource {
	async create(
		userId: string,
		walletDto: CreateWalletDto,
	): Promise<WalletEntity> {
		const { address, chain, tag = null } = walletDto;

		try {
			//1 Check if the wallet already exists
			const exists = await prisma.wallet.findFirst({
				where: { address, userId },
			});

			if (exists) throw CustomError.badRequest('Wallet already exists');

			//2 Create a new wallet in the database
			const wallet = await prisma.wallet.create({
				data: {
					userId,
					chain,
					address,
					tag,
				},
			});

			logger.info(
				`Wallet ${wallet.address} created successfully for user ${userId}`,
			);
			//3 Return the wallet data
			return WalletMapper.walletEntityFromObject(wallet);
		} catch (error) {
			if (error instanceof CustomError) {
				logger.error(`Error in create wallet: ${error.message}`);
				throw error;
			}

			logger.error('Error in create wallet: Internal server error');
			throw CustomError.internalServerError();
		}
	}

	async findAllByUser(userId: string): Promise<WalletEntity[]> {
		try {
			const wallets = await prisma.wallet.findMany({
				where: { userId },
			});
			return wallets.map(WalletMapper.walletEntityFromObject);
		} catch (error) {
			logger.error(`Error in findAllByUser. UserID: ${userId}`);
			throw CustomError.internalServerError('Failed to fetch wallets');
		}
	}

	async findById(id: string, userId: string): Promise<WalletEntity> {
		try {
			//1 Check if the wallet exists
			const wallet = await prisma.wallet.findFirst({
				where: { id, userId },
			});

			if (!wallet) throw CustomError.notFound('Wallet not found');

			logger.info(`Wallet ${wallet.address} found for user ${userId}`);
			//2 Return the wallet data
			return WalletMapper.walletEntityFromObject(wallet);
		} catch (error) {
			if (error instanceof CustomError) {
				logger.error(
					`Error in findById. UserID: ${userId}. WalletID: ${id}. ${error.message}`,
				);
				throw error;
			}

			logger.error(
				`Error in findById. UserID: ${userId}. WalletID: ${id}. Internal server error`,
			);
			throw CustomError.internalServerError('Failed to fetch wallet');
		}
	}

	async update(
		id: string,
		userId: string,
		updateWalletDto: UpdateWalletDto,
	): Promise<WalletEntity> {
		try {
			const _ = await this.findById(id, userId);
			const updated = await prisma.wallet.update({
				where: { id },
				data: {
					chain: updateWalletDto.chain,
					address: updateWalletDto.address,
					tag: updateWalletDto.tag,
				},
			});

			logger.info(
				`Wallet ${updated.address} updated successfully for user ${userId}`,
			);
			return WalletMapper.walletEntityFromObject(updated);
		} catch (error) {
			if (error instanceof CustomError) {
				logger.error(
					`Error in update. UserID: ${userId}. WalletID: ${id}. Body: ${JSON.stringify(
						updateWalletDto,
					)}. ${error.message}`,
				);
				throw error;
			}

			logger.error(
				`Error in update. UserID: ${userId}. WalletID: ${id}. Body: ${JSON.stringify(
					updateWalletDto,
				)}. Internal server error`,
			);
			throw CustomError.internalServerError('Failed to update wallet');
		}
	}

	async delete(id: string, userId: string): Promise<boolean> {
		try {
			const _ = await this.findById(id, userId);
			await prisma.wallet.delete({ where: { id } });
			logger.info(`Wallet ${id} deleted successfully for user ${userId}`);
			return true;
		} catch (error) {
			if (error instanceof CustomError) {
				logger.error(
					`Error in delete. UserID: ${userId}. WalletID: ${id}. ${error.message}`,
				);
				throw error;
			}

			logger.error(
				`Error in delete. UserID: ${userId}. WalletID: ${id}. Internal server error`,
			);
			throw CustomError.internalServerError('Failed to delete wallet');
		}
	}
}
