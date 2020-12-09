import { strings } from '@angular-devkit/core';
import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  SchematicsException,
  url,
  apply,
  mergeWith,
  template,
} from '@angular-devkit/schematics';
import { Schema } from './schema';
import {
  getProjectFromWorkspace,
  getProjectStyleFile,
  getTargetsByBuilderName,
} from '@angular/cdk/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  addPackageJsonDependency,
  NodeDependencyType,
} from '@schematics/angular/utility/dependencies';
import {
  getWorkspace,
  updateWorkspace,
} from '@schematics/angular/utility/config';
import { InsertChange } from '@schematics/angular/utility/change';
import { Builders } from '@schematics/angular/utility/workspace-models';

const NGX_BUILD_PLUS_BUILDER_TARGET = 'ngx-build-plus:browser';
const NGX_BUILD_PLUS_DEV_BUILDER_TARGET = 'ngx-build-plus:dev-server';
const NGX_BUILD_PLUS_KARMA_BUILDER_TARGET = 'ngx-build-plus:karma';

export function ngAdd(_options: Schema): Rule {
  return async (host: Tree) => {
    const workspace = getWorkspace(host);
    const project = getProjectFromWorkspace(workspace, _options.project);

    const projectName = _options.project || Object.keys(workspace.projects)[0];

    if (!project) {
      throw new SchematicsException(
        `Project ${projectName} is not defined in this workspace.`,
      );
    }

    if (project.projectType !== 'application') {
      throw new SchematicsException(
        `ngx-tailwind requires a project type of "application" but ${projectName} isn't.`,
      );
    }

    return chain([
      addDependencies(_options),
      addNpmScripts(_options),
      updateStyles(_options),
      generateConfigs(_options),
      updateAngularJSON(_options),
      install(),
    ]);
  };
}

function addDependencies(_options: Schema): Rule {
  return (host: Tree) => {
    addPackageJsonDependency(host, {
      type: NodeDependencyType.Dev,
      name: 'tailwindcss',
      version: _options.tailwindVersion,
    });

    addPackageJsonDependency(host, {
      type: NodeDependencyType.Dev,
      name: 'autoprefixer',
      version: _options.autoprefixerVersion,
    });

    addPackageJsonDependency(host, {
      type: NodeDependencyType.Dev,
      name: 'postcss',
      version: _options.postcssVersion,
    });

    if (_options.cssFormat === 'scss') {
      addPackageJsonDependency(host, {
        type: NodeDependencyType.Dev,
        name: 'postcss-scss',
        version: _options.postcssScssVersion,
      });
    }

    addPackageJsonDependency(host, {
      type: NodeDependencyType.Dev,
      name: 'postcss-import',
      version: _options.postcssImportVersion,
    });

    addPackageJsonDependency(host, {
      type: NodeDependencyType.Dev,
      name: 'postcss-loader',
      version: _options.postcssLoaderVersion,
    });

    addPackageJsonDependency(host, {
      type: NodeDependencyType.Dev,
      name: 'ngx-build-plus',
      version: _options.ngxBuildPlusVersion,
    });
  };
}

function updateStyles(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const workspace = getWorkspace(tree);
    const project = getProjectFromWorkspace(workspace, options.project);
    const stylePath = getProjectStyleFile(project, options.cssFormat);

    if (!stylePath) {
      context.logger.error(
        `Cannot update project styles file: Style path not found`,
      );
      return tree;
    }

    const insertion = new InsertChange(stylePath!, 0, getTailwindImports());
    const recorder = tree.beginUpdate(stylePath!);
    recorder.insertLeft(0, insertion.toAdd);
    tree.commitUpdate(recorder);

    return tree;
  };
}

function getTailwindImports(): string {
  return `@import 'tailwindcss/base';\n
@import 'tailwindcss/components';\n
@import 'tailwindcss/utilities';\n`;
}

/**
 * Generate webpack and tailwind config.
 *
 * @param options
 */
function generateConfigs(options: Schema): Rule {
  return async (_host: Tree) => {
    const sourceTemplates = url(`./files`);
    const sourceParametrizedTemplates = apply(sourceTemplates, [
      template({ ...options, ...strings }),
    ]);
    return mergeWith(sourceParametrizedTemplates);
  };
}

function updateAngularJSON(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const workspace = getWorkspace(tree);
    const project = getProjectFromWorkspace(workspace, options.project);

    const browserTargets = getTargetsByBuilderName(project, Builders.Browser);
    const devServerTargets = getTargetsByBuilderName(
      project,
      Builders.DevServer,
    );
    const karmaServerTargets = getTargetsByBuilderName(project, Builders.Karma);

    browserTargets.forEach((browserTarget) => {
      browserTarget.builder = NGX_BUILD_PLUS_BUILDER_TARGET;
      browserTarget.options = {
        extraWebpackConfig: 'webpack.config.js',
        ...(browserTarget.options as any),
      };
    });
    devServerTargets.forEach((browserTarget) => {
      browserTarget.builder = NGX_BUILD_PLUS_DEV_BUILDER_TARGET;
      browserTarget.options = {
        extraWebpackConfig: 'webpack.config.js',
        ...(browserTarget.options as any),
      };
    });

    karmaServerTargets.forEach((browserTarget) => {
      browserTarget.builder = NGX_BUILD_PLUS_KARMA_BUILDER_TARGET;
      browserTarget.options = {
        extraWebpackConfig: 'webpack.config.js',
        ...(browserTarget.options as any),
      };
    });

    return updateWorkspace(workspace)(tree, context);
  };
}

function addNpmScripts(_options: Schema): Rule {
  return (tree: Tree) => {
    const pkgPath = 'package.json';
    const buffer = tree.read(pkgPath);

    if (buffer === null) {
      throw new SchematicsException('Could not find package.json');
    }

    const pkg = JSON.parse(buffer.toString());

    pkg.scripts['build:prod'] = 'NODE_ENV=production ng build --prod';

    tree.overwrite(pkgPath, JSON.stringify(pkg, null, 2));
    return tree;
  };
}

function install(): Rule {
  return async (_host: Tree, context: SchematicContext) => {
    // Install the dependency
    context.addTask(new NodePackageInstallTask());
  };
}
