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
type DefineConditionTemplateKey = KeyOfByType<
  Define,
  Partial<ConditionTemplate>
>;

export class StatusFailed extends HttpException {
  code!: string;

  static fail(
    code: DefineLiteralTemplateKey,
    context?: Record<string, any>
  ): StatusFailed {
    let message = defines[code];
    if (context !== undefined) {
      for (const found of message.matchAll(/\$\{\s*([^}\s]+)\s*}/g)) {
        if (found[1] in context) {
          message = message.replace(found[0], context[found[1]]);
        }
      }
    }
    const res = new StatusFailed(message, 200);
    res.code = code;
    return res;
  }
}

@Catch(StatusFailed)
export class StatusFailedFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<NResponse>();

    response.status(200).json({
      code: exception.code,
      message: exception.message,
    });
    // console.log(exception)
    // response.status(exception.getStatus()).json(exception.getResponse());
  }
}
