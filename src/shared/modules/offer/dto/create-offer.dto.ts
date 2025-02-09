import {City, Goods, Location, OfferType} from '../../../types/index.js';

export class CreateOfferDto {
  public title: string;
  public description: string;
  public postDate: Date;
  public previewImage: string;
  public images: string[];
  public isPremium: boolean;
  public isFavorite: boolean;
  public rating: number;
  public bedrooms: number;
  public maxAdults: number;
  public price: number;
  public city: City;
  public goods: Goods[];
  public type: OfferType;
  public user: string;
  public comments: string[];
  public reviewsCount: number;
  public location: Location;
}
