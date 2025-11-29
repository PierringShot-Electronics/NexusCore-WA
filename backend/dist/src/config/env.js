"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const node_path_1 = __importDefault(require("node:path"));
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const EnvironmentSchema = zod_1.z
    .object({
    NODE_ENV: zod_1.z.enum(['development', 'test', 'production']).default('development'),
    APP_PORT: zod_1.z
        .string()
        .default('3000')
        .transform((value) => Number(value)),
    DATABASE_URL: zod_1.z.string().url(),
    REDIS_URL: zod_1.z.string().url(),
    WAHA_BASE_URL: zod_1.z.string().url().default('http://waha:3000'),
    WAHA_API_KEY: zod_1.z
        .string()
        .superRefine((value, ctx) => {
        const trimmed = value.trim();
        if (trimmed.length < 16) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: 'WAHA_API_KEY must be at least 16 characters'
            });
        }
        if (trimmed === 'admin') {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: 'WAHA_API_KEY cannot be "admin"; please set a secure key'
            });
        }
    })
        .transform((value) => value.trim()),
    WAHA_SESSION: zod_1.z.string().default('default'),
    OPENAI_API_KEY: zod_1.z.string().optional(),
    OPENAI_MODEL: zod_1.z.string().default('gpt-4o-mini'),
    OPENAI_EMBEDDING_MODEL: zod_1.z.string().default('text-embedding-3-small'),
    GROQ_API_KEY: zod_1.z.string().optional(),
    GROQ_ROUTER_MODEL: zod_1.z.string().default('llama-3.1-8b-instant'),
    SESSION_SECRET: zod_1.z.string().default('change-me'),
    BUFFER_TIMEOUT_MS: zod_1.z
        .string()
        .optional()
        .transform((value) => (value ? Number(value) : 8000))
        .refine((value) => value > 0, {
        message: 'BUFFER_TIMEOUT_MS must be greater than 0'
    }),
    BUSINESS_RULES_PATH: zod_1.z
        .string()
        .default(node_path_1.default.join(process.cwd(), 'data', 'biznes.md')),
    TOOL_TAPAZ_BASE_URL: zod_1.z.string().default('https://tap.az/s'),
    DEFAULT_LOCALE: zod_1.z.string().default('az-AZ')
});
exports.env = EnvironmentSchema.parse(process.env);
