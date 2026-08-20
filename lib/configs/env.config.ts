import { z } from 'zod';

try {
	process.loadEnvFile();
} catch {
	// No .env file present (e.g. deploying with environment variables already set), ignore.
}

const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
	LOG_LEVEL: z.enum(['error', 'warn', 'log', 'debug', 'verbose']).default('log'),
	DISCORD_TOKEN: z.string().min(1, 'DISCORD_TOKEN is required'),
	DISCORD_DEV_GUILD_IDS: z
		.string()
		.optional()
		.transform((value) => value?.split(',').map((id) => id.trim()).filter(Boolean)),
	DATABASE_URL: z.string().min(1, 'DATABASE_URL is required')
});

function validateEnv(config: Record<string, unknown>) {
	const result = envSchema.safeParse(config);

	if (!result.success) {
		const details = result.error.issues.map((issue) => `- ${issue.path.join('.')}: ${issue.message}`).join('\n');
		throw new Error(`Invalid environment variables:\n${details}`);
	}

	return result.data;
}

export type EnvConfig = z.infer<typeof envSchema>;
export const env: EnvConfig = validateEnv(process.env);
