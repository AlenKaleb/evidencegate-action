/**
 * Default configuration for Evidence Gate
 * Conservative defaults that won't break pipelines unnecessarily
 */
export interface ComplianceConfig {
    mode: 'warn' | 'fail' | 'enforce';
    require_sbom: boolean;
    require_provenance: boolean;
    sbom_paths: string[];
}
export declare const DEFAULT_CONFIG: ComplianceConfig;
//# sourceMappingURL=defaults.d.ts.map