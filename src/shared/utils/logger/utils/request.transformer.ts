/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { KafkaMessage } from 'kafkajs';
import { serializeRequest } from './serializers.utils';
import { isSilentRequestBody } from '../decorators/silent-request-body.decorators';
import { Reflector } from '@nestjs/core';
import { RpcArgumentsHost } from '@nestjs/common/interfaces';

export function transformHttpRequest(
  reflector: Reflector,
  context: ExecutionContext,
  request: Request,
): any {
  const isSilentBody = isSilentRequestBody(reflector, context);
  const serializedRequest = serializeRequest(request);

  if (isSilentBody && serializedRequest['body']) {
    serializedRequest['body'] = '(silent)';
  }

  return serializedRequest;
}

export function transformKafkaRequest(
  reflector: Reflector,
  context: ExecutionContext,
  message: KafkaMessage,
): any {
  const isSilentBody = isSilentRequestBody(reflector, context);
  const serializedMessage = Object.assign({}, message);

  if (isSilentBody && serializedMessage.value) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    serializedMessage.value = '(silent)';
  }

  return serializedMessage;
}

export function transformGrpcRequest(
  reflector: Reflector,
  context: ExecutionContext,
  _data: any,
  _metadata: any,
): any {
  const isSilentBody = isSilentRequestBody(reflector, context);
  const rpcContext: RpcArgumentsHost = context.switchToRpc();
  const clientData = rpcContext.getData();
  const serializedMessage = Object.assign({}, clientData);

  if (isSilentBody && serializedMessage.value) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    serializedMessage.value = '(silent)';
  }

  return serializedMessage;
}
