import {inject, injectable} from 'inversify';
import {Response} from 'express';

import {BaseController, HttpError, HttpMethod} from '../../libs/rest/index.js';
import {Logger} from '../../libs/logger/index.js';
import {Component} from '../../types/index.js';
import {CommentService} from './comment-service.interface.js';
import {fillDTO} from '../../helpers/common.js';
import {OfferService} from '../offer/index.js';
import {CreateCommentRequest} from './types/create-comment-request.type.js';
import {StatusCodes} from 'http-status-codes';
import {CommentRdo} from './rdo/comment.rdo.js';
import {ValidateDtoMiddleware} from '../../libs/rest/middleware/validate-dto.middleware.js';
import {CreateCommentDto} from './dto/create-comment.dto.js';
import {
  DocumentBodyExistsMiddleware
} from '../../libs/rest/middleware/document-body-exists.middleware.js';

@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService) protected readonly commentService: CommentService,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);

    this.logger.info('Register routes for CommentController…');

    // this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create,
      middlewares: [
        new ValidateDtoMiddleware(CreateCommentDto),
        new DocumentBodyExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ] });
  }

  // public async index({query}: CreateCommentRequest, res: Response): Promise<void> {
  //   const offerId = String(query.offerId);
  //   const comments = await this.commentService.findByOfferId(offerId);
  //
  //   this.ok(res, fillDTO(CommentRDO, comments));
  // }

  public async create({ body }: CreateCommentRequest, res: Response): Promise<void> {
    if (!await this.offerService.exists(body.offerId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${body.offerId} not found.`,
        'CommentController'
      );
    }

    const result = await this.commentService.create(body);

    await this.offerService.incCommentCount(body.offerId);

    this.created(res, fillDTO(CommentRdo, result));
  }
}
