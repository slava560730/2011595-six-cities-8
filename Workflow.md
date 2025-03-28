# Как работать над проектом

## Окружение

```bash
npm install
```

Команда запустит процесс установки зависимостей проекта из **npm**.

### Сценарии

В `package.json` предопределено несколько сценариев.

#### Скомпилировать проект

```bash
npm run compile
```

Создаст директорию `dist` и скомпилирует проект.

#### Удалить скомпилированный проект

```bash
npm run clean
```

Удаляет директорию `dist`. Используется перед компиляцией.

#### Собрать проект

```bash
npm run build
```

Выполняет сборку проекта: удаляет ранее скомпилированный проект и компилирует заново.

#### Проверить линтером

```bash
npm run lint
```

Запуск проверки проекта статическим анализатором кода **ESLint**.

#### Запустить ts-модуль без компиляции

```bash
npm run ts -- <Путь к модулю с ts-кодом>
```

Пакет `ts-node` позволяет выполнить TS-код в Node.js без предварительной компиляции. Используется только на этапе разработки.

#### Запустить проект

```bash
npm start
```

В процессе запуска проекта будет выполнен процесс «Сборки проекта» и запуска результирующего кода.

## Структура проекта

### Директория `src`

Исходный код проекта: компоненты, модули и так далее. Структура директории `src` может быть произвольной.

## Полезные команды

npm run ts ./src/main.cli.ts -- --import <path-to-mock>
./dist/main.cli.js --help
chmod u+x ./dist/main.cli.js
firstnames

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
