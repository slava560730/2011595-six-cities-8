import {User} from '../../types/index.js';
import {defaultClasses, modelOptions, prop, Ref} from '@typegoose/typegoose';
import {TypeUser} from '../../types/user.type.js';
import {createSHA256} from '../../helpers/index.js';
import {DEFAULT_USER_AVATAR} from '../../const/common.js';
import {OfferEntity} from './offer.entity.js';

const EMAIL_REG_EXP = /^[^:;,\\[\]<>()\s@]+@[^\s@]+\.\w+$/;

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
  }
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements User {
  constructor(userData: User, password:string, salt:string) {
    super();

    this.email = userData.email;
    this.avatarPath = userData.avatarPath;
    this.firstname = userData.firstname;
    this.type = userData.type;

    this.setPassword(password, salt);
  }

  @prop({ unique: true, required: true, match: EMAIL_REG_EXP })
  public email: string;

  @prop({ required: false, default: DEFAULT_USER_AVATAR })
  public avatarPath: string;

  @prop({ required: true, minlength:1, maxlength:15 })
  public firstname: string;

  @prop({ required: true, enum: TypeUser, })
  public type: TypeUser;

  @prop({ required: true})
  private password?: string;

  @prop({
    ref: () => OfferEntity,
    default: [],
  })
  public favorites?: Ref<OfferEntity>[];

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }

  public getPassword() {
    return this.password;
  }
}

