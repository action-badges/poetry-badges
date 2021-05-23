# poetry-badges

Serverless badges from your Poetry `pyproject.toml` with Github Actions.

![build](https://raw.githubusercontent.com/action-badges/poetry-badges/badges/.badges/main/build-status.svg)
![coverage](https://raw.githubusercontent.com/action-badges/poetry-badges/badges/.badges/main/coverage.svg)
![license](https://raw.githubusercontent.com/action-badges/poetry-badges/badges/.badges/main/package-license.svg)
![node](https://raw.githubusercontent.com/action-badges/poetry-badges/badges/.badges/main/package-node-version.svg)

```yaml
name: Make Poetry Badges
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Make version Badge
        uses: action-badges/poetry-badges@master
        with:
          file-name: poetry-version.svg
          github-token: '${{ secrets.GITHUB_TOKEN }}'
          integration: version

      - name: Make license badge
        uses: action-badges/poetry-badges@master
        with:
          file-name: poetry-license.svg
          github-token: '${{ secrets.GITHUB_TOKEN }}'
          integration: license

      - name: Make django version badge
        uses: action-badges/poetry-badges@master
        with:
          file-name: poetry-django-version.svg
          github-token: '${{ secrets.GITHUB_TOKEN }}'
          integration: dependency-version
          dependency-type: dependencies
          dependency: Django
```

All of the standard action-badges [parameters](https://github.com/action-badges/core/blob/main/docs/github-action.md#parameters) can also be used.

