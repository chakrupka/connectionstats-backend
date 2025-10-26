import dotenv from 'dotenv';
dotenv.config();

const envMap = {
  prod: process.env.MONGODB_URI,
  dev: process.env.DEV_MONGODB_URI,
  test: process.env.TEST_MONGODB_URI,
};

const PORT = process.env.PORT;
const MONGODB_URI =
  envMap[process.env.NODE_ENV] || process.env.TEST_MONGODB_URI;

export default { PORT, MONGODB_URI };
