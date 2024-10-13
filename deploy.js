/**
 * Подключает переменные окружения из файла .env.local и выполняет деплой файлов на удалённый сервер.
 *
 * @module deployScript
 */

import { deploy } from 'sftp-sync-deploy';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Определяем текущие пути файлов
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Загружаем переменные окружения из файла .env.local
dotenv.config({ path: `${__dirname}/.env.local` });

// Получаем аргументы командной строки для определения режима деплоя
const args = process.argv.slice(2);
const modeIndex = args.indexOf('--demo') !== -1 ? '--demo' : args.indexOf('--prod') !== -1 ? '--prod' : null;
const mode = modeIndex === '--demo' ? 'demo' : modeIndex === '--prod' ? 'prod' : 'demo'; // По умолчанию 'demo'

// Проверяем корректность указанного режима
if (mode !== 'demo' && mode !== 'prod') {
  // eslint-disable-next-line no-console
  console.error('❌ Укажите корректный режим: --demo или --prod.');
  process.exit(1);
}

/**
 * Конфигурация для подключения к удалённому серверу.
 *
 * @typedef {Object} SftpConfig
 * @property {string} host - Хост удалённого сервера.
 * @property {number} port - Порт подключения (по умолчанию 22).
 * @property {string} username - Имя пользователя для подключения.
 * @property {string} password - Пароль для подключения.
 * @property {string} [agent] - Путь к сокету SSH агента (опционально).
 * @property {string} localDir - Локальная директория для синхронизации.
 * @property {string} remoteDir - Удалённая директория для синхронизации.
 */

/**
 * Конфигурация подключения для синхронизации файлов через SFTP.
 * @type {SftpConfig}
 */
const config = {
  host: process.env[`FTP_${mode.toUpperCase()}_HOST`],
  port: 22,
  username: process.env[`FTP_${mode.toUpperCase()}_USER`],
  password: process.env[`FTP_${mode.toUpperCase()}_PASSWORD`],
  agent: process.env.SSH_AUTH_SOCK,
  localDir: 'dist',
  remoteDir: process.env[`FTP_${mode.toUpperCase()}_DEST`],
};

/**
 * Опции для настройки синхронизации файлов.
 *
 * @typedef {Object} SftpOptions
 * @property {boolean} dryRun - Если true, выполняет только проверку без реального деплоя.
 * @property {string[]} exclude - Массив шаблонов для исключения файлов и папок.
 * @property {string} excludeMode - Режим исключения файлов (по умолчанию 'remove').
 * @property {boolean} forceUpload - Если true, принудительно загружает все файлы.
 */

/**
 * Опции для настройки синхронизации.
 * @type {SftpOptions}
 */
const options = {
  dryRun: false,
  exclude: ['node_modules', 'src/**/*.spec.ts', '.env'],
  excludeMode: 'remove',
  forceUpload: false,
};

/**
 * Выполняет деплой файлов на удалённый сервер с заданной конфигурацией и опциями.
 *
 * @async
 * @function
 * @throws {Error} Ошибка при деплое.
 */
async function deployFiles() {
  try {
    await deploy(config, options);
    // eslint-disable-next-line no-console
    console.log('\x1b[32m%s\x1b[0m', '✅ Деплой успешно завершён! 🎉');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('❌ Ошибка при деплое: ', err);
  }
}

deployFiles();
