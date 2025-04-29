import { Request, Response } from 'express';
import {
	RegisterUserDto,
	AuthRepository,
	CustomError,
	RegisterUser,
	LoginUserDto,
	LoginUser,
	LogoutUser,
} from '@domain/index';
import { HttpResponse } from '@common/responses/http-response';

export class AuthController {
	constructor(private readonly authRepository: AuthRepository) {}

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

	registerUser = async (req: Request, res: Response): Promise<any> => {
		const startTime = Date.now();
		const [error, userRegisterDto] = RegisterUserDto.create(req.body);
		if (error) {
			return HttpResponse.error({
				res,
				message: error,
				statusCode: 400,
				startTime,
			});
		}

		new RegisterUser(this.authRepository)
			.execute(userRegisterDto!)
			.then((data) => {
				return HttpResponse.success({
					res,
					statusCode: 201,
					message: `User registered successfully`,
					data,
					startTime,
				});
			})
			.catch((error) => this.handleError(error, res));
	};

	loginUser = async (req: Request, res: Response): Promise<any> => {
		const startTime = Date.now();
		const [error, loginUserDto] = LoginUserDto.create(req.body);
		if (error) {
			return HttpResponse.error({
				res,
				message: error,
				statusCode: 400,
				startTime,
			});
		}

		new LoginUser(this.authRepository)
			.execute(loginUserDto!)
			.then((data) => {
				return HttpResponse.success({
					res,
					statusCode: 200,
					message: `User logged in successfully`,
					data,
					startTime,
				});
			})
			.catch((error) => this.handleError(error, res));
	};

	logoutUser = async (req: Request, res: Response): Promise<any> => {
		const startTime = Date.now();
		const token = req.header('Authorization')?.replace('Bearer ', '');

		if (!token) {
			return HttpResponse.error({
				res,
				message: 'Token is missing',
				statusCode: 400,
				startTime,
			});
		}

		new LogoutUser(this.authRepository)
			.execute(token)
			.then(() => {
				return HttpResponse.success({
					res,
					message: 'User logged out successfully',
					startTime,
				});
			})
			.catch((error) => this.handleError(error, res));
	};
}
