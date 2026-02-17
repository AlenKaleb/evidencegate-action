"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigError = void 0;
exports.loadConfig = loadConfig;
const core = __importStar(require("@actions/core"));
const fs_1 = require("fs");
const yaml_1 = require("yaml");
const ajv_1 = __importDefault(require("ajv"));
const defaults_1 = require("./defaults");
const schema_json_1 = __importDefault(require("./schema.json"));
class ConfigError extends Error {
    constructor(message, field, details) {
        super(message);
        this.field = field;
        this.details = details;
        this.name = 'ConfigError';
    }
}
exports.ConfigError = ConfigError;
/**
 * Formats Ajv validation errors into a readable message
 */
function formatValidationErrors(errors) {
    return errors
        .map(err => {
        const field = err.instancePath || err.params.additionalProperty || 'root';
        const message = err.message || 'unknown error';
        return `  • ${field}: ${message}`;
    })
        .join('\n');
}
/**
 * Validates configuration against JSON schema using Ajv
 */
function validateConfig(config) {
    const ajv = new ajv_1.default({ allErrors: true, strict: false });
    const validate = ajv.compile(schema_json_1.default);
    if (!validate(config)) {
        const errorMessage = formatValidationErrors(validate.errors || []);
        throw new ConfigError('Configuration validation failed', undefined, errorMessage);
    }
    return config;
}
/**
 * Parses YAML content and handles parsing errors
 */
function parseYamlContent(content, configPath) {
    try {
        return (0, yaml_1.parse)(content);
    }
    catch (error) {
        const err = error;
        throw new ConfigError(`Invalid YAML syntax in ${configPath}`, undefined, err.message);
    }
}
/**
 * Loads and validates configuration from file
 */
function loadConfig(configPath = '.compliance-gate.yml') {
    core.info(`Looking for configuration at: ${configPath}`);
    // If config file doesn't exist, use defaults
    if (!(0, fs_1.existsSync)(configPath)) {
        core.info(`Configuration file not found at ${configPath}, using defaults`);
        return { ...defaults_1.DEFAULT_CONFIG };
    }
    try {
        // Read and parse YAML file
        const fileContent = (0, fs_1.readFileSync)(configPath, 'utf-8');
        core.info(`Configuration file found, parsing...`);
        const parsedConfig = parseYamlContent(fileContent, configPath);
        // Merge with defaults (user config overrides defaults)
        const mergedConfig = {
            ...defaults_1.DEFAULT_CONFIG,
            ...parsedConfig
        };
        // Validate against schema
        const validConfig = validateConfig(mergedConfig);
        core.info('Configuration loaded and validated successfully');
        core.debug(`Configuration: ${JSON.stringify(validConfig, null, 2)}`);
        return validConfig;
    }
    catch (error) {
        if (error instanceof ConfigError) {
            // Add error details to step summary
            core.summary
                .addHeading('❌ Configuration Error', 2)
                .addRaw(`Failed to load configuration from <code>${configPath}</code>`)
                .addHeading('Error Details', 3)
                .addCodeBlock(error.details || error.message, 'text');
            // Write summary (don't await, just fire and forget)
            core.summary.write().catch(() => { });
            throw error;
        }
        // Re-throw unexpected errors
        throw error;
    }
}
//# sourceMappingURL=loader.js.map