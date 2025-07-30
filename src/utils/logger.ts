import path from 'path';
import pino from 'pino';
import pinoCaller from 'pino-caller';
import { fileURLToPath } from 'url';

let projectRoot: string;

if (typeof __dirname !== 'undefined') {
  // CommonJS
  projectRoot = path.resolve(__dirname, '../');
} else {
  // ESM
  //@ts-ignore
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  projectRoot = path.resolve(__dirname, '../');
}

const baseLogger = pino({
  transport: {
    target: 'pino-pretty',
    options: { colorize: true },
  },
  mixin() {
    return { caller: undefined };
  },
});

const logger = pinoCaller(baseLogger, {
  relativeTo: projectRoot,
});

export default logger;
