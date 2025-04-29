import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Wallet API',
			version: '1.0.0',
			description:
				'Wallet Api documentation with Express and Typescript.',
		},
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
		},
		security: [{ bearerAuth: [] }],
	},
	apis: ['./src/presentation/**/*.ts'],
});
