import { WalletEntity, CustomError } from '@domain/index';

export class WalletMapper {
	static walletEntityFromObject(object: {
		[key: string]: any;
	}): WalletEntity {
		const { id, userId, chain, address, tag, createdAt, updatedAt } =
			object;

		if (!id) throw CustomError.badRequest('Wallet ID is required');
		if (!userId) throw CustomError.badRequest('User ID is required');
		if (!chain) throw CustomError.badRequest('Chain is required');
		if (!address) throw CustomError.badRequest('Address is required');
		if (!createdAt) throw CustomError.badRequest('createdAt is required');
		if (!updatedAt) throw CustomError.badRequest('updatedAt is required');

		return new WalletEntity(
			id,
			userId,
			chain,
			address,
			tag ?? null,
			new Date(createdAt),
			new Date(updatedAt),
		);
	}
}
