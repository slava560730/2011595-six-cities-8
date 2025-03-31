import {CityName, Location, Type} from '../../types/types';

export class UpdateOfferDto {
  public title?: string;

  public description?: string;

  public city?: CityName;

  public previewImage?: string;

  public images?: string[];

  public isPremium?: boolean;

  public type?: Type;

  public roomsCount?: number;

  public maxAdults?: number;

  public price?: number;

  public goods?: string[];

  public location?: Location;
}
