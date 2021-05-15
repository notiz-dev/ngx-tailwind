import { Tree } from '@angular-devkit/schematics';
import { getCliVersion } from './ng-cli-version';

export function hasTailwindSupport(tree: Tree): boolean {
  return Number(getCliVersion(tree, false)) >= 11.2;
}
