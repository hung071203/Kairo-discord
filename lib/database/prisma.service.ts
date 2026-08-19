import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { Prisma, PrismaClient } from '@prisma/client';
import { env } from '@lib/configs/env.config';

const LOG_EVENTS: Prisma.LogDefinition[] = [
	{ emit: 'event', level: 'query' },
	{ emit: 'event', level: 'warn' },
	{ emit: 'event', level: 'error' }
];

@Injectable()
export class PrismaService
	extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'warn' | 'error'>
	implements OnModuleInit, OnModuleDestroy
{
	private readonly logger = new Logger('Prisma');

	constructor() {
		super({
			adapter: new PrismaMariaDb(env.DATABASE_URL),
			log: LOG_EVENTS
		});

		this.$on('query', (event) => {
			this.logger.debug(`${event.query} · ${event.params} · ${event.duration}ms`);
		});
		this.$on('warn', (event) => this.logger.warn(event.message));
		this.$on('error', (event) => this.logger.error(event.message));
	}

	public async onModuleInit(): Promise<void> {
		await this.$connect();
	}

	public async onModuleDestroy(): Promise<void> {
		await this.$disconnect();
	}
}
