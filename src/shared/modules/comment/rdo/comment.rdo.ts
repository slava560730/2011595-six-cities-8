import {Expose} from 'class-transformer';

export class CommentRDO {
  @Expose()
  public id: string;

  @Expose()
  public text!: string;

  @Expose({ name: 'createdAt' })
  public publicationDate!: string;

  @Expose()
  public rating!: number;

  @Expose()
  public userId: string;
}
