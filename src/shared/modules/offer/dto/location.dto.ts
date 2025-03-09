import {IsLatitude, IsLongitude} from 'class-validator';

export class LocationDto {
  @IsLatitude()
  public latitude!: number;

  @IsLongitude()
  public longitude!: number;
}
