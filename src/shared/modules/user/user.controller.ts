import {inject, injectable} from 'inversify';
import {Request, Response} from 'express';

import {
  BaseController,
  DocumentExistsMiddleware,
  HttpError,
  HttpMethod,
  PrivateRouteMiddleware,
  ValidateObjectIdMiddleware
} from '../../libs/rest/index.js';
import {Logger} from '../../libs/logger/index.js';
import {Component} from '../../types/index.js';
import {CreateUserRequest} from './create-user-request.type.js';
import {UserService} from './user-service.interface.js';
import {Config, RestSchema} from '../../libs/config/index.js';
import {StatusCodes} from 'http-status-codes';
import {fillDTO} from '../../helpers/index.js';
import {UserRdo} from './rdo/user.rdo.js';
import {LoginUserRequest} from './login-user-request.type.js';
import {ValidateDtoMiddleware} from '../../libs/rest/middleware/validate-dto.middleware.js';
import {CreateUserDto} from './dto/create-user.dto.js';
import {LoginUserDto} from './dto/login-user.dto.js';
import {OfferService} from '../offer/index.js';
import {
  DocumentBodyExistsMiddleware
} from '../../libs/rest/middleware/document-body-exists.middleware.js';
import {UploadFileMiddleware} from '../../libs/rest/middleware/upload-file.middleware.js';
import {AuthService} from '../auth/index.js';
import {LoggedUserRdo} from './rdo/logged-user.rdo.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
    @inject(Component.AuthService) private readonly authService: AuthService,
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');

    this.addRoute({
      path: '/register', method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)] });
    this.addRoute({ path: '/login', method: HttpMethod.Post, handler: this.login, middlewares: [new ValidateDtoMiddleware(LoginUserDto)] });
    this.addRoute({ path: '/favorites', method: HttpMethod.Get, handler: this.findFavoritesForUser, middlewares: [new PrivateRouteMiddleware(),new ValidateObjectIdMiddleware('userId')] });
    this.addRoute({ path: '/favorites', method: HttpMethod.Post, handler: this.addFavoriteForUser, middlewares: [new PrivateRouteMiddleware(),new ValidateObjectIdMiddleware('userId'), new DocumentBodyExistsMiddleware(this.offerService, 'Offer', 'offerId')] });
    this.addRoute({ path: '/favorites/:offerId', method: HttpMethod.Delete, handler: this.deleteFavoriteForUser, middlewares: [new PrivateRouteMiddleware(),new ValidateObjectIdMiddleware('userId'),
      new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')] });
    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar'),
      ]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.checkAuthenticate,
    });
  }

  public async create(
    { body }: CreateUserRequest,
    res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDTO(UserRdo, result));
  }

  public async login(
    { body }: LoginUserRequest,
    res: Response,
  ): Promise<void> {
    const user = await this.authService.verify(body);
    const token = await this.authService.authenticate(user);
    const responseData = fillDTO(LoggedUserRdo, {
      email: user.email,
      token,
    });
    this.ok(res, responseData);

  }

  public async findFavoritesForUser({tokenPayload }: Request, res: Response) {
    const userId = tokenPayload?.sub;

    const existsUser = await this.userService.findById(userId);

    if (!existsUser) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with id ${userId} not found.`,
        'UserController',
      );
    }

    const user = await this.userService.findFavoritesForUser(userId);
    this.ok(res, fillDTO(UserRdo, user));
  }

  public async addFavoriteForUser({tokenPayload,body }: Request, res: Response) {
    const userId = tokenPayload?.sub;
    const offerId = body?.offerId;

    const existsUser = await this.userService.findById(userId);

    if (!existsUser) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with id ${userId} not found.`,
        'UserController',
      );
    }

    const updatedUser = await this.userService.addFavorite(userId, offerId);
    this.ok(res, fillDTO(UserRdo, updatedUser));
  }

  public async deleteFavoriteForUser({tokenPayload,body }: Request, res: Response) {
    const userId = tokenPayload?.sub;
    const offerId = body?.offerId;

    const existsUser = await this.userService.findById(userId);

    if (!existsUser) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with id ${userId} not found.`,
        'UserController',
      );
    }

    const updatedUser = await this.userService.deleteFavorite(userId, offerId);
    this.ok(res, fillDTO(UserRdo, updatedUser));
  }

  public async uploadAvatar(req: Request, res: Response) {
    this.created(res, {
      filepath: req.file?.path
    });
  }


  public async checkAuthenticate({ tokenPayload }: Request, res: Response) {
    const userId = tokenPayload?.sub;
    const foundedUser = await this.userService.findById(userId);

    if (!foundedUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'AuthController'
      );
    }

    this.ok(res, fillDTO(UserRdo, foundedUser));
  }
}

