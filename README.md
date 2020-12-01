# Tailwind CSS Schematics

[![npm version](https://badge.fury.io/js/ngx-tailwind.svg)](https://www.npmjs.com/package/ngx-tailwind)
![Schematics CI](https://github.com/notiz-dev/ngx-tailwind/workflows/Node.js%20CI/badge.svg)

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
Installing packages for tooling via npm.
Installed packages for tooling via npm.
? Which stylesheet format are you using? CSS
CREATE webpack.config.js (428 bytes)
UPDATE package.json (1498 bytes)
UPDATE src/styles.scss (177 bytes)
UPDATE angular.json (3848 bytes)
✔ Packages installed successfully.
✔ Packages installed successfully.
    Initialized Tailwind
```

## Migrate from Tailwind CSS v1 to v2

To upgrade you project from [Tailwind CSS v1.x to v2.0](https://tailwindcss.com/docs/upgrading-to-v2) run the following install command

```bash
npm i -D tailwindcss@latest autoprefixer@latest postcss@latest postcss-import@latest postcss-loader@latest

# using scss
npm i -D postcss-scss@latest
```

Read the full [Upgrade Guide](https://tailwindcss.com/docs/upgrading-to-v2) to update your custom `tailwind.config.js` (e.g. [your color palette](https://tailwindcss.com/docs/upgrading-to-v2#configure-your-color-palette-explicitly)) and replace removed classes from your template (e.g. [shadow-outline and shadow-xs](https://tailwindcss.com/docs/upgrading-to-v2#replace-shadow-outline-and-shadow-xs-with-ring-utilities)).

## Additional options

You can pass additional flags to customize the schematic. For example, if you want to install a different version for **Tailwind** use `--tailwindVersion` flag:

```bash
ng add ngx-tailwind --tailwindVersion 1.9.5
```

All available flags:

| Flag                    |  Description                                               | Type             |  Default                  |
| ----------------------- | ---------------------------------------------------------- | ---------------- | ------------------------- |
|  `autoprefixerVersion`  | The autoprefixer version to be installed.                  | string           | `^10.0.2`                 |
|  `cssFormat`            | The file extension or preprocessor to use for style files. | `css` \|  `scss` | `css`                     |
|  `ngxBuildPlusVersion`  | The ngx-build-plus version to be installed.                | `string`         | `^10.1.1`                 |
|  `project`              | The project to initialize with Tailwind CSS.               | `string`         | **First** Angular project |
|  `postcssVersion`       | The postcss version to be installed.                       | `string`         | `^8.1.7`                  |
|  `postcssImportVersion` | The postcss-import version to be installed.                | `string`         | `^13.0.0`                 |
|  `postcssLoaderVersion` | The postcss-loader version to be installed.                | `string`         | `^4.0.4`                  |
|  `postcssScssVersion`   | The postcss-scss version to be installed.                  | `string`         | `^3.0.4`                  |
|  `skipTailwindInit`     | Skip initializing Tailwind.                                | `boolean`        | `false`                   |
|  `tailwindVersion`      | The Tailwind version to be installed.                      | `string`         | `^2.0.1`                  |

Advanced usage

```bash
ng add ngx-tailwind --cssFormat scss --tailwindVersion 2.0.0 --ngxBuildPlusVersion 10.1.1 --postcssVersion 8.0.0 --postcssImportVersion 13.0.0 --postcssLoaderVersion 4.0.4 --postcssScssVersion 3.0.4
```

Want to integrate Tailwind CSS in version 1.x.x? No problem:

```bash
ng add ngx-tailwind --tailwindVersion 1.9.6 --ngxBuildPlusVersion 10.1.1 --postcssVersion 7.0.35 --postcssImportVersion 12.0.1 --postcssLoaderVersion 4.0.4 --postcssScssVersion 3.0.4
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
