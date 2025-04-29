import { CustomError, UserEntity } from '@domain/index';

export class UserMapper {
	static userEntityFromObject(object: { [key: string]: any }) {
		const { id, email, firstName, lastName, password } = object;
		if (!id) throw CustomError.badRequest('User ID is required');
		if (!email) throw CustomError.badRequest('Email is required');
		if (!firstName) throw CustomError.badRequest('First name is required');
		if (!lastName) throw CustomError.badRequest('Last name is required');
		if (!password) throw CustomError.badRequest('Password is required');
		return new UserEntity(id, email, firstName, lastName, password);
	}
}
