import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { env } from '@lib/configs/env.config';
import { resolveLogLevels } from '@lib/utils/log-level.util';
import { AppModule } from './app.module';

async function bootstrap() {
	await NestFactory.createApplicationContext(AppModule, {
		logger: resolveLogLevels(env.LOG_LEVEL)
	});
}

bootstrap();
