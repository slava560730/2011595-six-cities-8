import {defaultClasses, modelOptions, prop, Ref} from '@typegoose/typegoose';
import {City, Goods, Location, OfferType} from '../../types/index.js';
import {UserEntity} from './user.entity.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'offers', timestamps: true,
  }
}) // eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({trim: true, required: true})
  public title!: string;

  @prop({trim: true, required: true})
  public description!: string;

  @prop()
  public postDate!: Date;

  @prop({required: true})
  public previewImage!: string;

  @prop({type: () => [String], required: true})
  public images!: string[];

  @prop({required: true})
  public isPremium!: boolean;

  @prop()
  public isFavorite!: boolean;

  @prop({required: true})
  public rating!: number;

  @prop({required: true})
  public roomsCount!: number;

  @prop({required: true})
  public maxAdults!: number;

  @prop({required: true})
  public price!: number;

  @prop({type: () => String, enum: City, required: true})
  public city!: City;

  @prop({type: () => [String], enum: () => Goods, required: true})
  public goods!: Goods[];

  @prop({
    type: () => String, enum: OfferType, required: true
  })
  public type!: OfferType;

  @prop({
    ref: () => UserEntity,
    required: true
  })
  public userId!: Ref<UserEntity>;

  @prop({default: 0})
  public reviewsCount!: number;

  @prop({required: true})
  public location!: Location;
}

