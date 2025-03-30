import {City, Goods, Location, OfferType} from '../../../types/index.js';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsObject,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested
} from 'class-validator';
import {OFFER_DTO_CONSTRAINTS} from '../offer.constant.js';
import {LocationDto} from './location.dto.js';
import {Type} from 'class-transformer';

export class CreateOfferDto {
  @IsString()
  @MinLength(OFFER_DTO_CONSTRAINTS.TITLE.MIN_LENGTH)
  @MaxLength(OFFER_DTO_CONSTRAINTS.TITLE.MAX_LENGTH)
  public title: string;

  @IsString()
  @MinLength(OFFER_DTO_CONSTRAINTS.DESCRIPTION.MIN_LENGTH)
  @MaxLength(OFFER_DTO_CONSTRAINTS.DESCRIPTION.MAX_LENGTH)
  public description: string;

  public postDate: Date;

  @IsString()
  public previewImage: string;

  @IsArray()
  @ArrayMinSize(OFFER_DTO_CONSTRAINTS.IMAGE.MIN_LENGTH)
  @ArrayMaxSize(OFFER_DTO_CONSTRAINTS.IMAGE.MAX_LENGTH)
  public images: string[];

  @IsBoolean()
  public isPremium: boolean;

  @IsInt()
  @Min(OFFER_DTO_CONSTRAINTS.FLAT_COUNT.MIN_VALUE)
  @Max(OFFER_DTO_CONSTRAINTS.FLAT_COUNT.MAX_VALUE)
  public roomsCount: number;

  @IsInt()
  @Min(OFFER_DTO_CONSTRAINTS.GUEST_COUNT.MIN_VALUE)
  @Max(OFFER_DTO_CONSTRAINTS.GUEST_COUNT.MAX_VALUE)
  public maxAdults: number;


  @IsInt()
  @Min(OFFER_DTO_CONSTRAINTS.COST.MIN_VALUE)
  @Max(OFFER_DTO_CONSTRAINTS.COST.MAX_VALUE)
  public price: number;

  @IsEnum(City)
  public city: City;

  @IsArray()
  @ArrayUnique<Goods>()
  public goods: Goods[];

  @IsEnum(OfferType)
  public type: OfferType;

  @ValidateNested()
  @IsObject()
  @Type(() => LocationDto)
  public location: Location;
}
