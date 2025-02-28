import winston from "winston";
import LokiTransport from "winston-loki";
import {LoggingWinston} from "@google-cloud/logging-winston";
import * as functionsLogger from "firebase-functions/logger";

// Настройка Winston уровней логирования
const loggerLevels = {
  error: 0, // Ошибки
  warn: 1, // Предупреждения
  info: 2, // Информационные логи
  http: 3, // HTTP-запросы
  debug: 4, // Отладка
};

// 🔹 Логирование в Firebase Logging
const firebaseTransport = new winston.transports.Stream({
  stream: process.stdout,
  log: (info, callback) => {
    switch (info.level) {
    case "error":
      functionsLogger.error(info.message, info);
      break;
    case "warn":
      functionsLogger.warn(info.message, info);
      break;
    case "info":
      functionsLogger.info(info.message, info);
      break;
    case "debug":
      functionsLogger.debug(info.message, info);
      break;
    }
    callback();
  },
});

// 🔹 Логирование в Loki (Grafana)
const lokiTransport = new LokiTransport({
  host: "https://your-loki-url",
  labels: {service: "firebase-functions"},
  json: true,
  replaceTimestamp: true,
});

// 🔹 Логирование в Google Cloud Logging
const googleCloudTransport = new LoggingWinston();

const logger = winston.createLogger({
  levels: loggerLevels, // Указываем уровни логирования
  level: "debug", // Минимальный уровень логов (все от debug до error)
  format: winston.format.combine(
    winston.format.timestamp(), // Добавляет время к каждому логу
    winston.format.json() // Логирование в формате JSON
  ),
  transports: [firebaseTransport, lokiTransport, googleCloudTransport],
});

export default logger;
