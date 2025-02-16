import {Command} from './command.interface.js';
import {TSVFileReader} from '../../shared/libs/file-reader/index.js';
import {getErrorMessage, getMongoURI} from '../../shared/helpers/index.js';
import {DefaultUserService, UserService} from '../../shared/modules/user/index.js';
import {DefaultOfferService, OfferService} from '../../shared/modules/offer/index.js';
import {DatabaseClient, MongoDatabaseClient} from '../../shared/libs/database-client/index.js';
import {Logger} from '../../shared/libs/logger/index.js';
import {ConsoleLogger} from '../../shared/libs/logger/console.logger.js';
import {Offer} from '../../shared/types/index.js';
import {DEFAULT_USER_PASSWORD} from './command.constant.js';
import {Config, RestConfig, RestSchema} from '../../shared/libs/config/index.js';
import {CommentService, DefaultCommentService} from '../../shared/modules/comment/index.js';
import {CommentModel, OfferModel, UserModel} from '../../shared/modules/entities/index.js';

export class ImportCommand implements Command {
  private userService!: UserService;
  private offerService!: OfferService;
  private commentService!: CommentService;
  private databaseClient!: DatabaseClient;
  private logger!: Logger;
  private salt!: string;
  private config!: Config<RestSchema>;

  constructor() {
    this.onImportedOffer = this.onImportedOffer.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this.logger = new ConsoleLogger();
    this.config = new RestConfig(this.logger);
    this.offerService = new DefaultOfferService(this.logger, OfferModel, this.commentService);
    this.userService = new DefaultUserService(this.logger, UserModel, this.offerService);
    this.commentService = new DefaultCommentService(this.logger,CommentModel);
    this.databaseClient = new MongoDatabaseClient(this.logger);
  }

  private async onImportedOffer(offer: Offer, resolve: () => void) {
    await this.saveOffer(offer);
    resolve();
  }

  private async saveOffer(offer: Offer) {
    const user = await this.userService.findOrCreate({
      ...offer.user,
      password: DEFAULT_USER_PASSWORD
    }, this.salt);

    await this.offerService.create({
      title: offer.title,
      description: offer.description,
      postDate: offer.postDate,
      city: offer.city,
      previewImage: offer.previewImage,
      images: offer.images,
      isPremium: offer.isPremium,
      isFavorite: offer.isFavorite,
      rating: offer.rating,
      type: offer.type,
      roomsCount: offer.roomsCount,
      maxAdults: offer.maxAdults,
      price: offer.price,
      goods: offer.goods,
      userId: user.id,
      reviewsCount: 0,
      location: offer.location,
      comments: [],
    });
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported.`);
    this.databaseClient.disconnect();
  }

  public getName(): string {
    return '--import';
  }

  public async execute(filename: string, login: string, password: string, host: string, dbname: string, salt: string): Promise<void> {
    const uri = getMongoURI(login, password, host, this.config.get('DB_PORT'), dbname);
    this.salt = salt;

    await this.databaseClient.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());
    fileReader.on('line', this.onImportedOffer);
    fileReader.on('end', this.onCompleteImport);

    try {
      fileReader.read();
    } catch (error) {

      console.error(`Can't import data from file: ${filename}`);
      console.error(getErrorMessage(error));
    }
  }
}
