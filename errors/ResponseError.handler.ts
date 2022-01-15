import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";
import { Response as NResponse } from "express";

import defines from "./defines.json";

//
type KeyOfByType<O, T> = {
  [K in keyof O]: O[K] extends T ? K : never;
}[keyof O];

type Define = typeof defines;
type DefineKey = keyof Define;

type LiteralTemplate = string;
interface ConditionTemplate {
  release: LiteralTemplate;
  debug: LiteralTemplate;
}

type DefineLiteralTemplateKey = KeyOfByType<Define, LiteralTemplate>;
type DefineConditionTemplateKey = KeyOfByType<Define, ConditionTemplate>;

class TemplateArguments {
  mode?: "debug" | "release";
  context!: Record<string, any>;
}

type a = Omit<TemplateArguments, "mode">;

function isType<T extends DefineKey>(value: DefineKey): value is T {
  return (value as T) !== undefined;
}
export class StatusFailed extends HttpException {
  static fail(
    code: DefineLiteralTemplateKey,
    args?: TemplateArguments["context"]
  ): StatusFailed;
  static fail(
    code: DefineConditionTemplateKey,
    args?: TemplateArguments
  ): StatusFailed;
  static fail(
    code: DefineKey,
    args?: TemplateArguments | TemplateArguments["context"]
  ): StatusFailed {
    let context: TemplateArguments["context"] = {};
    let message: string = "";
    let mode: "release" | "debug" = "release";
    //
    const sargs = args ?? {};
    if ("context" in sargs || "mode" in sargs) {
      if (sargs["mode"] === undefined) {
        if (process.env.DEBUG !== undefined) {
          mode = Boolean(process.env.DEBUG) ? "debug" : "release";
        }
      } else if (sargs["mode"] === "debug") {
        mode = "debug";
      }
      context = sargs["context"];
    } else {
      context = sargs;
    }
    //
    const kvalue = defines[code];
    if (typeof kvalue === "string") {
      message = kvalue;
    } else {
      message = kvalue[mode];
    }
    for (const found of message.matchAll(/\$\{\s*([^}\s]+)\s*}/g)) {
      message = message.replace(found[0], context[found[1]]);
    }
    const res = new StatusFailed(
      {
        message,
        code,
      },
      200
    );
    return res;
  }
}
