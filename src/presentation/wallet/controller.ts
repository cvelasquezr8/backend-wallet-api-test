import { Request, Response } from 'express';
import {
	CustomError,
	WalletRepository,
	CreateWalletDto,
	CreateWallet,
	UpdateWalletDto,
} from '@domain/index';
import { HttpResponse } from '@common/responses/http-response';

export class WalletController {
	constructor(private readonly walletRepository: WalletRepository) {}

	private handleError = (error: unknown, res: Response) => {
		if (error instanceof CustomError) {
			return HttpResponse.error({
				res,
				message: error.message,
				statusCode: error.statusCode,
			});
		}

		// Handle other types of errors (e.g., database errors, validation errors)
		return HttpResponse.error({
			res,
			message: 'Internal Server Error',
			statusCode: 500,
		});
	};

	createWallet = async (req: Request, res: Response): Promise<any> => {
		const startTime = Date.now();
		const [error, createWalletDto] = CreateWalletDto.create(req.body);
		if (error) {
			return HttpResponse.error({
				res,
				message: error,
				statusCode: 400,
				startTime,
			});
		}

		const userId = req.user?.id;
		if (!userId) throw CustomError.unauthorized('User not found');

		new CreateWallet(this.walletRepository)
			.execute(userId, createWalletDto!)
			.then((data) => {
				return HttpResponse.success({
					res,
					statusCode: 201,
					message: `Wallet created successfully`,
					data,
					startTime,
				});
			})
			.catch((error) => this.handleError(error, res));
	};

	getWallets = async (req: Request, res: Response): Promise<any> => {
		const startTime = Date.now();
		const userId = req.user?.id;
		if (!userId) throw CustomError.unauthorized('User not found');

		this.walletRepository
			.findAllByUser(userId)
			.then((data) => {
				return HttpResponse.success({
					res,
					statusCode: 200,
					message: `Wallets fetched successfully`,
					data,
					startTime,
				});
			})
			.catch((error) => this.handleError(error, res));
	};

	getWalletById = async (req: Request, res: Response): Promise<any> => {
		const startTime = Date.now();
		const userId = req.user?.id;
		if (!userId) throw CustomError.unauthorized('User not found');

		const walletId = req.params.id;

		this.walletRepository
			.findById(walletId, userId)
			.then((data) => {
				return HttpResponse.success({
					res,
					statusCode: 200,
					message: `Wallet fetched successfully`,
					data,
					startTime,
				});
			})
			.catch((error) => this.handleError(error, res));
	};

	updateWallet = async (req: Request, res: Response): Promise<any> => {
		const startTime = Date.now();
		const userId = req.user?.id;
		if (!userId) throw CustomError.unauthorized('User not found');

		const walletId = req.params.id;

		const [error, updateWalletDto] = UpdateWalletDto.create(req.body);
		if (error) {
			return HttpResponse.error({
				res,
				message: error,
				statusCode: 400,
				startTime,
			});
		}

		this.walletRepository
			.update(walletId, userId, updateWalletDto!)
			.then((data) => {
				return HttpResponse.success({
					res,
					statusCode: 200,
					message: `Wallet updated successfully`,
					data,
					startTime,
				});
			})
			.catch((error) => this.handleError(error, res));
	};

	deleteWallet = async (req: Request, res: Response): Promise<any> => {
		const startTime = Date.now();
		const userId = req.user?.id;
		if (!userId) throw CustomError.unauthorized('User not found');

		const walletId = req.params.id;

		this.walletRepository
			.delete(walletId, userId)
			.then((data) => {
				return HttpResponse.success({
					res,
					statusCode: 200,
					message: `Wallet deleted successfully`,
					data,
					startTime,
				});
			})
			.catch((error) => this.handleError(error, res));
	};
}
