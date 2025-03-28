import {inject, injectable} from 'inversify';
import {Response} from 'express';

import {BaseController, HttpMethod, PrivateRouteMiddleware} from '../../libs/rest/index.js';
import {Logger} from '../../libs/logger/index.js';
import {Component} from '../../types/index.js';
import {CommentService} from './comment-service.interface.js';
import {fillDTO} from '../../helpers/common.js';
import {OfferService} from '../offer/index.js';
import {CreateCommentRequest} from './types/create-comment-request.type.js';
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

    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateCommentDto),
        new DocumentBodyExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ] });
  }

  public async create({ body, tokenPayload }: CreateCommentRequest, res: Response): Promise<void> {

    const result = await this.commentService.create({...body, userId:tokenPayload.sub});

    await this.offerService.incCommentCount(body.offerId);

    this.created(res, fillDTO(CommentRdo, result));
  }
}
