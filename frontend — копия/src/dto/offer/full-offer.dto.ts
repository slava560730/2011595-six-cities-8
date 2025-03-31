import {Goods} from '../../../../src/shared/types';
import {UserDTO} from '../user/user.dto';
import {CityName, Location, Type} from '../../types/types';

export class FullOfferDto {
  public id!: string;

  public title!: string;

  public description!: string;

  public postDate!: string;

  public city!: CityName;

  public previewImage!: string;

  public images!: string[];

  public isPremium!: boolean;

  public isFavorite!: boolean;

  public rating!: number;

  public type!: Type;

  public roomsCount!: number;

  public maxAdults!: number;

  public price!: number;

  public goods!: Goods[];

  public user!: UserDTO;

  public reviewsCount!: number;

  public location!: Location;
}
