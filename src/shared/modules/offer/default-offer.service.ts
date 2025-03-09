import {inject, injectable} from 'inversify';
import {DocumentType, types} from '@typegoose/typegoose';

import {OfferService} from './offer-service.interface.js';
import {City, Component} from '../../types/index.js';
import {Logger} from '../../libs/logger/index.js';
import {CreateOfferDto} from './dto/create-offer.dto.js';
import {UpdateOfferDto} from './dto/update-offer.dto.js';
import {SortType} from '../../types/sort-type.enum.js';
import {authorAggregation, commentAggregation, favoriteAggregation} from './offer.aggregation.js';
import {CommentService} from '../comment/index.js';
import {Types} from 'mongoose';
import {DEFAULT_OFFER_COUNT, MAX_PREMIUM_OFFER_COUNT} from './offer.constant.js';
import {OfferEntity} from '../entities/index.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(@inject(Component.Logger) private readonly logger: Logger,
              @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
              @inject(Component.CommentService) private readonly commentService: CommentService,
  ) {
  }

  //Получение списка предложений по аренде.
  public async find(userId: string, limit?: number,): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .aggregate([
        ...authorAggregation,
        ...favoriteAggregation(userId),
        {$limit: limit ?? DEFAULT_OFFER_COUNT},
        {$sort: {reviewsCount: SortType.DESC}} //Сортировка по количеству комментариев.
      ]).exec();
  }

  //Создание нового предложения.
  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create({...dto, rating: 0});
    this.logger.info(`New offer created: ${dto.title}`);

    return result.populate('userId');
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    const result = await this.offerModel
      .findByIdAndUpdate(offerId, dto, {new: true});

    return result!.populate('userId');
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    await this.commentService.deleteByOfferId(offerId);

    return this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  public async findBySimpleId(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return await this.offerModel.findById(offerId).populate('userId').exec();
  }

  public async findById(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null> {
    const data = await this.offerModel.aggregate([
      {$match: {'_id': new Types.ObjectId(offerId)}},
      ...commentAggregation,
      ...authorAggregation,
      ...favoriteAggregation(userId, offerId),
    ])
      .exec();

    if (!data[0]) {
      return null;
    }

    return data[0];
  }

  //Проверка существования предложения.
  public async exists(documentId: string): Promise<boolean> {
    return this.offerModel.exists({_id: documentId}).then((r) => !!r);
  }

  //Увеличивает количество комментариев для предложения.
  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {
        '$inc': {
          reviewsCount: 1,
        }
      }).exec();
  }

  //Получение списка премиальных предложений для города.
  public async findByPremium(city: City, userId: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.aggregate([
      {
        $match: {
          city,
          isPremium: true,
        }
      },
      ...commentAggregation,
      ...favoriteAggregation(userId),
      {$sort: {createdAt: SortType.DESC}},
      {$limit: MAX_PREMIUM_OFFER_COUNT},
    ]);
  }

  //Получения списка предложений, добавленных в избранное.
  public async findFavoritesByUserId(userId: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .aggregate([
        ...authorAggregation,
        ...favoriteAggregation(userId),
        { $match: { isFavorite: true }}
      ])
      .exec();
  }


}
