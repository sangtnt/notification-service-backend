/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExecutionContext } from '@nestjs/common';
import { isSilentResponseBody } from '../decorators/silent-response-body.decorators';
import { Reflector } from '@nestjs/core';

export function transformHttpResponseBody(
  reflector: Reflector,
  context: ExecutionContext,
  body: any,
): any {
  const isSilentBody = isSilentResponseBody(reflector, context);
  if (!isSilentBody) {
    return body;
  }

  return '(silent)';
}

export function transformKafkaResponseBody(
  reflector: Reflector,
  context: ExecutionContext,
  body: any,
): any {
  const isSilentBody = isSilentResponseBody(reflector, context);
  if (!isSilentBody) {
    return body;
  }

  return '(silent)';
}

export function transformGrpcResponseBody(
  reflector: Reflector,
  context: ExecutionContext,
  body: any,
): any {
  // You can add additional transformations as needed
  return {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    responseBody: body, // The actual response being sent back
  };
}
