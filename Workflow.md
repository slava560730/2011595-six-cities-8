## Полезные команды

npm run ts ./src/main.cli.ts -- --import <path-to-mock>
./dist/main.cli.js --help
chmod u+x ./dist/main.cli.js

npm run ts ./src/main.cli.ts -- --import ./mocks/test-data.tsv
npm run ts ./src/main.cli.ts -- --generate 100 ./mocks/test-data.tsv http://localhost:3123/api
npm run ts ./src/main.cli.ts -- --import .\mocks\test-data.tsv admin test localhost six-cities secret

PORT=8000 - Номер порта работы приложения
DB_HOST=localhost - Хост для подключения к базе данных
SALT=salt - Соль 
DB_USER=admin - Логин к базе данных 
DB_PASSWORD=password - Пароль к базе данных 
DB_PORT=27017 - Порт для подключения к базе данных
DB_NAME=collection_name - Имя базы данных 
UPLOAD_DIRECTORY=directory_path - Путь до хранения файлов в корне сервера 
JWT_SECRET=secretik - Секрет для аутентификации пользователя по JWT токену 
JWT_EXPIRED=2d - Время жизни токена аутенификации
