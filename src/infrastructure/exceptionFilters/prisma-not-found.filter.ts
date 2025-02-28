import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch(PrismaClientKnownRequestError)
export class PrismaNotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    if (exception.code === 'P2025') {
      throw new NotFoundException('Not Found');
    }

    throw new InternalServerErrorException('Internal Server Error');
  }
}
