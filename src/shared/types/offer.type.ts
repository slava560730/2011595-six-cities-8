import { City } from './city.type.js';
import { Goods } from './goods.type.js';
import { Location } from './location.type.js';
import { OfferType } from './offer-type.type.js';
import { User } from './user.type.js';

export type OfferPreview = {
  title: string;//наименование
  type: OfferType;//тип жилья
  price: number;//стоимость аренды
  city: City;//город
  location: Location;//координаты предложения
  isFavorite: boolean;//флаг избранное
  isPremium: boolean;//флаг премиум
  rating: number;//рейтинг
  previewImage: string;//превью изображения
};
export type Offer = OfferPreview & {
  description: string;//описание
  postDate:Date;//дата публикации
  bedrooms: number;//количество комнат
  goods: Goods[];//удобства
  user: User;//пользователь
  images: string[];//фотографии жилья
  maxAdults: number;//Количество гостей
  reviewsCount :number;//количество отзывов
};
