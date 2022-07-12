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
} from '@angular/cdk/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  addPackageJsonDependency,
  NodeDependencyType,
} from '@schematics/angular/utility/dependencies';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { InsertChange } from '@schematics/angular/utility/change';
import { WorkspaceDefinition } from '@angular-devkit/core/src/workspace';
import { hasTailwindSupport } from '../util/has-tailwind-support';

export function ngAdd(_options: Schema): Rule {
  return async (host: Tree) => {
    const workspace = await getWorkspace(host);

    if (!_options.project) {
      _options.project = workspace.projects.keys().next().value;
    }

    if (!_options.project) {
      throw new SchematicsException(
        `Project ${_options.project} is not defined in this workspace.`,
      );
    }

    const tailwindPlugins = _options.tailwindPlugins || [];
    const tailwindPluginDependencies = tailwindPlugins?.map(
      (plugin) => `@tailwindcss/${plugin}`,
    );
    const requireTailwindPlugins = tailwindPluginDependencies.map(
      (plugin) => `require('${plugin}')\n`,
    );

    if (hasTailwindSupport(host)) {
      return chain([
        addDependenciesWithTailwindSupport(_options),
        addTailwindPlugins(tailwindPluginDependencies),
        updateStyles(_options, workspace),
        generateTailwindConfig(_options, requireTailwindPlugins),
        install(),
      ]);
    } else {
      throw new SchematicsException(
        'Current version only supports Angular 11.2 or higher. Use previous version for Angular 11.1 or lower: ng add ngx-tailwind@2.3.0',
      );
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

function install(): Rule {
  return async (_host: Tree, context: SchematicContext) => {
    // Install the dependency
    context.addTask(new NodePackageInstallTask());
  };
}
