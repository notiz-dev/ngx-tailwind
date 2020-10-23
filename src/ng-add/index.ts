import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  SchematicsException,
  url,
  apply,
  mergeWith,
} from '@angular-devkit/schematics';
import { Schema } from './schema';
import {
  NodePackageInstallTask,
  RunSchematicTask,
} from '@angular-devkit/schematics/tasks';
import {
  addPackageJsonDependency,
  NodeDependencyType,
} from '@schematics/angular/utility/dependencies';
import { getWorkspace } from '@schematics/angular/utility/workspace';
import { ProjectDefinition } from '@angular-devkit/core/src/workspace';

export function ngAdd(_options: Schema): Rule {
  return async (host: Tree) => {
    const workspace = await getWorkspace(host);
    const projectName =
      _options.project || Array.from(workspace.projects)[0][0];
    if (!projectName) {
      throw new SchematicsException('Option "project" is required.');
    }
    console.log('project name', projectName);

    const project = workspace.projects.get(projectName);

    if (!project) {
      throw new SchematicsException(
        `Project ${projectName} is not defined in this workspace.`,
      );
    }

    if (project.extensions['projectType'] !== 'application') {
      throw new SchematicsException(
        `@angular/elements requires a project type of "application" but ${projectName} isn't.`,
      );
    }
    return chain([
      addDependencies(_options),
      updateStyles(project),
      addWebpackConfig(),
      updateAngularJSON(projectName),
      install(),
      tailwindInit(_options),
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
      name: 'postcss-scss',
      version: _options.postcssScssVersion,
    });

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

function updateStyles(project: ProjectDefinition): Rule {
  return async (host: Tree) => {
    const path = `${project.sourceRoot}/styles.scss`;
    const recorder = host.beginUpdate(path);
    recorder.insertLeft(
      0,
      `@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities'; \n`,
    );
    host.commitUpdate(recorder);
  };
}

function tailwindInit(_options: Schema): Rule {
  return (_tree: Tree, context: SchematicContext) => {
    if (!_options.skipTailwindInit) {
      const packageInstall = context.addTask(new NodePackageInstallTask());
      context.addTask(new RunSchematicTask('tailwind-init', {}), [
        packageInstall,
      ]);
    }
    return _tree;
  };
}

function addWebpackConfig(): Rule {
  return async (_host: Tree) => {
    const sourceTemplates = url('./templates/webpack');
    const sourceParametrizedTemplates = apply(sourceTemplates, []);
    return mergeWith(sourceParametrizedTemplates);
  };
}

function updateAngularJSON(project: string): Rule {
  return async (host: Tree) => {
    const angularConfig = host.read('/angular.json')?.toString();
    if (angularConfig) {
      const json = JSON.parse(angularConfig);
      json.projects[project].architect.build.builder = 'ngx-build-plus:browser';
      json.projects[project].architect.build.options = {
        ...json.projects[project].architect.build.options,
        extraWebpackConfig: './webpack.config.js',
      };
      json.projects[project].architect.serve.builder =
        'ngx-build-plus:dev-server';
      json.projects[project].architect.serve.options = {
        ...json.projects[project].architect.serve.options,
        extraWebpackConfig: './webpack.config.js',
      };

      host.overwrite('/angular.json', JSON.stringify(json, null, 2));
    }
  };
}

function install(): Rule {
  return async (_host: Tree, context: SchematicContext) => {
    // Install the dependency
    context.addTask(new NodePackageInstallTask());
  };
}
