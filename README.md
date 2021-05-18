# I. Project Setup
``` bash
# install dependencies
yarn install

# serve with hot reload at localhost:8080
yarn start

# build for production with minification
yarn build

# run unit tests
yarn test:unit

# run e2e tests
yarn test:e2e

# run all tests
yarn test
```


# II. Pre-Commit Hook
MACOS, LINUX

## Installation
```
$ brew install pre-commit
```

<code>pre-commit --version</code> should show you what version you're using:
```
$ pre-commit --version
pre-commit 2.11.1
```
## Configure
Copy configuration file <code>.pre-commit-config.yaml</code> at:
```
https://github.com/GumiViet/gumiviet.github.io/blob/master/assets/.pre-commit-config.yaml
```
Put <code>.pre-commit-config.yaml</code> into **root** directory

## Install the git hook scripts
```
$ pre-commit install

pre-commit installed at .git/hooks/pre-commit
```
## Run against all the files (optional)
it's usually a good idea to run the hooks against all of the files when adding new hooks
(usually pre-commit will only run on the changed files during git hooks)

```
$ pre-commit run --all-files

[INFO] Initializing environment for https://github.com/pre-commit/pre-commit-hooks.
[INFO] Initializing environment for https://github.com/psf/black.
[INFO] Installing environment for https://github.com/pre-commit/pre-commit-hooks.
[INFO] Once installed this environment will be reused.
[INFO] This may take a few minutes...
[INFO] Installing environment for https://github.com/psf/black.
[INFO] Once installed this environment will be reused.
[INFO] This may take a few minutes...
Check Yaml...............................................................Passed
Fix End of Files.........................................................Passed
Trim Trailing Whitespace.................................................Failed
- hook id: trailing-whitespace
- exit code: 1

Files were modified by this hook. Additional output:

Fixing sample.py

black....................................................................Passed
```

# II. Commit Lint
## Installation
```
$ npm install -g @commitlint/cli
$ npm install --save-dev @commitlint/{cli,config-conventional}
```

## Configure

```
$ cd /project-name
```
At project **root** directory:
```
$ touch commitlint.config.js

$ echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js

$ pre-commit install --hook-type commit-msg
```

## Test
```
# Lint from stdin
$ echo 'foo: bar' | commitlint

⧗   input: foo: bar
✖   type must be one of [build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test] [type-enum]

✖   found 1 problems, 0 warnings
ⓘ   Get help: https://github.com/conventional-changelog/commitlint/#what-is-commitlint
```
```
# Lint last commit from history
$ commitlint --from=HEAD~1
```
