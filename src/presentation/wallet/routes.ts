import { Router } from 'express';
import { WalletController } from './controller';
import {
	WalletDataSourceImpl,
	WalletRepositoryImpl,
} from '@infrastructure/index';
import { AuthMiddleware } from '@presentation/middlewares/auth.middleware';

export class WalletRoutes {
	static get routes(): Router {
		const router = Router();
		const datasource = new WalletDataSourceImpl();
		const walletRepository = new WalletRepositoryImpl(datasource);
		const controller = new WalletController(walletRepository);

		/**
		 * @swagger
		 * /wallet:
		 *   post:
		 *     summary: Create a new wallet
		 *     tags: [Wallet]
		 *     security:
		 *       - bearerAuth: []
		 *     requestBody:
		 *       required: true
		 *       content:
		 *         application/json:
		 *           schema:
		 *             type: object
		 *             required: [chain, address]
		 *             properties:
		 *               tag:
		 *                 type: string
		 *                 example: Main wallet
		 *               chain:
		 *                 type: string
		 *                 example: Ethereum
		 *               address:
		 *                 type: string
		 *                 example: 0x1234567890abcdef1234567890abcdef12345678
		 *     responses:
		 *       201:
		 *         description: Wallet created successfully
		 *         content:
		 *           application/json:
		 *             schema:
		 *               type: object
		 *               properties:
		 *                 data:
		 *                   type: object
		 *                   properties:
		 *                     id:
		 *                       type: string
		 *                     userId:
		 *                       type: string
		 *                     chain:
		 *                       type: string
		 *                     address:
		 *                       type: string
		 *                     tag:
		 *                       type: string
		 *                     createdAt:
		 *                       type: string
		 *                     updatedAt:
		 *                       type: string
		 *                 message:
		 *                   type: string
		 *                 statusCode:
		 *                   type: integer
		 *                 timestamp:
		 *                   type: string
		 *                 path:
		 *                   type: string
		 *       400:
		 *         description: Wallet already exists
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
		 *       401:
		 *         description: Invalid token
		 *         content:
		 *           application/json:
		 *             schema:
		 *               type: object
		 *               properties:
		 *                 message:
		 *                   type: string
		 */
		router.post('/', AuthMiddleware.validateJWT, controller.createWallet);

		/**
		 * @swagger
		 * /wallet:
		 *   get:
		 *     summary: Get all wallets for the authenticated user
		 *     tags: [Wallet]
		 *     security:
		 *       - bearerAuth: []
		 *     responses:
		 *       200:
		 *         description: Wallets fetched successfully
		 *         content:
		 *           application/json:
		 *             schema:
		 *               type: object
		 *               properties:
		 *                 data:
		 *                   type: array
		 *                   items:
		 *                     type: object
		 *                     properties:
		 *                       id:
		 *                         type: string
		 *                       userId:
		 *                         type: string
		 *                       chain:
		 *                         type: string
		 *                       address:
		 *                         type: string
		 *                       tag:
		 *                         type: string
		 *                       createdAt:
		 *                         type: string
		 *                       updatedAt:
		 *                         type: string
		 *                 message:
		 *                   type: string
		 *                 statusCode:
		 *                   type: integer
		 *                 timestamp:
		 *                   type: string
		 *                 path:
		 *                   type: string
		 *       401:
		 *         description: Invalid or missing token
		 *         content:
		 *           application/json:
		 *             schema:
		 *               type: object
		 *               properties:
		 *                 message:
		 *                   type: string
		 *                   example: Invalid token
		 */
		router.get('/', [AuthMiddleware.validateJWT], controller.getWallets);

		/**
		 * @swagger
		 * /wallet/{id}:
		 *   get:
		 *     summary: Get wallet by ID
		 *     tags: [Wallet]
		 *     security:
		 *       - bearerAuth: []
		 *     parameters:
		 *       - in: path
		 *         name: id
		 *         required: true
		 *         schema:
		 *           type: string
		 *         description: Wallet ID
		 *     responses:
		 *       200:
		 *         description: Wallet fetched successfully
		 *         content:
		 *           application/json:
		 *             schema:
		 *               type: object
		 *               properties:
		 *                 data:
		 *                   type: object
		 *                   properties:
		 *                     id:
		 *                       type: string
		 *                     userId:
		 *                       type: string
		 *                     chain:
		 *                       type: string
		 *                     address:
		 *                       type: string
		 *                     tag:
		 *                       type: string
		 *                     createdAt:
		 *                       type: string
		 *                     updatedAt:
		 *                       type: string
		 *                 message:
		 *                   type: string
		 *                 statusCode:
		 *                   type: integer
		 *                 timestamp:
		 *                   type: string
		 *                 path:
		 *                   type: string
		 *       404:
		 *         description: Wallet not found
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
		 *       401:
		 *         description: Invalid or missing token
		 *         content:
		 *           application/json:
		 *             schema:
		 *               type: object
		 *               properties:
		 *                 message:
		 *                   type: string
		 *                   example: Invalid token
		 */
		router.get(
			'/:id',
			[AuthMiddleware.validateJWT],
			controller.getWalletById,
		);

		/**
		 * @swagger
		 * /wallet/{id}:
		 *   put:
		 *     summary: Update a wallet
		 *     tags: [Wallet]
		 *     security:
		 *       - bearerAuth: []
		 *     parameters:
		 *       - in: path
		 *         name: id
		 *         required: true
		 *         schema:
		 *           type: string
		 *         description: Wallet ID to update
		 *     requestBody:
		 *       required: true
		 *       content:
		 *         application/json:
		 *           schema:
		 *             type: object
		 *             properties:
		 *               tag:
		 *                 type: string
		 *                 example: Main wallet
		 *               chain:
		 *                 type: string
		 *                 example: Ethereum 2.0
		 *               address:
		 *                 type: string
		 *                 example: 0x1234567890abcdef1234567890abcdef12345678
		 *     responses:
		 *       200:
		 *         description: Wallet updated successfully
		 *         content:
		 *           application/json:
		 *             schema:
		 *               type: object
		 *               properties:
		 *                 data:
		 *                   type: object
		 *                   properties:
		 *                     id:
		 *                       type: string
		 *                     userId:
		 *                       type: string
		 *                     chain:
		 *                       type: string
		 *                     address:
		 *                       type: string
		 *                     tag:
		 *                       type: string
		 *                     createdAt:
		 *                       type: string
		 *                     updatedAt:
		 *                       type: string
		 *                 message:
		 *                   type: string
		 *                 statusCode:
		 *                   type: integer
		 *                 timestamp:
		 *                   type: string
		 *                 path:
		 *                   type: string
		 *       404:
		 *         description: Wallet not found
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
		 *       401:
		 *         description: Invalid or missing token
		 *         content:
		 *           application/json:
		 *             schema:
		 *               type: object
		 *               properties:
		 *                 message:
		 *                   type: string
		 *                   example: Invalid token
		 */
		router.put(
			'/:id',
			[AuthMiddleware.validateJWT],
			controller.updateWallet,
		);

		/**
		 * @swagger
		 * /wallet/{id}:
		 *   delete:
		 *     summary: Delete a wallet by ID
		 *     tags: [Wallet]
		 *     security:
		 *       - bearerAuth: []
		 *     parameters:
		 *       - in: path
		 *         name: id
		 *         required: true
		 *         schema:
		 *           type: string
		 *         description: Wallet ID to delete
		 *     responses:
		 *       200:
		 *         description: Wallet deleted successfully
		 *         content:
		 *           application/json:
		 *             schema:
		 *               type: object
		 *               properties:
		 *                 data:
		 *                   type: boolean
		 *                   example: true
		 *                 message:
		 *                   type: string
		 *                   example: Wallet deleted successfully
		 *                 statusCode:
		 *                   type: integer
		 *                   example: 200
		 *                 timestamp:
		 *                   type: string
		 *                 path:
		 *                   type: string
		 *       404:
		 *         description: Wallet not found
		 *         content:
		 *           application/json:
		 *             schema:
		 *               type: object
		 *               properties:
		 *                 data:
		 *                   type: "null"
		 *                 message:
		 *                   type: string
		 *                   example: Wallet not found
		 *                 statusCode:
		 *                   type: integer
		 *                   example: 404
		 *                 timestamp:
		 *                   type: string
		 *                 path:
		 *                   type: string
		 *       401:
		 *         description: Invalid or missing token
		 *         content:
		 *           application/json:
		 *             schema:
		 *               type: object
		 *               properties:
		 *                 message:
		 *                   type: string
		 *                   example: Invalid token
		 */
		router.delete(
			'/:id',
			[AuthMiddleware.validateJWT],
			controller.deleteWallet,
		);
		return router;
	}
}
