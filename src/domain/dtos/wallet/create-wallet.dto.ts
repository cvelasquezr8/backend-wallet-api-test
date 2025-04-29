export class CreateWalletDto {
	private constructor(
		public readonly tag: string | undefined,
		public readonly chain: string,
		public readonly address: string,
	) {}

	static create(object: { [key: string]: any }): [string?, CreateWalletDto?] {
		const { tag, chain, address } = object;

		if (!chain) return ['Chain is required'];
		if (!address) return ['Address is required'];

		return [undefined, new CreateWalletDto(tag, chain, address)];
	}
}
