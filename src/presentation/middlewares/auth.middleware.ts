import { JwtAdapter } from '@config/index';
import { prisma } from '@data/postgres';
import { NextFunction, Request, Response } from 'express';

export class AuthMiddleware {
	static validateJWT = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const authorization = req.header('Authorization');
		if (!authorization) {
			res.status(401).json({
				message: 'Authorization header is missing',
			});
			return;
		}

		if (!authorization.startsWith('Bearer ')) {
			res.status(401).json({ message: 'Invalid token' });
			return;
		}

		const token = authorization.split(' ').at(1) || '';

		try {
			const isRevoked = await prisma.revokedToken.findUnique({
				where: { token },
			});

			if (isRevoked) {
				res.status(401).json({ message: 'Token has been revoked' });
				return;
			}

			const payload = await JwtAdapter.validateToken<{ id: string }>(
				token,
			);

			if (!payload) {
				res.status(401).json({ message: 'Invalid token' });
				return;
			}

			req.user = { id: payload.id };

			next();
		} catch (error) {
			res.status(500).json({ error: 'Internal server error' });
		}
	};
}
