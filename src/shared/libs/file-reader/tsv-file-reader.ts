import {FileReader} from './file-reader.interface.js';
import {City, Goods, Location, Offer, OfferType, User} from '../../types/index.js';
import {TypeUser} from '../../types/user.type.js';
import EventEmitter from 'node:events';
import {createReadStream} from 'node:fs';


export class TSVFileReader extends EventEmitter implements FileReader {
  private CHUNK_SIZE = 16384; // 16KB

  constructor(
    private readonly filename: string
  ) {
    super();
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
      images: this.parseImages(images),
      isPremium: isPremium === 'true',
      isFavorite: isFavorite === 'true',
      rating: Number.parseInt(rating, 10),
      type: type as OfferType,
      bedrooms: Number.parseInt(bedrooms, 10),
      maxAdults: Number.parseInt(maxAdults, 10),
      price: Number.parseInt(price, 10),
      goods: this.parseGoods(goods),
      user: this.parseUser(firstname, email, avatarPath, password, typeUser as TypeUser),
      reviewsCount: Number.parseInt(reviewsCount, 10),
      location: this.parseLocation(location)
    };
  }

  private parseGoods(goodsString: string): Goods[] {
    return goodsString.split(';').map((name) => name as Goods);
  }

  private parseLocation(locationString: string): Location {
    const [latitude, longitude] = locationString.split(';').map((name) => name);
    return {latitude: Number.parseFloat(latitude), longitude: Number.parseFloat(longitude)};
  }

  private parseImages(imagesString: string): string[] {
    return imagesString.split(';').map((name) => name);
  }

  private parseUser(firstname: string, email: string, avatarPath: string, password: string, type: TypeUser): User {
    return {firstname, email, avatarPath, password, type};
  }

  public async read(): Promise<void> {
    const readStream = createReadStream(this.filename, {
      highWaterMark: this.CHUNK_SIZE,
      encoding: 'utf-8',
    });

    let remainingData = '';
    let nextLinePosition = -1;
    let importedRowCount = 0;

    for await (const chunk of readStream) {
      remainingData += chunk.toString();

      while ((nextLinePosition = remainingData.indexOf('\n')) >= 0) {
        const completeRow = remainingData.slice(0, nextLinePosition + 1);
        remainingData = remainingData.slice(++nextLinePosition);
        importedRowCount++;

        const parsedOffer = this.parseLineToOffer(completeRow);
        this.emit('line', parsedOffer);
      }
    }

    this.emit('end', importedRowCount);
  }
}
