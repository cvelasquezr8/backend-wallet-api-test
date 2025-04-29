import { UserEntity } from '@domain/entities/user.entity';
import { RegisterUserDto } from '@domain/dtos/auth/register-user.dto';
import { LoginUserDto } from '@domain/dtos/auth/login-user.dto';
export abstract class AuthRepository {
	abstract login(loginUserDto: LoginUserDto): Promise<UserEntity>;
	abstract register(registerUserDto: RegisterUserDto): Promise<UserEntity>;
	abstract logout(token: string): Promise<void>;
}
