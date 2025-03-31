import {UpdateOfferDto} from '../../dto/offer/update-offer.dto';
import {Offer} from '../../types/types';

export const adaptEditOfferToServer =
  (offer: Offer): UpdateOfferDto => ({
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
