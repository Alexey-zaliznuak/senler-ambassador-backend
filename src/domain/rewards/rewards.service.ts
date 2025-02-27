import { Inject, Injectable } from '@nestjs/common';
import { PRISMA } from 'src/infrastructure/database/database.config';
import { ExtendedPrismaClientType } from 'src/infrastructure/database/database.service';

@Injectable()
export class RewardsService {
  constructor(
    @Inject(PRISMA) private readonly prisma: ExtendedPrismaClientType
  ) {}
}
