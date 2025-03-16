import {inject, injectable} from 'inversify';
import {DocumentType, types} from '@typegoose/typegoose';
import {CommentService} from './comment-service.interface.js';
import {Component} from '../../types/index.js';
import {Logger} from '../../libs/logger/index.js';
import {CreateCommentDto} from './dto/create-comment.dto.js';
import {DEFAULT_COMMENT_COUNT} from './comment.constant.js';
import {CommentEntity} from '../entities/index.js';
import {SortType} from '../../types/sort-type.enum.js';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
  ) {
  }

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const result = await this.commentModel.create(dto);
    this.logger.info(`New comment created: ${dto.text}`);

    return result.populate('userId');
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({offerId}, {}, {limit: DEFAULT_COMMENT_COUNT})
      .sort({createdAt: SortType.DESC})
      .populate('userId');
  }

  public async deleteByOfferId(offerId: string): Promise<number | null> {
    const result = await this.commentModel
      .deleteMany({offerId})
      .exec();

    return result.deletedCount;
  }

}
