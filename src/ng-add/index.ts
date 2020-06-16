import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  SchematicsException
} from "@angular-devkit/schematics";

import { Schema } from "./schema";
import { NodePackageInstallTask } from "@angular-devkit/schematics/tasks";
import {
  addPackageJsonDependency,
  NodeDependencyType,
} from "@schematics/angular/utility/dependencies";
import { getWorkspace } from "@schematics/angular/utility/workspace";
import { exec } from "child_process";
import { promisify } from "util";
import { ProjectDefinition } from "@angular-devkit/core/src/workspace";
const asyncExec = promisify(exec);

export function ngAdd(_options: Schema): Rule {
  return async (host: Tree) => {
    const workspace = await getWorkspace(host);
    const projectName =
      _options.project || Array.from(workspace.projects)[0][0];
    if (!projectName) {
      throw new SchematicsException('Option "project" is required.');
    }

    const project = workspace.projects.get(projectName);

    if (!project) {
      throw new SchematicsException(
        `Project ${projectName} is not defined in this workspace.`
      );
    }

    if (project.extensions["projectType"] !== "application") {
      throw new SchematicsException(
        `@angular/elements requires a project type of "application" but ${projectName} isn't.`
      );
    }
    return chain([
      addDependencies(),
      updateStyles(project),
      addWebpackConfig(project),
      updateAngularJSON(projectName),
      install(),
      initTailwind(project),
    ]);
  };
}
function addDependencies(): Rule {
  return (host: Tree) => {
    addPackageJsonDependency(host, {
      type: NodeDependencyType.Dev,
      name: "tailwindcss",
      version: "latest",
    });
    addPackageJsonDependency(host, {
      type: NodeDependencyType.Dev,
      name: "postcss-scss",
      version: "latest",
    });

    addPackageJsonDependency(host, {
      type: NodeDependencyType.Dev,
      name: "postcss-import",
      version: "latest",
    });

    addPackageJsonDependency(host, {
      type: NodeDependencyType.Dev,
      name: "postcss-loader",
      version: "latest",
    });

    addPackageJsonDependency(host, {
      type: NodeDependencyType.Dev,
      name: "@angular-builders/custom-webpack",
      version: "latest",
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
@import 'tailwindcss/utilities'; \n`
    );
    host.commitUpdate(recorder);
  };
}

function initTailwind(project: ProjectDefinition): Rule {
  return async () => {
    try {
      await asyncExec(`npx tailwindcss init --full`, { cwd: project.root });
    } catch (e) {
      console.error(e);
    }
  };
}

function addWebpackConfig(project: ProjectDefinition): Rule {
  return async (host: Tree) => {
    host.create(
      project.root + "/webpack.config.js",
      `module.exports = {
  module: {
      rules: [
          {
              test: /\.scss$/,
              loader: 'postcss-loader',
              options: {
                  ident: 'postcss',
                  syntax: 'postcss-scss',
                  plugins: () => [
                      require('postcss-import'),
                      require('tailwindcss'),
                      require('autoprefixer'),
                  ]
              }
          }
      ]
  }
};`
    );
  };
}

function updateAngularJSON(project: string): Rule {
  return async (host: Tree) => {
    const angularConfig = host.read("/angular.json")?.toString();
    if (angularConfig) {
      const json = JSON.parse(angularConfig);
      json.projects[project].architect.build.builder =
        "@angular-builders/custom-webpack:browser";
      json.projects[project].architect.build.options = {
        ...json.projects[project].architect.build.options,
        customWebpackConfig: { path: "./webpack.config.js" },
      };
      json.projects[project].architect.serve.builder =
        "@angular-builders/custom-webpack:dev-server";
      json.projects[project].architect.serve.options = {
        ...json.projects[project].architect.serve.options,
        customWebpackConfig: { path: "./webpack.config.js" },
      };

      host.overwrite("/angular.json", JSON.stringify(json, null, 2));
    }
  };
}

function install(): Rule {
  return async (_host: Tree, context: SchematicContext) => {
    // Install the dependency
    context.addTask(new NodePackageInstallTask());
  };
}
