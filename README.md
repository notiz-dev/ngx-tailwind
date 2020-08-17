# Add Tailwind CSS to your Angular project

Simple [Angular](https://angular.io/) schematic that initializes [Tailwind CSS](https://tailwindcss.com/) in your project and adds a custom webpack config to your build process.

## Installation

Run

`ng add @garygrossgarten/ngx-tailwind`

or optionally

`ng add @garygrossgarten/ngx-tailwind --project <MY_PROJECT>`

## Additional options

You can pass additional flags to customize the schematic. For example, if you want to install a different version for **Tailwind** use `--tailwindVersion` flag:

```bash
ng add @garygrossgarten/ngx-tailwind --tailwindVersion 1.6.2
```

All available flags:

| Flag                |  Description                                 | Type      |  Default                  |
| ------------------- | -------------------------------------------- | --------- | ------------------------- |
|  `project`          | The project to initialize with Tailwind CSS. | `string`  | **First** Angular project |
|  `skipTailwindInit` | Skip initializing Tailwind.                  | `boolean` | `false`                   |
|  `tailwindVersion`  | The Tailwind version to be installed.        | `string`  | `latest`                  |

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
