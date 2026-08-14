import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';
import { env } from '@lib/configs/env.config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
	constructor() {
		super({ adapter: new PrismaMariaDb(env.DATABASE_URL) });
	}

	public async onModuleInit(): Promise<void> {
		await this.$connect();
	}

	public async onModuleDestroy(): Promise<void> {
		await this.$disconnect();
	}
}
