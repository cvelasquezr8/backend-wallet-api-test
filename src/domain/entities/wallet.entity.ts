export class WalletEntity {
	constructor(
		public readonly id: string,
		public readonly userId: string,
		public readonly chain: string,
		public readonly address: string,
		public readonly tag: string | null,
		public readonly createdAt: Date,
		public readonly updatedAt: Date,
	) {}
}
