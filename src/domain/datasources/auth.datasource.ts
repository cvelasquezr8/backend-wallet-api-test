import { LoginUserDto } from '@domain/dtos/auth/login-user.dto';
import { RegisterUserDto } from '@domain/dtos/auth/register-user.dto';
import { UserEntity } from '@domain/entities/user.entity';
export abstract class AuthDatasource {
	abstract login(loginUserDto: LoginUserDto): Promise<UserEntity>;
	abstract register(registerUserDto: RegisterUserDto): Promise<UserEntity>;
	abstract logout(token: string): Promise<void>;
}
