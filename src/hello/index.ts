import {
  apply,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  SchematicsException,
  template,
  Tree,
  url,
  chain,
} from "@angular-devkit/schematics";
import { strings } from "@angular-devkit/core";

import { Schema as Options } from "./schema";
import { parseName } from "@schematics/angular/utility/parse-name";
import { Observable } from "rxjs";
import { Project, ScriptTarget, Type } from "ts-morph";

const clipboardy = require("clipboardy");

const {
  quicktype,
  InputData,
  jsonInputForTargetLanguage,
} = require("quicktype-core");

export function hello(_options: Options): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    console.log("Running schematics with following options", _options);

    const workspaceAsBuffer = tree.read("angular.json");

    if (!workspaceAsBuffer) {
      throw new SchematicsException(
        "We are not inside of Angular CLI workspace"
      );
    }

    const workspace = JSON.parse(workspaceAsBuffer.toString());

    const projectName = _options.project || workspace.defaultProject;

    const project = workspace.projects[projectName];

    const sourceRoot = project.sourceRoot;

    const projectType = project.projectType;

    const type = projectType === "application" ? "app" : "lib";

    const path = `${sourceRoot}/${type}/${_options.store}`;

    const parsed = parseName(path, _options.name);

    _options.name = parsed.name;

    const json = clipboardy.readSync();
    let jsonObject;
    try {
      jsonObject = JSON.parse(json);
    } catch (err) {
      console.error("Please copy the JSON Payload to your clipboard.");
    }
    tree.create(
      `${path}/${strings.dasherize(_options.name)}/${strings.dasherize(
        _options.name
      )}.payload.json`,
      json
    );

    const sourceTpl = url("./files");

    const rule = chain([
      generateTypes(
        _options,
        `${path}/${strings.dasherize(_options.name)}/${strings.dasherize(
          _options.name
        )}.types.ts`,
        json
      ),
      mergeWith(
        apply(sourceTpl, [
          template({
            ..._options,
            _options,
            ...strings,
            jsonObject,
          }),
          move(parsed.path),
        ])
      ),
    ]);

    return rule(tree, _context);
  };
}

export function generate(_options: Options): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    console.log("Running schematics with following options", _options);

    const workspaceAsBuffer = tree.read("angular.json");

    if (!workspaceAsBuffer) {
      throw new SchematicsException(
        "We are not inside of Angular CLI workspace"
      );
    }

    const workspace = JSON.parse(workspaceAsBuffer.toString());

    const projectName = _options.project || workspace.defaultProject;

    const project = workspace.projects[projectName];

    const sourceRoot = project.sourceRoot;

    const projectType = project.projectType;

    const type = projectType === "application" ? "app" : "lib";

    const path = `${sourceRoot}/${type}/${_options.store}`;

    const parsed = parseName(path, _options.name);

    _options.name = parsed.name;

    return generateFromAST(
      _options,
      `${path}/${strings.dasherize(_options.name)}/${strings.dasherize(
        _options.name
      )}.types.ts`
    );
  };
}

async function quicktypeJSON(
  targetLanguage: string,
  typeName: string,
  jsonString: string
): Promise<string> {
  const jsonInput = jsonInputForTargetLanguage(targetLanguage);
  await jsonInput.addSource({
    name: typeName,
    samples: [jsonString],
  });

  const inputData = new InputData();
  inputData.addInput(jsonInput);
  const { lines: types } = await quicktype({
    inputData,
    lang: targetLanguage,
    rendererOptions: {
      "just-types": true,
      "runtime-typecheck": false,
    },
  });
  return types.join("\n");
}

function generateTypes(options: Options, path: string, json: string): Rule {
  return (host: Tree) => {
    const observer = new Observable<Tree>((observer) => {
      quicktypeJSON("ts", `${strings.classify(options.name)}StateModel`, json)
        .then((res) => host.create(path, res))
        .then(() => {
          observer.next(host);
          observer.complete();
        })
        .catch(function (err: any) {
          observer.error(err);
        });
    });
    return observer;
  };
}

function generateFromAST(options: Options, path: string): Rule {
  return (host: Tree) => {
    const project = new Project({
      compilerOptions: {
        target: ScriptTarget.ES2015,
      },
    });

    project.addSourceFileAtPath(path);
    project.resolveSourceFileDependencies();
    const interfaces = project.getSourceFile(path)?.getInterfaces();
    let ret = "";
    interfaces?.forEach((i) => {
      const name = i.getName();
      console.log(name);
      const properties = i.getProperties();
      properties.forEach((p) => {
        const key = p.getName();
        const type = p.getType();
        const selector = `@Selector()
static ${key}(state: ${strings.classify(options.name)}StateModel) {
    return state.${key};
}`;
        ret += "\n" + selector;
        if (type.isArray()) {
          ret += "\n" + actionsArray(options, type, key);
        } else if (type.isObject()) {
          ret += "\n" + actionsObject(options, type, key);
        } else {
          ret += "\n" + actionsPrimitive(options, type, key);
        }
      });
    });

    console.log(ret);

    return host;
  };
}

// function generateActions(options: Options, json: any, parent?: string) {
//   const keys = Object.keys(json);
//   let ret = "";
//   keys.forEach((key) => {
//     switch (typeof json[key]) {
//       case "boolean":
//         ret += "\n" + generateAction(options, "boolean", key, parent);
//         break;
//       case "string":
//         ret += "\n" + generateAction(options, "string", key, parent);
//         break;
//       case "number":
//         ret += "\n" + generateAction(options, "number", key, parent);
//         break;
//       case "object":
//         if (Array.isArray(json[key])) {
//           ret += "\n" + generateAction(options, "any[]", key, parent);
//         } else {
//           ret +=
//             "\n" + generateAction(options, strings.classify(key), key, parent);
//           ret += "\n" + generateActions(options, json[key], key);
//         }
//         break;
//     }
//   });
//   return ret;
// }

function actionsPrimitive(
  options: Options,
  type: Type,
  key: string,
  parent?: string
) {
  const setOrUpdate = `class Set${strings.classify(options.name)}${
    parent ? strings.classify(parent) : ""
  }${strings.classify(key)} {
    static readonly type = '[${strings.classify(
      options.name
    )}] Set${strings.classify(key)}]';
    constructor(public readonly ${strings.camelize(key)}: ${type.getText()}) {}
  }`;

  const _delete = `class Delete${strings.classify(options.name)}${
    parent ? strings.classify(parent) : ""
  }${strings.classify(key)} {
    static readonly type = '[${strings.classify(
      options.name
    )}] Delete${strings.classify(key)}]';
  }`;

  return [setOrUpdate, _delete].join("\n");
}

function actionsArray(
  options: Options,
  type: Type,
  key: string,
  parent?: string
) {
  const set = `class Set${strings.classify(options.name)}${
    parent ? strings.classify(parent) : ""
  }${strings.classify(key)} {
    static readonly type = '[${strings.classify(
      options.name
    )}] Set${strings.classify(key)}]';
    constructor(public readonly ${strings.camelize(key)}: ${type.getText()}) {}
  }`;
  const updateOne = `class UpdateOne${strings.classify(options.name)}${
    parent ? strings.classify(parent) : ""
  }${strings.classify(key)} {
    static readonly type = '[${strings.classify(
      options.name
    )}] UpdateOne${strings.classify(key)}]';
    constructor(public readonly ${strings.camelize(
      key
    )}: Partial<${type.getArrayElementType()?.getText()}>) {}
  }`;
  const updateMany = `class UpdateMany${strings.classify(options.name)}${
    parent ? strings.classify(parent) : ""
  }${strings.classify(key)} {
    static readonly type = '[${strings.classify(
      options.name
    )}] UpdateMany${strings.classify(key)}]';
    constructor(public readonly ${strings.camelize(key)}: ${type.getText()}) {}
  }`;

  const deleteOne = `class DeleteOne${strings.classify(options.name)}${
    parent ? strings.classify(parent) : ""
  }${strings.classify(key)} {
    static readonly type = '[${strings.classify(
      options.name
    )}] DeleteOne${strings.classify(key)}]';
    constructor(public readonly ${strings.camelize(
      key
    )}: ${type.getArrayElementType()?.getText()}) {}
  }`;

  const deleteMany = `class DeleteMany${strings.classify(options.name)}${
    parent ? strings.classify(parent) : ""
  }${strings.classify(key)} {
    static readonly type = '[${strings.classify(
      options.name
    )}] DeleteMany${strings.classify(key)}]';
    constructor(public readonly ${strings.camelize(key)}: ${type.getText()}) {}
  }`;

  return [set, updateOne, updateMany, deleteOne, deleteMany].join("\n");
}

function actionsObject(
  options: Options,
  type: Type,
  key: string,
  parent?: string
) {
  const set = `class Set${strings.classify(options.name)}${
    parent ? strings.classify(parent) : ""
  }${strings.classify(key)} {
    static readonly type = '[${strings.classify(
      options.name
    )}] Set${strings.classify(key)}]';
    constructor(public readonly ${strings.camelize(key)}: ${type.getText()}) {}
  }`;
  const patch = `class Patch${strings.classify(options.name)}${
    parent ? strings.classify(parent) : ""
  }${strings.classify(key)} {
    static readonly type = '[${strings.classify(
      options.name
    )}] Patch${strings.classify(key)}]';
    constructor(public readonly ${strings.camelize(
      key
    )}: Partial<${type.getText()}>) {}
  }`;

  const deleteOne = `class Delete${strings.classify(options.name)}${
    parent ? strings.classify(parent) : ""
  }${strings.classify(key)} {
    static readonly type = '[${strings.classify(
      options.name
    )}] Delete${strings.classify(key)}]';
  }`;

  return [set, patch, deleteOne].join("\n");
}
