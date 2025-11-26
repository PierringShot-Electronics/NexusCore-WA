"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const EnvironmentSchema = zod_1.z.object({
    NODE_ENV: zod_1.z
        .enum(['development', 'test', 'production'])
        .default('development'),
    APP_PORT: zod_1.z
        .string()
        .default('3000')
        .transform((value) => Number(value)),
    DATABASE_URL: zod_1.z.string().url(),
    REDIS_URL: zod_1.z.string().url(),
    WAHA_BASE_URL: zod_1.z.string().url().default('http://waha:3000'),
    OPENAI_API_KEY: zod_1.z.string().optional(),
    GROQ_API_KEY: zod_1.z.string().optional(),
    SESSION_SECRET: zod_1.z.string().default('change-me'),
    BUFFER_TIMEOUT_MS: zod_1.z
        .string()
        .optional()
        .transform((value) => (value ? Number(value) : 8000))
        .refine((value) => value > 0, {
        message: 'BUFFER_TIMEOUT_MS must be greater than 0'
    })
});
exports.env = EnvironmentSchema.parse(process.env);
