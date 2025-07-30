import 'dotenv/config';
import { app, prisma } from './app';
import logger from './utils/logger';
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await prisma.$queryRaw`SELECT 1;`;

    logger.info('✅ Connected to the database');
  } catch (error) {
    logger.error({ error }, '❌ Failed to connect to the database');
  }
})();
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Closing HTTP server and Prisma Client...');
  await prisma.$disconnect();
  process.exit(0);
});
