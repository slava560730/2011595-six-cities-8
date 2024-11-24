import { readFileSync } from 'node:fs';

import { FileReader } from './file-reader.interface.js';
import { Offer, City, OfferType, Goods, User, Location } from '../../types/index.js';
import { TypeUser } from '../../types/user.type.js';


export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {}

  private validateRawData(): void {
    if (!this.rawData) {
      throw new Error('File was not read');
    }
  }

  private parseRawDataToOffers(): Offer[] {
    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => this.parseLineToOffer(line));
  }

  private parseLineToOffer(line: string): Offer {
    const [
      title,
      description,
      postDate,
      city,
      previewImage,
      images,
      isPremium,
      isFavorite,
      rating,
      type,
      bedrooms,
      maxAdults,
      price,
      goods,
      firstname,
      email,
      avatarPath,
      password,
      typeUser,
      reviewsCount,
      location
    ] = line.split('\t');

    return {
      title,
      description,
      postDate: new Date(postDate),
      city: city as City,
      previewImage,
      images:this.parseImages(images),
      isPremium: isPremium === 'true',
      isFavorite: isFavorite === 'true',
      rating: Number.parseInt(rating, 10),
      type:type as OfferType,
      bedrooms:Number.parseInt(bedrooms,10),
      maxAdults:Number.parseInt(maxAdults,10),
      price: Number.parseInt(price, 10),
      goods: this.parseGoods(goods),
      user: this.parseUser(firstname, email, avatarPath, password, typeUser as TypeUser),
      reviewsCount:Number.parseInt(reviewsCount,10),
      location: this.parseLocation(location)
    };
  }

  private parseGoods(goodsString: string): Goods[] {
    return goodsString.split(';').map((name) => name as Goods);
  }

  private parseLocation(locationString: string): Location {
    const [latitude, longitude] = locationString.split(';').map((name) => name);
    return {latitude:Number.parseFloat(latitude),longitude:Number.parseFloat(longitude)} ;
  }

  private parseImages(imagesString: string): string[] {
    return imagesString.split(';').map((name) => name);
  }

  private parseUser(firstname: string, email: string, avatarPath: string, password: string,type: TypeUser): User {
    return { firstname, email, avatarPath, password, type };
  }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    this.validateRawData();
    return this.parseRawDataToOffers();
  }
}
