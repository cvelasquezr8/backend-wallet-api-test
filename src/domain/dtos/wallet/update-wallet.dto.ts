export class UpdateWalletDto {
	private constructor(
		public readonly tag?: string,
		public readonly chain?: string,
		public readonly address?: string,
	) {}

	static create(object: { [key: string]: any }): [string?, UpdateWalletDto?] {
		const { tag, chain, address } = object;

		if (!tag && !chain && !address) {
			return [
				'At least one field (tag, chain, or address) is required to update',
			];
		}

		return [undefined, new UpdateWalletDto(tag, chain, address)];
	}
}
