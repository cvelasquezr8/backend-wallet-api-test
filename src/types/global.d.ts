import 'express';

declare global {
	namespace Express {
		interface Request {
			user?: {
				id: string;
			};
		}
	}
}

export {};

// This file is used to extend the Express Request interface to include a user property.
