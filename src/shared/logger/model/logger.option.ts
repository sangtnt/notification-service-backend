/* eslint-disable no-empty-function */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any*/
import { Metadata } from '@grpc/grpc-js';
import { ExecutionContext } from '@nestjs/common/interfaces';
import { KafkaContext } from '@nestjs/microservices';
import { randomBytes } from 'crypto';
import { Request, Response } from 'express';
import { ClsService } from 'nestjs-cls';
import { Level } from '../utils/level';

export const CUSTOM_LOGGER_OPTION = Symbol('CUSTOM_LOGGER_OPTION');

export class CustomLoggerOptions {
  output?: 'json' | 'text' = 'text';
  source?: boolean = false;
  gcpProperties?: boolean = false;
  level?: Level = 'trace';
  logFile?: string | null = null;
}

export class KafkaLoggerOptions {
  idGenerator: (context: KafkaContext, payload: any) => string = truncateKafkaIdGenerator(
    defaultKafkaIdGenerator,
    16,
  );
  setup: (
    cls: ClsService,
    context: KafkaContext,
    payload: any,
    options: LoggerModuleOptions,
  ) => void = defaultKafkaSetup;
}

export class HttpLoggerOptions {
  idGenerator: (req: Request, res: Response) => string = truncateHttpIdGenerator(
    defaultHttpIdGenerator,
    16,
  );
  setup: (cls: ClsService, req: Request, res: Response, options: LoggerModuleOptions) => void =
    defaultHttpSetup;
}
export class GrpcLoggerOptions {
  idGenerator: (context: ExecutionContext, payload: any) => string = truncateGrpcIdGenerator(
    defaultGrpcIdGenerator,
    16,
  );

  setup: (
    cls: ClsService,
    context: ExecutionContext,
    payload: any,
    options: LoggerModuleOptions,
  ) => void = defaultGrpcSetup;
}

export class LoggerModuleOptions extends CustomLoggerOptions {
  global?: boolean = true;
  http?: HttpLoggerOptions = new HttpLoggerOptions();
  kafka?: KafkaLoggerOptions = new KafkaLoggerOptions();
  grpc?: GrpcLoggerOptions = new GrpcLoggerOptions();
}

function truncateKafkaIdGenerator(
  generator: (context: KafkaContext, payload: any) => string,
  max: number,
): (context: KafkaContext, payload: any) => string {
  return (context: KafkaContext, payload: any) => {
    const requestId = generator(context, payload);
    if (requestId && requestId.length > max) {
      return requestId.substring(requestId.length - max);
    }

    return requestId;
  };
}

function truncateHttpIdGenerator(
  generator: (req: Request, res: Response) => string,
  max: number,
): (req: Request, res: Response) => string {
  return (req: Request, res: Response) => {
    const requestId = generator(req, res);
    if (requestId && requestId.length > max) {
      return requestId.substring(requestId.length - max);
    }

    return requestId;
  };
}

export function truncateGrpcIdGenerator(
  generator: (context: ExecutionContext, payload: any) => string,
  max: number,
): (context: ExecutionContext, payload: any) => string {
  return (context: ExecutionContext, payload: any) => {
    const requestId = generator(context, payload);
    if (requestId && requestId.length > max) {
      return requestId.substring(requestId.length - max);
    }
    return requestId;
  };
}

function defaultKafkaIdGenerator(context: KafkaContext, payload: any): string {
  const message = context.getMessage();
  if (message?.headers?.['x-request-id']) {
    return message.headers['x-request-id']?.toString();
  }

  if (payload?.event_id) {
    return payload.event_id;
  }

  return getRandomString();
}

function defaultHttpIdGenerator(req: Request, _res: Response): string {
  if (req) {
    if (req['id']) {
      return req['id'];
    }

    if (req.headers['x-request-id']) {
      return req.headers['x-request-id']?.toString();
    }
  }

  return getRandomString();
}

export function defaultGrpcIdGenerator(context: ExecutionContext, _payload: any): string {
  const metadata: Metadata = context?.getArgs()[1] as Metadata;
  const id = metadata?.get('request-id')?.toString() || getRandomString();
  const requestId = Array.isArray(id) ? id[0] : id;
  return requestId;
}

function defaultHttpSetup(
  _cls: ClsService,
  _req: Request,
  _res: Response,
  _options: LoggerModuleOptions,
): void {}

function defaultKafkaSetup(
  _cls: ClsService,
  _context: KafkaContext,
  _payload: any,
  _options: LoggerModuleOptions,
): void {}

function defaultGrpcSetup(
  _cls: ClsService,
  _context: ExecutionContext,
  _payload: any,
  _options: LoggerModuleOptions,
): void {}

function getRandomString(): string {
  return randomBytes(8).toString('hex');
}
