import {inject, injectable} from 'inversify';
import {Request, Response} from 'express';

import {BaseController, HttpMethod} from '../../libs/rest/index.js';
import {Logger} from '../../libs/logger/index.js';
import {Component} from '../../types/index.js';
import {CommentService} from './comment-service.interface.js';
import {fillDTO} from '../../helpers/common.js';
import {CommentRDO} from './rdo/comment.rdo.js';
import {CreateCommentDto} from './dto/create-comment.dto.js';

@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService) protected readonly commentService: CommentService,
  ) {
    super(logger);

    this.logger.info('Register routes for CommentController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
  }

  public async index({query}: Request, res: Response): Promise<void> {
    const offerId = String(query.offerId);
    const comments = await this.commentService.findByOfferId(offerId);
    const responseData = fillDTO(CommentRDO, comments);

    this.ok(res, responseData);
  }

  public async create({ body }: Request<Record<string, unknown>, Record<string, unknown>, CreateCommentDto>, res: Response): Promise<void> {
    const result = await this.commentService.create(body);

    this.created(res, fillDTO(CommentRDO, result));
  }
}
