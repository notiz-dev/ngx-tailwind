# Tailwind CSS Schematics

[![npm version](https://badge.fury.io/js/ngx-tailwind.svg)](https://www.npmjs.com/package/ngx-tailwind)
![Schematics CI](https://github.com/notiz-dev/ngx-tailwind/workflows/Node.js%20CI/badge.svg)

Simple [Angular](https://angular.io/) schematic initializing [Tailwind CSS](https://tailwindcss.com/) in your project. [Angular v11.2](https://twitter.com/angular/status/1359736376581840896) includes native support for Tailwind CSS.

For all versions **before** Angular v11.2 a custom webpack config is added to your build process.

## Installation

Run

```bash
ng add ngx-tailwind

# or

ng add ngx-tailwind --project <MY_PROJECT>
```

Example output

```bash
The package ngx-tailwind@dev will be installed and executed.
Would you like to proceed? Yes
✔ Package successfully installed.
? Which stylesheet format are you using? SCSS [ https://sass-lang.com/documentation/syntax#scss ]
? Which @tailwindcss plugins do you want to install? typography
CREATE tailwind.config.js (236 bytes)
UPDATE package.json (1095 bytes)
UPDATE src/styles.scss (177 bytes)
✔ Packages installed successfully.
```

## Upgrade Guide

### Tailwind CSS v2 to v3

To upgrade your project from [Tailwind CSS v2 to v3](https://tailwindcss.com/docs/upgrade-guide).

```bash
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
```

Update your `tailwind.config.js` to the new [JIT Engine](https://tailwindcss.com/docs/upgrade-guide#migrating-to-the-jit-engine).

```diff
module.exports = {
- // mode: 'jit',
- purge: ['./src/**/*.{html,ts}'],
+ content: ['./src/**/*.{html,ts}'],
- darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
- variants: {
-   extend: {},
- },
  plugins: [],
};
```

## Migrate from Tailwind CSS

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
ng add ngx-tailwind --tailwindVersion 3.0.8
```

All available flags:

| Flag                   | Description                                                    | Type            | Default                                               |
| ---------------------- | -------------------------------------------------------------- | --------------- | ----------------------------------------------------- |
| `autoprefixerVersion`  | The autoprefixer version to be installed.                      | string          | `^10.4.1`                                             |
| `cssFormat`            | The file extension or preprocessor to use for style files.     | `css` \| `scss` | `css`                                                 |‚
| `project`              | The project to initialize with Tailwind CSS.                   | `string`        | **First** Angular project                             |
| `postcssVersion`       | The postcss version to be installed.                           | `string`        | `^8.4.5`                                              |
| `skipTailwindInit`     | Skip initializing Tailwind.                                    | `boolean`       | `false`                                               |
| `tailwindVersion`      | The Tailwind version to be installed.                          | `string`        | `^3.0.8`                                              |
| `disableCrossPlatform` | Set the build:prod script to be only UNIX compatible.          | `boolean`       | `false`                                               |
| `crossEnvVersion`      | The cross-env version to be installed.                         | `string`        | `^7.0.3`                                              |
| `tailwindPlugins`      | @tailwindcss plugins installed and added to tailwind.config.js | `string[]`      | [`aspect-ratio`, `forms`, `line-clamp`, `typography`] |

Advanced usage

```bash
ng add ngx-tailwind --cssFormat scss --tailwindVersion 3.0.8 --postcssVersion 8.4.5
```

Want to integrate Tailwind CSS with Angular 11.1 or lower? No problem:

```bash
ng add ngx-tailwind@2.3.0
```

By default, `cross-env` is added to the `build:prod` script to be able to set `NODE_ENV=prod` cross-platform.
If you want to override the default behavior, you can set the flag `--disableCrossPlatform`:

```bash
ng add ngx-tailwind --disableCrossPlatform
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
