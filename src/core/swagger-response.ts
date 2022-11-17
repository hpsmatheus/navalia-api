/* eslint-disable @typescript-eslint/ban-types */
import { HttpStatus, Type } from '@nestjs/common';
import { ApiResponseOptions } from '@nestjs/swagger';
import ApiExceptionTyping from '../../src/typings/api-exception.typing.entity';

function ok(
  type?: Type<unknown> | Function | [Function] | string,
): ApiResponseOptions {
  return {
    status: HttpStatus.OK,
    description: 'success',
    type,
  };
}

const NotFound: ApiResponseOptions = {
  status: HttpStatus.NOT_FOUND,
  description: 'not found',
  type: [ApiExceptionTyping],
};

const InputValidationError: ApiResponseOptions = {
  status: HttpStatus.BAD_REQUEST,
  description: 'errors occurred during input validation',
  type: [ApiExceptionTyping],
};

export const SwaggerResponse = {
  Ok: ok,
  NotFound,
  InputValidationError,
};
