import { z } from 'zod';

try {
	process.loadEnvFile();
} catch {
	// Không có file .env (ví dụ khi deploy bằng biến môi trường có sẵn), bỏ qua.
}

const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
	DISCORD_TOKEN: z.string().min(1, 'DISCORD_TOKEN không được để trống'),
	DISCORD_DEV_GUILD_IDS: z
		.string()
		.optional()
		.transform((value) => value?.split(',').map((id) => id.trim()).filter(Boolean))
});

function validateEnv(config: Record<string, unknown>) {
	const result = envSchema.safeParse(config);

	if (!result.success) {
		const details = result.error.issues.map((issue) => `- ${issue.path.join('.')}: ${issue.message}`).join('\n');
		throw new Error(`Biến môi trường không hợp lệ:\n${details}`);
	}

	return result.data;
}

export type EnvConfig = z.infer<typeof envSchema>;
export const env: EnvConfig = validateEnv(process.env);
