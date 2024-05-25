/* eslint-disable prettier/prettier */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Pagination = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (request.query.page === undefined) {
      request.query.page = 1;
    }
    if (request.query.pageSize === undefined) {
      request.query.pageSize = 100;
    }

    request.query.limit = (Number(request.query.page) - 1) * Number(request.query.pageSize);
    request.query.page = Number(request.query.page);
    request.query.pageSize = Number(request.query.pageSize);

    return request.query;
  },
);
