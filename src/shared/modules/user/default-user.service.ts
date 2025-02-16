import {DocumentType, types} from '@typegoose/typegoose';
import {inject, injectable} from 'inversify';

import {UserService} from './user-service.interface.js';
import {CreateUserDto} from './dto/create-user.dto.js';
import {Component} from '../../types/index.js';
import {Logger} from '../../libs/logger/index.js';
import {UpdateUserDto} from './dto/update-user.dto.js';
import {DEFAULT_AVATAR_FILE_NAME} from './user.constant.js';
import {Types} from 'mongoose';
import {OfferService} from '../offer/index.js';
import {OfferEntity, UserEntity} from '../entities/index.js';

@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>,
    @inject(Component.OfferService) private readonly offerService: OfferService
  ) {
  }

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity({...dto, avatarPath: DEFAULT_AVATAR_FILE_NAME}, dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email});
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }

  public async updateById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null> {
    return this.userModel
      .findByIdAndUpdate(userId, dto, {new: true})
      .exec();
  }

  public async findById(userId: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findById(userId);
  }

  public async findFavoritesForUser(userId: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerService.findFavoritesByUserId(userId);
  }

  public async addFavorite(userId: string, offerId: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findByIdAndUpdate(userId, { $addToSet: { favorites: new Types.ObjectId(offerId) } }, { new: true }).exec();
  }

  public async deleteFavorite(userId: string, offerId: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findByIdAndUpdate(userId, { $pull: { favorites: new Types.ObjectId(offerId) } }, { new: true }).exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return this.userModel.exists({_id: documentId}).then((r) => !!r);
  }
}
