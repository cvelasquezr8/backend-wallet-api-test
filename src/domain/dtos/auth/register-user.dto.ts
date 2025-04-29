import { Validators } from '@config/index';

export class RegisterUserDto {
	private constructor(
		public firstName: string,
		public lastName: string,
		public email: string,
		public password: string,
	) {}

	static create(object: { [key: string]: any }): [string?, RegisterUserDto?] {
		const { firstName, lastName, email, password } = object;
		if (!email) return ['Email is required'];
		if (!password) return ['Password is required'];
		if (!lastName) return ['Last name is required'];
		if (!firstName) return ['First name is required'];
		if (!Validators.email.test(email)) return ['Email is invalid'];
		return [
			undefined,
			new RegisterUserDto(firstName, lastName, email, password),
		];
	}
}
