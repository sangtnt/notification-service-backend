import { Environment } from '@/shared/constants/constants';
import { LoggerModuleOptions } from '@/shared/utils/logger/model/logger.option';
import { Level } from '@/shared/utils/logger/utils/level';

export function getLogLevels(): Level {
  return (process.env['LOG_LEVEL'] as Level) ?? 'debug';
}

export function getLoggerOptions(): LoggerModuleOptions {
  return {
    global: true,
    output: process.env['NODE_ENV'] === Environment.Local ? 'text' : 'json',
    gcpProperties: process.env['NODE_ENV'] !== Environment.Local,
    source: ![Environment.Staging, Environment.Production].includes(
      process.env.NODE_ENV as Environment,
    ),
    level: getLogLevels(),
    logFile: process.env['LOG_FILE'],
  };
}
