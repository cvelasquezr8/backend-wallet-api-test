import { Router } from 'express';
import { AuthController } from './controller';
import { AuthDataSourceImpl, AuthRepositoryImpl } from '@infrastructure/index';
import { AuthMiddleware } from '@presentation/middlewares/auth.middleware';

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication routes
 */
export class AuthRoutes {
	static get routes(): Router {
		const router = Router();
		const datasource = new AuthDataSourceImpl();
		const authRepository = new AuthRepositoryImpl(datasource);
		const controller = new AuthController(authRepository);

		/**
		 * @swagger
		 * /auth/login:
		 *   post:
		 *     summary: Login a user
		 *     tags: [Auth]
		 *     requestBody:
		 *       required: true
		 *       content:
		 *         application/json:
		 *           schema:
		 *             type: object
		 *             required: [email, password]
		 *             properties:
		 *               email:
		 *                 type: string
		 *               password:
		 *                 type: string
		 *     responses:
		 *       200:
		 *         description: User logged in successfully
		 *       400:
		 *         description: Invalid credentials
		 *         content:
		 *           application/json:
		 *             schema:
		 *               type: object
		 *               properties:
		 *                 data:
		 *                   type: "null"
		 *                 message:
		 *                   type: string
		 *                 statusCode:
		 *                   type: integer
		 *                 timestamp:
		 *                   type: string
		 *                 path:
		 *                   type: string
		 */
		router.post('/login', controller.loginUser);

		/**
		 * @swagger
		 * /auth/register:
		 *   post:
		 *     summary: Register a new user
		 *     tags: [Auth]
		 *     requestBody:
		 *       required: true
		 *       content:
		 *         application/json:
		 *           schema:
		 *             type: object
		 *             required: [firstName, lastName, email, password]
		 *             properties:
		 *               firstName:
		 *                 type: string
		 *               lastName:
		 *                 type: string
		 *               email:
		 *                 type: string
		 *               password:
		 *                 type: string
		 *     responses:
		 *       201:
		 *         description: User registered successfully
		 *       400:
		 *         description: User already exists
		 *         content:
		 *           application/json:
		 *             schema:
		 *               type: object
		 *               properties:
		 *                 data:
		 *                   type: "null"
		 *                 message:
		 *                   type: string
		 *                 statusCode:
		 *                   type: integer
		 *                 timestamp:
		 *                   type: string
		 *                 path:
		 *                   type: string
		 */
		router.post('/register', controller.registerUser);

		/**
		 * @swagger
		 * /auth/logout:
		 *   post:
		 *     summary: Logout the current user
		 *     tags: [Auth]
		 *     security:
		 *       - bearerAuth: []
		 *     responses:
		 *       200:
		 *         description: User logged out successfully
		 *       500:
		 *         description: Internal server error while logging out
		 *         content:
		 *           application/json:
		 *             schema:
		 *               type: object
		 *               properties:
		 *                 message:
		 *                   type: string
		 *                 statusCode:
		 *                   type: integer
		 *                 timestamp:
		 *                   type: string
		 *                 path:
		 *                   type: string
		 */
		router.post(
			'/logout',
			AuthMiddleware.validateJWT,
			controller.logoutUser,
		);
		return router;
	}
}
