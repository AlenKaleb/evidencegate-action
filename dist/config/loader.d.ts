import { ComplianceConfig } from './defaults';
export declare class ConfigError extends Error {
    readonly field?: string | undefined;
    readonly details?: string | undefined;
    constructor(message: string, field?: string | undefined, details?: string | undefined);
}
/**
 * Loads and validates configuration from file
 */
export declare function loadConfig(configPath?: string): ComplianceConfig;
//# sourceMappingURL=loader.d.ts.map