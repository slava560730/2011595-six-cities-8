import {inject, injectable} from 'inversify';
import {Request, Response} from 'express';

import {
  BaseController,
  DocumentExistsMiddleware,
  HttpError,
  HttpMethod,
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

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');

    this.addRoute({
      path: '/register', method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)] });
    this.addRoute({ path: '/login', method: HttpMethod.Post, handler: this.login, middlewares: [new ValidateDtoMiddleware(LoginUserDto)] });
    this.addRoute({ path: '/login', method: HttpMethod.Get, handler: this.checkAuth });
    this.addRoute({ path: '/favorites', method: HttpMethod.Get, handler: this.findFavoritesForUser, middlewares: [new ValidateObjectIdMiddleware('userId')] });
    this.addRoute({ path: '/favorites', method: HttpMethod.Post, handler: this.addFavoriteForUser, middlewares: [new ValidateObjectIdMiddleware('userId'), new DocumentBodyExistsMiddleware(this.offerService, 'Offer', 'offerId')] });
    this.addRoute({ path: '/favorites/:offerId', method: HttpMethod.Delete, handler: this.deleteFavoriteForUser, middlewares: [new ValidateObjectIdMiddleware('userId'),
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
    _res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (!existsUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email ${body.email} not found.`,
        'UserController',
      );
    }

    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController',
    );
  }

  public async checkAuth(): Promise<void> {
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController',
    );
  }

  public async findFavoritesForUser(req: Request, res: Response) {
    const { userId } = req.params;

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

  public async addFavoriteForUser(req: Request, res: Response) {
    const { userId } = req.params;
    const { offerId } = req.body;

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

  public async deleteFavoriteForUser(req: Request, res: Response) {
    const { userId } = req.params;
    const { offerId } = req.body;

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
}

