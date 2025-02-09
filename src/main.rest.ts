import 'reflect-metadata';
import {Container} from 'inversify';
import {RestApplication} from './rest/index.js';
import {Component} from './shared/types/index.js';
import {createRestApplicationContainer} from './rest/rest.container.js';
import {createUserContainer} from './shared/modules/user/index.js';
import {createCommentContainer} from './shared/modules/comment/index.js';
import {createOfferContainer} from './shared/modules/offer/index.js';

async function bootstrap() {
  const appContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createOfferContainer(),
    createCommentContainer(),
  );

  const application = appContainer.get<RestApplication>(Component.RestApplication);
  // const user = appContainer.get<UserService>(Component.UserService);
  await application.init();

  // await user.create({
  //   email: 'pvv56@mail.ru',
  //   type: TypeUser.Pro,
  //   firstname: 'sdsd',
  //   avatarPath: 'asdsa',
  //   password: 'sad11212sd',
  // }, "hhhhh");
}

bootstrap();
