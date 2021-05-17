# poetry-badges

[![Run tests](https://github.com/action-badges/poetry-badges/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/action-badges/poetry-badges/actions/workflows/test.yml)
[![Build Dist](https://github.com/action-badges/poetry-badges/actions/workflows/build-dist.yml/badge.svg?branch=main)](https://github.com/action-badges/poetry-badges/actions/workflows/build-dist.yml)

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
