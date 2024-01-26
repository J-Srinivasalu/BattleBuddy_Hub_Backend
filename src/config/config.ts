import dotenv from "dotenv";

dotenv.config();

const MONGO_DB_URL = process.env.MONGO_DB_URL;
const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY;
const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY ?? "1d";
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY ?? "5d";
const SERVER_PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? "*";

if (!MONGO_DB_URL || !ACCESS_TOKEN_SECRET_KEY || !REFRESH_TOKEN_SECRET_KEY) {
  console.log("Missing environment variable!!");
  process.exit(1);
}

const config = {
  dbUrl: MONGO_DB_URL,
  port: SERVER_PORT,
  accessTokenSecretKey: ACCESS_TOKEN_SECRET_KEY,
  refreshTokenSecretKey: REFRESH_TOKEN_SECRET_KEY,
  accessTokenExpiry: ACCESS_TOKEN_EXPIRY,
  refreshTokenExpiry: REFRESH_TOKEN_EXPIRY,
  corsOrigin: CORS_ORIGIN,
};

export default config;
