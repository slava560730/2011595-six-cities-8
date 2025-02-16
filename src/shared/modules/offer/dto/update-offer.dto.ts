import {City, Goods, Location, OfferType} from '../../../types/index.js';

export class UpdateOfferDto {
  public title?: string;
  public description?: string;
  public city?: City;
  public previewImage?: string;
  public images?: string[];
  public isPremium?: boolean;
  public rating?: number;
  public type?: OfferType;
  public roomsCount?: number;
  public maxAdults?: number;
  public price?: number;
  public goods?: Goods[];
  public location?: Location;
  public isFavorite?: boolean;
}
