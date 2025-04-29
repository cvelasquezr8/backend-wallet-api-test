import express, { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '@config/index';
import pinoHttp from 'pino-http';
import { logger } from '@config/index';
import cors from 'cors';

interface Options {
	port: number;
	routes: Router;
}

export class Server {
	public readonly app = express();
	private readonly port: number;
	private readonly routes: Router;

	constructor(options: Options) {
		const { port, routes } = options;
		this.port = port;
		this.routes = routes;
	}

	async start() {
		const allowedOrigins = [
			'http://localhost:3000',
			'http://localhost:3001',
		];

		//* CORS - In case if you want to use it
		this.app.use(
			cors({
				origin: (origin, callback) => {
					if (!origin || allowedOrigins.includes(origin)) {
						callback(null, true);
					} else {
						callback(new Error('Not allowed by CORS'));
					}
				},
				methods: ['GET', 'POST', 'PUT', 'DELETE'],
				allowedHeaders: ['Content-Type', 'Authorization'],
				credentials: true,
			}),
		);

		//* Middlewares
		this.app.use(express.json()); // raw
		this.app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded

		//* Logger
		// this.app.use(pinoHttp({ logger }));

		//* Swagger
		this.app.use(
			'/api-docs',
			swaggerUi.serve,
			swaggerUi.setup(swaggerSpec),
		);

		//* Routes
		this.app.use(this.routes);

		this.app.listen(this.port, () => {
			logger.info(`Server running on port ${this.port}`);
		});
	}
}
