import {Expose, Type} from 'class-transformer';

import {UserRdo} from '../../user/rdo/user.rdo.js';
import {City, Goods, Location, OfferType} from '../../../types/index.js';

export class FullOfferRdo {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public description!: string;

  @Expose({ name: 'createdAt' })
  public postDate!: string;

  @Expose()
  public city!: City;

  @Expose()
  public previewImage!: string;

  @Expose()
  public images!: string[];

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public type!: OfferType;

  @Expose()
  public roomsCount!: number;

  @Expose()
  public maxAdults!: number;

  @Expose()
  public price!: number;

  @Expose()
  public goods!: Goods[];

  @Expose()
  @Type(() => UserRdo)
  public user!: UserRdo;

  @Expose()
  public reviewsCount!: number;

  @Expose()
  public location!: Location;
}
