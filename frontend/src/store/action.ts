import type {History} from 'history';
import type {AxiosError, AxiosInstance} from 'axios';
import {createAsyncThunk} from '@reduxjs/toolkit';
import type {
  Comment,
  CommentAuth,
  FavoriteAuth,
  NewOffer,
  Offer,
  User,
  UserAuth,
  UserRegister
} from '../types/types';
import {ApiRoute, AppRoute, HttpCode} from '../const';
import {Token} from '../utils';
import {errorHandle} from '../utils/errorHandle';
import {CreateUserDTO} from '../dto/user/create-user.dto';
import {adaptSignUpToServer} from '../utils/adapterToServer/adaptSignUpToServer';
import {FullOfferDto} from '../dto/offer/full-offer.dto';
import {adaptCreateOfferToServer} from '../utils/adapterToServer/adartCreateOfferToServer';
import {
  adaptOffersToClient,
  adaptOfferToClient
} from '../utils/adapterToClient/adaptOffersToClient';
import {CommentDTO} from '../dto/comment/comment.dto';
import {
  adaptCommentsToClient,
  adaptCommentToClient
} from '../utils/adapterToClient/adaptCommentsToClient';
import {adaptCreateCommentToServer} from '../utils/adapterToServer/adaptCreateCommentToServer';
import {CreateCommentDTO} from '../dto/comment/create-comment.dto';

type Extra = {
  api: AxiosInstance;
  history: History;
};

export const Action = {
  FETCH_OFFERS: 'offers/fetch',
  FETCH_OFFER: 'offer/fetch',
  POST_OFFER: 'offer/post-offer',
  EDIT_OFFER: 'offer/edit-offer',
  DELETE_OFFER: 'offer/delete-offer',
  FETCH_FAVORITE_OFFERS: 'offers/fetch-favorite',
  FETCH_PREMIUM_OFFERS: 'offers/fetch-premium',
  FETCH_COMMENTS: 'offer/fetch-comments',
  POST_COMMENT: 'offer/post-comment',
  POST_FAVORITE: 'offer/post-favorite',
  DELETE_FAVORITE: 'offer/delete-favorite',
  LOGIN_USER: 'user/login',
  LOGOUT_USER: 'user/logout',
  FETCH_USER_STATUS: 'user/fetch-status',
  REGISTER_USER: 'user/register',
};

export const fetchOffers = createAsyncThunk<Offer[], undefined, { extra: Extra }>(
  Action.FETCH_OFFERS,
  async (_, { extra }) => {
    const { api } = extra;
    try {
      const { data } = await api.get<FullOfferDto[]>(ApiRoute.Offers);

      return adaptOffersToClient(data);
    } catch (err: unknown) {
      errorHandle(err);

      return Promise.reject(err);
    }
  });

export const fetchFavoriteOffers = createAsyncThunk<Offer[], undefined, { extra: Extra }>(
  Action.FETCH_FAVORITE_OFFERS,
  async (_, { extra }) => {
    const { api } = extra;
    const { data } = await api.get<Offer[]>(ApiRoute.Favorite);

    return data;
  });

export const fetchOffer = createAsyncThunk<Offer, Offer['id'], { extra: Extra }>(
  Action.FETCH_OFFER,
  async (id, { extra }) => {
    const { api, history } = extra;

    try {
      const { data } = await api.get<FullOfferDto>(`${ApiRoute.Offers}/${id}`);

      return adaptOfferToClient(data);
    } catch (err) {
      errorHandle(err);

      const axiosError = err as AxiosError;

      if (axiosError.response?.status === HttpCode.NotFound) {
        history.push(AppRoute.NotFound);
      }

      return Promise.reject(err);
    }
  });

export const postOffer = createAsyncThunk<Offer, NewOffer, { extra: Extra }>(
  Action.POST_OFFER,
  async (newOffer, { extra }) => {
    const { api, history } = extra;
    try {
      const { data } = await api.post<FullOfferDto>(ApiRoute.Offers, adaptCreateOfferToServer(newOffer));
      history.push(`${AppRoute.Property}/${data.id}`);

      return adaptOfferToClient(data);
    } catch (err: unknown) {
      errorHandle(err);

      return Promise.reject(err);
    }
  });

export const editOffer = createAsyncThunk<Offer, Offer, { extra: Extra }>(
  Action.EDIT_OFFER,
  async (offer, { extra }) => {
    const { api, history } = extra;
    const { data } = await api.patch<Offer>(`${ApiRoute.Offers}/${offer.id}`, offer);
    history.push(`${AppRoute.Property}/${data.id}`);

    return data;
  });

export const deleteOffer = createAsyncThunk<void, string, { extra: Extra }>(
  Action.DELETE_OFFER,
  async (id, { extra }) => {
    const { api, history } = extra;
    await api.delete(`${ApiRoute.Offers}/${id}`);
    history.push(AppRoute.Root);
  });

export const fetchPremiumOffers = createAsyncThunk<Offer[], string, { extra: Extra }>(
  Action.FETCH_PREMIUM_OFFERS,
  async (cityName, { extra }) => {
    const { api } = extra;
    try {
      const { data } = await api.get<FullOfferDto[]>(`${ApiRoute.Premium}?city=${cityName}`);

      return adaptOffersToClient(data);
    } catch (err: unknown) {
      errorHandle(err);

      return Promise.reject(err);
    }
  });

export const fetchComments = createAsyncThunk<Comment[], Offer['id'], { extra: Extra }>(
  Action.FETCH_COMMENTS,
  async (id, { extra }) => {
    const { api } = extra;
    try {
      const { data } = await api.get<CommentDTO[]>(`${ApiRoute.Offers}/${id}${ApiRoute.Comments}`);

      return adaptCommentsToClient(data);
    } catch (err: unknown) {
      errorHandle(err);

      return Promise.reject(err);
    }
  });

export const fetchUserStatus = createAsyncThunk<UserAuth['email'], undefined, { extra: Extra }>(
  Action.FETCH_USER_STATUS,
  async (_, { extra }) => {
    const { api } = extra;

    try {
      const { data } = await api.get<User>(ApiRoute.Login);

      return data.email;
    } catch (error) {
      errorHandle(error);

      return Promise.reject(error);
    }
  });

export const loginUser = createAsyncThunk<UserAuth['email'], UserAuth, { extra: Extra }>(
  Action.LOGIN_USER,
  async ({ email, password }, { extra }) => {
    const { api, history } = extra;
    const { data } = await api.post<User & { token: string }>(ApiRoute.Login, { email, password });
    const { token } = data;

    Token.save(token);
    history.push(AppRoute.Root);

    return email;
  });

export const logoutUser = createAsyncThunk<void, undefined, { extra: Extra }>(
  Action.LOGOUT_USER,
  async (_, { extra }) => {
    const { api } = extra;
    await api.delete(ApiRoute.Logout);

    Token.drop();
  });

export const registerUser = createAsyncThunk<void, UserRegister, { extra: Extra }>(
  Action.REGISTER_USER,
  async ({ email, password, name, avatar, type }, { extra }) => {
    const { api, history } = extra;
    const dataContent: CreateUserDTO = adaptSignUpToServer({
      email,
      password,
      name,
      type,
    });

    const { data } = await api.post<{ id: string }>(ApiRoute.Register, dataContent);
    if (avatar) {
      const payload = new FormData();
      payload.append('avatar', avatar);
      await api.post(`/${data.id}${ApiRoute.Avatar}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    history.push(AppRoute.Login);
  });


export const postComment = createAsyncThunk<Comment, CommentAuth, { extra: Extra }>(
  Action.POST_COMMENT,
  async ({ id, comment, rating }, { extra }) => {
    const { api } = extra;
    try {
      const bodyContent: CreateCommentDTO = adaptCreateCommentToServer(id, { comment, rating });
      const { data } = await api.post<CommentDTO>(`${ApiRoute.Comments}`, bodyContent);

      return adaptCommentToClient(data);
    } catch (err: unknown) {
      errorHandle(err);

      return Promise.reject(err);
    }
  });

export const postFavorite = createAsyncThunk<
  Offer,
  FavoriteAuth,
  { extra: Extra }
>(Action.POST_FAVORITE, async (id, { extra }) => {
  const { api, history } = extra;

  try {
    const { data } = await api.post<Offer>(
      `${ApiRoute.Favorite}/${id}`
    );

    return data;
  } catch (error) {
    errorHandle(error);

    return Promise.reject(error);
  }
});

export const deleteFavorite = createAsyncThunk<
  Offer,
  FavoriteAuth,
  { extra: Extra }
>(Action.DELETE_FAVORITE, async (id, { extra }) => {
  const { api, history } = extra;

  try {
    const { data } = await api.delete<Offer>(
      `${ApiRoute.Favorite}/${id}`
    );

    return data;
  } catch (error) {
    errorHandle(error);

    return Promise.reject(error);
  }
});
