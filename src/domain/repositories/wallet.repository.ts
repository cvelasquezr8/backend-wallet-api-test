import { WalletEntity } from '@domain/entities/wallet.entity';
import { CreateWalletDto } from '@domain/dtos/wallet/create-wallet.dto';
import { UpdateWalletDto } from '@domain/dtos/wallet/update-wallet.dto';

export abstract class WalletRepository {
  abstract create(userId: string, dto: CreateWalletDto): Promise<WalletEntity>;
  abstract findAllByUser(userId: string): Promise<WalletEntity[]>;
  abstract findById(id: string, userId: string): Promise<WalletEntity | null>;
  abstract update(id: string, userId: string, dto: UpdateWalletDto): Promise<WalletEntity | null>;
  abstract delete(id: string, userId: string): Promise<boolean>;
}