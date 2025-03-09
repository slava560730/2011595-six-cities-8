import {City, Goods, Location, OfferType} from '../../../types/index.js';
import {OFFER_DTO_CONSTRAINTS} from '../offer.constant.js';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested
} from 'class-validator';
import {Type} from 'class-transformer';
import {LocationDto} from './location.dto.js';

export class UpdateOfferDto {
  @IsOptional()
  @MinLength(OFFER_DTO_CONSTRAINTS.TITLE.MIN_LENGTH)
  @MaxLength(OFFER_DTO_CONSTRAINTS.TITLE.MAX_LENGTH)
  public title?: string;

  @IsOptional()
  @MinLength(OFFER_DTO_CONSTRAINTS.DESCRIPTION.MIN_LENGTH)
  @MaxLength(OFFER_DTO_CONSTRAINTS.DESCRIPTION.MAX_LENGTH)
  public description?: string;

  @IsOptional()
  @IsEnum(City)
  public city?: City;

  @IsOptional()
  @IsString()
  public previewImage?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(OFFER_DTO_CONSTRAINTS.IMAGE.MIN_LENGTH)
  @ArrayMaxSize(OFFER_DTO_CONSTRAINTS.IMAGE.MAX_LENGTH)
  public images?: string[];

  @IsOptional()
  @IsBoolean()
  public isPremium?: boolean;

  @IsOptional()
  @IsEnum(OfferType)
  public type?: OfferType;

  @IsOptional()
  @IsInt()
  @Min(OFFER_DTO_CONSTRAINTS.FLAT_COUNT.MIN_VALUE)
  @Max(OFFER_DTO_CONSTRAINTS.FLAT_COUNT.MAX_VALUE)
  public roomsCount?: number;

  @IsOptional()
  @IsInt()
  @Min(OFFER_DTO_CONSTRAINTS.GUEST_COUNT.MIN_VALUE)
  @Max(OFFER_DTO_CONSTRAINTS.GUEST_COUNT.MAX_VALUE)
  public maxAdults?: number;

  @IsOptional()
  @IsInt()
  @Min(OFFER_DTO_CONSTRAINTS.COST.MIN_VALUE)
  @Max(OFFER_DTO_CONSTRAINTS.COST.MAX_VALUE)
  public price?: number;

  @IsOptional()
  @ArrayUnique<Goods>()
  public goods?: Goods[];

  @IsOptional()
  @ValidateNested()
  @IsObject()
  @Type(() => LocationDto)
  public location?: Location;
}
