import {
	AuthDatasource,
	RegisterUserDto,
	UserEntity,
	AuthRepository,
	LoginUserDto,
} from '@domain/index';

export class AuthRepositoryImpl implements AuthRepository {
	constructor(private readonly authDatasource: AuthDatasource) {}
	logout(token: string): Promise<void> {
		return this.authDatasource.logout(token);
	}

	login(loginUserDto: LoginUserDto): Promise<UserEntity> {
		return this.authDatasource.login(loginUserDto);
	}

	register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
		return this.authDatasource.register(registerUserDto);
	}
}
