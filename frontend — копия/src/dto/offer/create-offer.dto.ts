import {CityName, Location, Type} from '../../types/types.js';

export class CreateOfferDto {
  public title!: string;

  public description!: string;

  public previewImage!: string;

  public images!: string[];

  public isPremium!: boolean;

  public roomsCount!: number;

  public maxAdults!: number;

  public price!: number;

  public city!: CityName;

  public goods!: string[];

  public type!: Type;

  public location!: Location;
}
