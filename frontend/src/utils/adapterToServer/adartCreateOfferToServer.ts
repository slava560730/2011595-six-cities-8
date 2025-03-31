import {CreateOfferDto} from '../../dto/offer/create-offer.dto';
import {NewOffer} from '../../types/types';

export const adaptCreateOfferToServer =
  (offer: NewOffer): CreateOfferDto => ({
    title: offer.title,
    description: offer.description,
    city: offer.city.name,
    previewImage: offer.previewImage,
    images: offer.images,
    isPremium: offer.isPremium,
    type: offer.type,
    roomsCount: offer.bedrooms,
    maxAdults: offer.maxAdults,
    price: offer.price,
    goods: offer.goods,
    location: offer.city.location,
  });
