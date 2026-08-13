import { defineConfig, env } from 'prisma/config';

try {
	process.loadEnvFile();
} catch {
	// Không có file .env, bỏ qua (dùng biến môi trường có sẵn).
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
