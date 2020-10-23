# Add Tailwind CSS to your Angular project

[![npm version](https://badge.fury.io/js/ngx-tailwind.svg)](https://www.npmjs.com/package/ngx-tailwind)

Simple [Angular](https://angular.io/) schematic initializing [Tailwind CSS](https://tailwindcss.com/) in your project and adds a custom webpack config to your build process.

## Installation

Run

```bash
ng add ngx-tailwind

# or

ng add ngx-tailwind --project <MY_PROJECT>
```

Example output

```bash
CREATE webpack.config.js (428 bytes)
UPDATE package.json (1458 bytes)
UPDATE src/styles.scss (272 bytes)
UPDATE angular.json (3828 bytes)
✔ Packages installed successfully.
✔ Packages installed successfully.
    Initialized Tailwind
```

> **Note** `postcss-import` in version `13.0.0` breaks currently the build, thus it is pinned to `12.0.1`.

## Additional options

You can pass additional flags to customize the schematic. For example, if you want to install a different version for **Tailwind** use `--tailwindVersion` flag:

```bash
ng add ngx-tailwind --tailwindVersion 1.9.5
```

All available flags:

| Flag                    |  Description                                               | Type      |  Default                  |
| ----------------------- | ---------------------------------------------------------- | --------- | ------------------------- |
|  `cssFormat`            | The file extension or preprocessor to use for style files. | `css`     |  `scss`                   | `css` |
|  `ngxBuildPlusVersion`  | The ngx-build-plus version to be installed.                | `string`  | `latest`                  |
|  `project`              | The project to initialize with Tailwind CSS.               | `string`  | **First** Angular project |
|  `postcssImportVersion` | The postcss-import version to be installed.                | `string`  | `12.0.1`                  |
|  `postcssLoaderVersion` | The postcss-loader version to be installed.                | `string`  | `latest`                  |
|  `postcssScssVersion`   | The postcss-scss version to be installed.                  | `string`  | `latest`                  |
|  `skipTailwindInit`     | Skip initializing Tailwind.                                | `boolean` | `false`                   |
|  `tailwindVersion`      | The Tailwind version to be installed.                      | `string`  | `latest`                  |

Advanced usage

```bash
ng add ngx-tailwind --cssFormat scss --tailwindVersion 1.9.5 --ngxBuildPlusVersion 10.1.1 --postcssImportVersion 12.0.1 --postcssLoaderVersion 4.0.4 --postcssScssVersion 3.0.2
```

## Developing

Install `@angular-devkit/schematics-cli` to be able to use `schematics` command

```bash
npm i -g @angular-devkit/schematics-cli
```

Now build the schematics and run the schematic.

```bash
npm run build
# or
npm run build:watch

# dry-run in angular-workspace
npm run start:dev

# execute schematics in angular-workspace
npm run start
```
