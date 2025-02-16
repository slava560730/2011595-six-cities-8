import {DocumentType} from '@typegoose/typegoose';
import {CreateCommentDto} from './dto/create-comment.dto.js';
import {CommentEntity} from '../entities/index.js';

export interface CommentService {
  //добавление комментария
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]>;
  deleteByOfferId(offerId: string): Promise<number | null>;
}
