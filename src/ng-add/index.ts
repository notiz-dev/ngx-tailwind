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
} from '@schematics/angular/utility/workspace';
import { InsertChange } from '@schematics/angular/utility/change';
import { Builders } from '@schematics/angular/utility/workspace-models';
import { WorkspaceDefinition } from '@angular-devkit/core/src/workspace';
import { getCliVersionAsNumber } from '../util/ng-cli-version';
import { hasTailwindSupport } from '../util/has-tailwind-support';

const NGX_BUILD_PLUS_BUILDER_TARGET = 'ngx-build-plus:browser';
const NGX_BUILD_PLUS_DEV_BUILDER_TARGET = 'ngx-build-plus:dev-server';
const NGX_BUILD_PLUS_KARMA_BUILDER_TARGET = 'ngx-build-plus:karma';

export function ngAdd(_options: Schema): Rule {
  return async (host: Tree) => {
    const workspace = await getWorkspace(host);
    const project = getProjectFromWorkspace(workspace, _options.project);

    const projectName = _options.project || Object.keys(workspace.projects)[0];

    if (!project) {
      throw new SchematicsException(
        `Project ${projectName} is not defined in this workspace.`,
      );
    }

    // FIXME project.projectType not available anymore with angular 11
    // if (project.projectType !== 'application') {
    //   throw new SchematicsException(
    //     `ngx-tailwind requires a project type of "application" but ${projectName} isn't.`,
    //   );
    // }

    const tailwindPlugins = _options.tailwindPlugins || [];
    const tailwindPluginDependencies = tailwindPlugins?.map(
      (plugin) => `@tailwindcss/${plugin}`,
    );
    const requireTailwindPlugins = tailwindPluginDependencies.map(
      (plugin) => `require('${plugin}')\n`,
    );

    const cliVersion = getCliVersionAsNumber(host);

    if (hasTailwindSupport(host)) {
      return chain([
        addDependenciesWithTailwindSupport(_options),
        addTailwindPlugins(tailwindPluginDependencies),
        addNpmScripts(_options, cliVersion),
        updateStyles(_options, workspace),
        generateTailwindConfig(_options, requireTailwindPlugins),
        install(),
      ]);
    } else {
      return chain([
        addDependenciesBeforeTailwindSupport(_options),
        addTailwindPlugins(tailwindPluginDependencies),
        addNpmScripts(_options, cliVersion),
        updateStyles(_options, workspace),
        generateTailwindAndWebpackConfig(_options, requireTailwindPlugins),
        updateAngularJSON(_options, workspace),
        install(),
      ]);
    }
  };
}

function addDependenciesWithTailwindSupport(_options: Schema): Rule {
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

    if (!_options.disableCrossPlatform) {
      addPackageJsonDependency(host, {
        type: NodeDependencyType.Dev,
        name: 'cross-env',
        version: _options.crossEnvVersion,
      });
    }
  };
}
function addDependenciesBeforeTailwindSupport(_options: Schema): Rule {
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

    if (!_options.disableCrossPlatform) {
      addPackageJsonDependency(host, {
        type: NodeDependencyType.Dev,
        name: 'cross-env',
        version: _options.crossEnvVersion,
      });
    }
  };
}

function addTailwindPlugins(tailwindPlugins: string[]): Rule {
  return (tree: Tree) => {
    tailwindPlugins.forEach((plugin) =>
      addPackageJsonDependency(tree, {
        type: NodeDependencyType.Dev,
        name: plugin,
        version: 'latest',
      }),
    );
  };
}

function updateStyles(options: Schema, workspace: WorkspaceDefinition): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const project = getProjectFromWorkspace(workspace, options.project);
    const stylePath = getProjectStyleFile(project, options.cssFormat);

    if (!stylePath) {
      context.logger.error(
        `Cannot update project styles file: Style path not found`,
      );
      return tree;
    }

    const insertion = new InsertChange(
      stylePath!,
      0,
      options.cssFormat === 'css'
        ? getTailwindDirectives()
        : getTailwindImports(),
    );
    const recorder = tree.beginUpdate(stylePath!);
    recorder.insertLeft(0, insertion.toAdd);
    tree.commitUpdate(recorder);

    return tree;
  };
}

/**
 * Used for css stylesheets
 */
function getTailwindDirectives(): string {
  return `@tailwind base;\n
@tailwind components;\n
@tailwind utilities;\n`;
}

/**
 * Used for scss stylesheets
 */
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
function generateTailwindConfig(
  options: Schema,
  requireTailwindPlugins: string[],
): Rule {
  return async (_host: Tree) => {
    const sourceTemplates = url(`./templates/tailwind`);
    const sourceParametrizedTemplates = apply(sourceTemplates, [
      template({
        ...options,
        requireTailwindPlugins: requireTailwindPlugins,
        ...strings,
      }),
    ]);
    return mergeWith(sourceParametrizedTemplates);
  };
}
/**
 * Generate webpack and tailwind config.
 *
 * @param options
 */
function generateTailwindAndWebpackConfig(
  options: Schema,
  requireTailwindPlugins: string[],
): Rule {
  return async (_host: Tree) => {
    const sourceTemplates = url(`./templates/configs`);
    const sourceParametrizedTemplates = apply(sourceTemplates, [
      template({
        ...options,
        requireTailwindPlugins: requireTailwindPlugins,
        ...strings,
      }),
    ]);
    return mergeWith(sourceParametrizedTemplates);
  };
}

function updateAngularJSON(
  options: Schema,
  workspace: WorkspaceDefinition,
): Rule {
  return (tree: Tree, context: SchematicContext) => {
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

function addNpmScripts(_options: Schema, cliVersion: number): Rule {
  return (tree: Tree) => {
    const pkgPath = 'package.json';
    const buffer = tree.read(pkgPath);

    if (buffer === null) {
      throw new SchematicsException('Could not find package.json');
    }

    const pkg = JSON.parse(buffer.toString());
    let prodFlag = '--prod';
    if (cliVersion >= 12) {
      prodFlag = '--configuration production';
    }

    if (_options.disableCrossPlatform) {
      pkg.scripts['build:prod'] = `NODE_ENV=production ng build ${prodFlag}`;
    } else {
      pkg.scripts[
        'build:prod'
      ] = `cross-env NODE_ENV=production ng build ${prodFlag}`;
    }

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
