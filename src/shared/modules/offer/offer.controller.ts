import {
  BaseController,
  DocumentExistsMiddleware,
  HttpError,
  HttpMethod,
  PrivateRouteMiddleware,
  ValidateObjectIdMiddleware
} from '../../libs/rest/index.js';
import {inject} from 'inversify';
import {City, Component} from '../../types/index.js';
import {Logger} from '../../libs/logger/index.js';
import {Request, Response} from 'express';
import {OfferService} from './offer-service.interface.js';
import {StatusCodes} from 'http-status-codes';
import {ParamOfferId} from './type/param-offerid.type.js';
import {fillDTO} from '../../helpers/index.js';
import {FullOfferRdo} from './rdo/full-offer.rdo.js';
import {CreateOfferRequest} from './type/create-offer-request.type.js';
import {UpdateOfferDto} from './dto/update-offer.dto.js';
import {RequestPremiumQuery} from './type/request-premium-query.type.js';
import {CommentRdo, CommentService} from '../comment/index.js';
import {ValidateDtoMiddleware} from '../../libs/rest/middleware/validate-dto.middleware.js';
import {CreateOfferDto} from './dto/create-offer.dto.js';
import {RequestQuery} from '../../libs/rest/types/request-query.type.js';
import {DEFAULT_OFFER_COUNT, MAX_OFFER_COUNT} from './offer.constant.js';
import {UploadFileMiddleware} from '../../libs/rest/middleware/upload-file.middleware.js';
import {Config, RestSchema} from '../../libs/config/index.js';
import {UploadImageRdo} from './rdo/upload-image.rdo.js';

export default class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController');
    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({
      path: '/', method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new PrivateRouteMiddleware(),new ValidateDtoMiddleware(CreateOfferDto)]
    });
    this.addRoute({path: '/premium', method: HttpMethod.Get, handler: this.findPremium});
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [new ValidateObjectIdMiddleware('offerId'), new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [new PrivateRouteMiddleware(),new ValidateObjectIdMiddleware('offerId'), new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [new PrivateRouteMiddleware(),new ValidateObjectIdMiddleware('offerId'), new ValidateDtoMiddleware(UpdateOfferDto),new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),]
    });
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [new ValidateObjectIdMiddleware('offerId'), new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),]
    });
    this.addRoute({
      path: '/:offerId/image',
      method: HttpMethod.Post,
      handler: this.uploadImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'previewImage'),
      ]
    });
  }

  public async show({params, tokenPayload }: Request<ParamOfferId>, res: Response): Promise<void> {
    const {offerId} = params;
    const userId = tokenPayload?.sub;

    const offer = await this.offerService.findById(offerId, userId);

    this.ok(res, fillDTO(FullOfferRdo, offer));
  }

  public async index({ query, tokenPayload }: Request<unknown, unknown,unknown, RequestQuery>, res: Response) {
    const limitNum = Number(query?.limit);
    const limit = query?.limit && !Number.isNaN(limitNum) && limitNum < MAX_OFFER_COUNT ? limitNum : DEFAULT_OFFER_COUNT;
    const userId = tokenPayload?.sub;

    if (!Number.isSafeInteger(limit)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Limit param is not correct.',
        'OfferController'
      );
    }

    const offers = await this.offerService.find(userId, limit);

    this.ok(res, fillDTO(FullOfferRdo, offers));
  }

  public async create({body,tokenPayload }: CreateOfferRequest, res: Response): Promise<void> {
    const userId = tokenPayload?.sub;

    const result = await this.offerService.create({...body, userId});
    const offer = await this.offerService.findById(result.id, '');

    this.created(res, fillDTO(FullOfferRdo, offer));
  }

  public async delete({params}: Request<ParamOfferId>, res: Response): Promise<void> {
    const {offerId} = params;
    const offer = await this.offerService.deleteById(offerId);

    await this.commentService.deleteByOfferId(offerId);

    this.noContent(res, offer);
  }

  public async update({
    body,
    params
  }: Request<ParamOfferId, unknown, UpdateOfferDto>, res: Response): Promise<void> {
    const offerId = String(params?.offerId);
    const updatedOffer = await this.offerService.updateById(offerId, body);

    this.ok(res, fillDTO(FullOfferRdo, updatedOffer));
  }

  public async findPremium({ query, tokenPayload }: Request<unknown, unknown, unknown, RequestPremiumQuery>, res: Response): Promise<void> {
    const city = query?.city;
    const userId = tokenPayload?.sub;

    if (!city) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'City in query is not correct.',
        'OfferController'
      );
    }

    if (!(city in City)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'City in query not included in the list of available cities.',
        'OfferController'
      );
    }

    const offers = await this.offerService.findByPremium(city as City, userId);
    const responseData = fillDTO(FullOfferRdo, offers);
    this.ok(res, responseData);
  }


  public async getComments({params}: Request<ParamOfferId>, res: Response): Promise<void> {
    if (!await this.offerService.exists(params.offerId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${params.offerId} not found.`,
        'OfferController'
      );
    }

    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentRdo, comments));
  }


  public async uploadImage({ params, file } : Request<ParamOfferId>, res: Response) {
    const { offerId } = params;
    const updateDto = { previewImage: file?.filename };
    await this.offerService.updateById(offerId, updateDto);
    this.created(res, fillDTO(UploadImageRdo, updateDto));
  }
}
