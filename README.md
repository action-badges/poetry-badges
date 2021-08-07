# poetry-badges

Serverless badges from your Poetry `pyproject.toml` with Github Actions.

![build](https://raw.githubusercontent.com/action-badges/poetry-badges/badges/.badges/main/build-status.svg)
![coverage](https://raw.githubusercontent.com/action-badges/poetry-badges/badges/.badges/main/coverage.svg)
![tag](https://raw.githubusercontent.com/action-badges/poetry-badges/badges/.badges/github-tag.svg)
![license](https://raw.githubusercontent.com/action-badges/poetry-badges/badges/.badges/main/package-license.svg)
![node](https://raw.githubusercontent.com/action-badges/poetry-badges/badges/.badges/main/package-node-version.svg)

Examples:

```yaml
name: Make Poetry Badges
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: action-badges/create-orphan-branch@0.1.0
        with:
          branch-name: badges

      - name: Make version Badge
        uses: action-badges/poetry-badges@0.2.2
        with:
          file-name: poetry-version.svg
          badge-branch: badges
          github-token: '${{ secrets.GITHUB_TOKEN }}'
          integration: version

      - name: Make license badge
        uses: action-badges/poetry-badges@0.2.2
        with:
          file-name: poetry-license.svg
          badge-branch: badges
          github-token: '${{ secrets.GITHUB_TOKEN }}'
          integration: license

      - name: Make django version badge
        uses: action-badges/poetry-badges@0.2.2
        with:
          file-name: poetry-django-version.svg
          badge-branch: badges
          github-token: '${{ secrets.GITHUB_TOKEN }}'
          integration: dependency-version
          dependency-type: dependencies
          dependency: Django
```

All of the standard action-badges [parameters](https://github.com/action-badges/core/blob/main/docs/github-action.md#parameters) can also be used.

