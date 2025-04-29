import { Router } from 'express';
import { AuthRoutes } from '@presentation/auth/routes';
import { WalletRoutes } from '@presentation/wallet/routes';

export class AppRoutes {
	static get routes(): Router {
		const router = Router();
		router.use('/api/auth', AuthRoutes.routes);
		router.use('/api/wallet', WalletRoutes.routes);
		return router;
	}
}
