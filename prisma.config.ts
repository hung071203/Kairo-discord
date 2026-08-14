import { defineConfig, env } from 'prisma/config';

try {
	process.loadEnvFile();
} catch {
	// No .env file present, ignore (use environment variables already set).
}

export default defineConfig({
	schema: 'prisma/schema.prisma',
	migrations: {
		path: 'prisma/migrations'
	},
	datasource: {
		url: env('DATABASE_URL')
	}
});
