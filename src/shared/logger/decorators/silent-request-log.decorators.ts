import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { SILENT_REQUEST_LOG_METADATA } from '../utils/constrants';
import { Reflector } from '@nestjs/core';

export const SilentRequestLog = (): MethodDecorator =>
  SetMetadata(SILENT_REQUEST_LOG_METADATA, true);

export function isSilentRequestLog(reflector: Reflector, context: ExecutionContext): boolean {
  const isSilentHandler = reflector.getAllAndOverride<boolean>(SILENT_REQUEST_LOG_METADATA, [
    context.getHandler(),
    context.getClass(),
  ]);

  return isSilentHandler || false;
}
