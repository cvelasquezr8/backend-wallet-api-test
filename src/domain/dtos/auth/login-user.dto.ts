import { Validators } from '@config/index';

export class LoginUserDto {
	constructor(public email: string, public password: string) {}

	static create(object: { [key: string]: any }): [string?, LoginUserDto?] {
		const { email, password } = object;
		if (!email) return ['Email is required'];
		if (!password) return ['Password is required'];
		if (!Validators.email.test(email)) return ['Email is invalid'];
		return [undefined, new LoginUserDto(email, password)];
	}
}
