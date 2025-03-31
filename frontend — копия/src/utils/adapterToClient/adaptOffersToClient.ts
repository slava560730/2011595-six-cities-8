import {FullOfferDto} from '../../dto/offer/full-offer.dto';
import {Offer} from '../../types/types';
import {adaptUserToClient} from './adaptUserToClient';

export const adaptOffersToClient =
  (offers: FullOfferDto[]): Offer[] => offers.map((offer) => ({
    id: offer?.id,
    price: offer.price,
    rating: offer?.rating,
    title: offer.title,
    isPremium: offer?.isPremium,
    isFavorite: offer?.isFavorite,
    city: {
      name: offer.city,
      location: offer.location,
    },
    location: offer.location,
    previewImage: offer.previewImage,
    type: offer.type,
    bedrooms: offer.roomsCount,
    description: offer.description,
    goods: offer.goods,
    host: adaptUserToClient(offer?.user),
    images: offer?.images,
    maxAdults: offer.maxAdults
  }));

export const adaptOfferToClient =
  (offer: FullOfferDto): Offer => ({
    id: offer?.id,
    price: offer.price,
    rating: offer?.rating,
    title: offer.title,
    isPremium: offer?.isPremium,
    isFavorite: offer?.isFavorite,
    city: {
      name: offer.city,
      location: offer.location,
    },
    location: offer.location,
    previewImage: offer.previewImage,
    type: offer.type,
    bedrooms: offer.roomsCount,
    description: offer.description,
    goods: offer.goods,
    host: adaptUserToClient(offer?.user),
    images: offer?.images,
    maxAdults: offer.maxAdults
  });

