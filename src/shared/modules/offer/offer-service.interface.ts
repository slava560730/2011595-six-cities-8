import {DocumentType} from '@typegoose/typegoose';

import {CreateOfferDto} from './dto/create-offer.dto.js';
import {UpdateOfferDto} from './dto/update-offer.dto.js';
import {City} from '../../types/index.js';
import {OfferEntity} from '../entities/index.js';

export interface OfferService {
  //Получение списка предложений по аренде.
  find(count:number, userId?: string): Promise<DocumentType<OfferEntity>[]>;

  //Создание нового предложения.
  create(dto: CreateOfferDto & { userId: string }): Promise<DocumentType<OfferEntity>>;

  //Получение детальной информации о предложении,
  findById(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null>;

  findBySimpleId(offerId: string): Promise<DocumentType<OfferEntity> | null>;

  //Удаление предложения.
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;

  //Редактирование предложения.
  updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;

  //Увеличение количества комментариев для предложения.
  incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;

  //Получение списка премиальных предложений для города.
  findByPremium(city: City, userId?: string): Promise<DocumentType<OfferEntity>[]>;

  //Получения списка предложений, добавленных в избранное.
  findFavoritesByUserId(userId: string): Promise<DocumentType<OfferEntity>[]>;

  exists(documentId: string): Promise<boolean>;
}
