# Evidence Gate

[![GitHub Marketplace](https://img.shields.io/badge/Marketplace-Evidence%20Gate-blue?logo=github)](https://github.com/marketplace/actions/evidence-gate)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A GitHub Action for **compliance gating** with SBOM (Software Bill of Materials) and provenance verification. Validate your software supply chain artifacts before releasing.

## Features

- **SBOM Validation** — Verify the presence and format of SBOM files (CycloneDX and SPDX supported)
- **Provenance Checks** — Validate provenance attestations for your builds
- **Flexible Modes** — Choose between `warn`, `fail`, or `enforce` to match your adoption stage
- **GitHub Integration** — Native check annotations, job summaries, and PR comments

## Quick Start

### 1. Add the configuration file

Create `.compliance-gate.yml` in the root of your repository:

```yaml
mode: warn
require_sbom: true
require_provenance: false
sbom_paths:
  - sbom.cdx.json
  - sbom.spdx.json
```

### 2. Add the action to your workflow

```yaml
name: Compliance Check

on:
  push:
    branches: [main]
  pull_request:

jobs:
  compliance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Evidence Gate
        uses: AlenKaleb/evidence-gate@v1
        with:
          config-path: '.compliance-gate.yml'
```

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `config-path` | Path to the compliance gate configuration file | No | `.compliance-gate.yml` |

## Outputs

| Output | Description |
|--------|-------------|
| `result` | Compliance check result: `pass`, `warn`, or `fail` |

## Configuration

The `.compliance-gate.yml` file supports the following options:

| Option | Description | Default |
|--------|-------------|----------|
| `mode` | Action mode: `warn`, `fail`, or `enforce` | `warn` |
| `require_sbom` | Whether to require SBOM files | `true` |
| `require_provenance` | Whether to require provenance attestations | `false` |
| `sbom_paths` | Paths to search for SBOM files | `["sbom.cdx.json", "sbom.spdx.json"]` |

### Modes

| Mode | Behavior |
|------|----------|
| `warn` | Log warnings but **do not** fail the workflow. Ideal for gradual adoption. |
| `fail` | Fail the workflow if compliance checks do not pass. |
| `enforce` | Strictly enforce all compliance rules. |

## Examples

### Strict enforcement

```yaml
mode: enforce
require_sbom: true
require_provenance: true
sbom_paths:
  - sbom.cdx.json
```

### Warn-only (gradual adoption)

```yaml
mode: warn
require_sbom: true
require_provenance: false
sbom_paths:
  - sbom.cdx.json
  - sbom.spdx.json
```

### Using the output

```yaml
- name: Run Evidence Gate
  id: gate
  uses: AlenKaleb/evidence-gate@v1

- name: Handle result
  if: steps.gate.outputs.result == 'fail'
  run: echo "Compliance check failed!"
```

## Contributing

Development happens in the [main repository](https://github.com/AlenKaleb/evidence-gate). Please open issues and pull requests there.

## License

[MIT](LICENSE)