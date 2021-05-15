import { SchematicsException, Tree } from '@angular-devkit/schematics';

export function getCliVersion(tree: Tree, withPatch = false): string {
  try {
    const cliPackageJsonBuffer = tree.read(
      './node_modules/@angular/cli/package.json',
    );

    if (cliPackageJsonBuffer == null) {
      return '';
    }

    const packageJson = JSON.parse(cliPackageJsonBuffer.toString());
    const currentCliVersion = packageJson['version'] as string;
    if (withPatch) {
      return currentCliVersion;
    } else {
      return currentCliVersion.substring(0, currentCliVersion.lastIndexOf('.'));
    }
  } catch (e) {
    throw new SchematicsException(
      'Could not identify @angular/cli version. Make sure you have @angular/cli installed.',
    );
  }
}

export function getCliVersionAsNumber(tree: Tree): number {
  return Number(getCliVersion(tree, false));
}
