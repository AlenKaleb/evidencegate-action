# Evidence Gate

[![GitHub Marketplace](https://img.shields.io/badge/Marketplace-Evidence%20Gate-blue?logo=github)](https://github.com/marketplace/actions/evidence-gate)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A GitHub Action for **compliance gating** with SBOM (Software Bill of Materials) and provenance verification. Validate your software supply chain artifacts before releasing.

## Features

- **SBOM Validation** — Verify the presence and format of SBOM files (CycloneDX and SPDX supported)
- **Provenance Checks** — Validate provenance attestations for your builds
- **Flexible Modes** — Choose between `warn` and `fail` to match your adoption stage
- **GitHub Integration** — Native check annotations, job summaries, and PR comments
- **Evidence Pack** — Generate an HTML report with all compliance evidence

## Quick Start

### 1. Add the configuration file

Create `.compliance-gate.yml` in the root of your repository:

```yaml
mode: warn                # warn | fail
sbom:
  paths:
    - "out/sbom.cdx.json"
    - "out/sbom.spdx.json"
provenance:
  require: false
  path: "out/provenance.json"
ux:
  pr_comment: true
  annotations: true
  max_annotations: 20
evidence_pack:
  enabled: true
  output_path: "out/evidence-pack.html"
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

### `mode`

| Value | Behavior |
|-------|----------|
| `warn` | Log warnings but **do not** fail the workflow. Ideal for gradual adoption. |
| `fail` | Fail the workflow if compliance checks do not pass. |

### `sbom`

| Option | Description | Default |
|--------|-------------|----------|
| `sbom.paths` | Paths to search for SBOM files (CycloneDX / SPDX) | `["out/sbom.cdx.json", "out/sbom.spdx.json"]` |

### `provenance`

| Option | Description | Default |
|--------|-------------|----------|
| `provenance.require` | Whether to require provenance attestations | `false` |
| `provenance.path` | Path to the provenance attestation file | `"out/provenance.json"` |

### `ux`

| Option | Description | Default |
|--------|-------------|----------|
| `ux.pr_comment` | Post a compliance summary as a PR comment | `true` |
| `ux.annotations` | Add inline annotations to changed files | `true` |
| `ux.max_annotations` | Maximum number of annotations per run | `20` |

### `evidence_pack`

| Option | Description | Default |
|--------|-------------|----------|
| `evidence_pack.enabled` | Generate an HTML evidence pack report | `true` |
| `evidence_pack.output_path` | Output path for the evidence pack | `"out/evidence-pack.html"` |

## Examples

### Strict enforcement

```yaml
mode: fail
sbom:
  paths:
    - "out/sbom.cdx.json"
provenance:
  require: true
  path: "out/provenance.json"
ux:
  pr_comment: true
  annotations: true
  max_annotations: 20
evidence_pack:
  enabled: true
  output_path: "out/evidence-pack.html"
```

### Warn-only (gradual adoption)

```yaml
mode: warn
sbom:
  paths:
    - "out/sbom.cdx.json"
    - "out/sbom.spdx.json"
provenance:
  require: false
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