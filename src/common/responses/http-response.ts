import { Response } from 'express';

interface HttpResponseOptions<T> {
	res: Response;
	data?: T;
	message?: string;
	statusCode?: number;
	path?: string;
	startTime?: number;
}

export class HttpResponse {
	static success<T>({
		res,
		data,
		message = 'Success',
		statusCode = 200,
		path,
		startTime,
	}: HttpResponseOptions<T>): Response {
		const duration = startTime ? `${Date.now() - startTime}ms` : undefined;
		if (duration) res.set('X-Response-Time', duration);
		res.set('X-Server-Timestamp', new Date().toISOString());
		res.set('X-Version', '1.0.0');

		return res.status(statusCode).json({
			data,
			message,
			statusCode,
			timestamp: new Date().toISOString(),
			path: path ?? res.req.originalUrl,
		});
	}

	static error({
		res,
		message = 'Internal Server Error',
		statusCode = 500,
		path,
		startTime,
	}: Omit<HttpResponseOptions<null>, 'data'>): Response {
		const duration = startTime ? `${Date.now() - startTime}ms` : undefined;
		if (duration) res.set('X-Response-Time', duration);
		res.set('X-Server-Timestamp', new Date().toISOString());
		res.set('X-Version', '1.0.0');

		return res.status(statusCode).json({
			data: null,
			message,
			statusCode,
			timestamp: new Date().toISOString(),
			path: path ?? res.req.originalUrl,
		});
	}
}
