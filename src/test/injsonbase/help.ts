import { PARAMS } from "src/test/common";
import { jsonerror } from "./defines";

type ELEM<T> = T extends string
  ? { all: PARAMS<T>; release: PARAMS<T>; debug: PARAMS<T> }
  : T extends { release: string; debug: string }
  ? {
      all: PARAMS<T["release"]> | PARAMS<T["debug"]>;
      release: PARAMS<T["release"]>;
      debug: PARAMS<T["debug"]>;
    }
  : { error: "unexpected error define" };

type Def = typeof jsonerror;
type DefKeys = keyof Def;
type DefType = {
  [K in DefKeys]: ELEM<Def[K]>;
};

function fail<K extends DefKeys, A extends DefType[K]["all"]>(
  key: K,
  context: Partial<{ [K in A]: any }>
): string {
  const data = jsonerror[key];
  let message = "";
  if (typeof data === "string") {
    message = data;
  } else {
    message = data.release;
  }
  for (const found of message.matchAll(/\$\{\s*([^}\s]+)\s*}/g)) {
    // @ts-expect-error
    message = message.replace(found[0], context[found[1]]);
  }
  return message;
}
function failMode<
  K extends DefKeys,
  M extends "release" | "debug",
  D extends DefType[K][M]
>(key: K, mode: M, context: Partial<{ [K in D]: any }>): string {
  const data = jsonerror[key];
  let message = "";
  if (typeof data === "string") {
    message = data;
  } else {
    if (mode === "debug") {
      message = data.debug;
    } else {
      message = data.release;
    }
  }
  for (const found of message.matchAll(/\$\{\s*([^}\s]+)\s*}/g)) {
    // @ts-expect-error
    message = message.replace(found[0], context[found[1]]);
  }
  return message;
}

console.log(
  failMode("E0001", "release", {
    yourname: "anakin",
    myname: "luke",
  })
);

console.log(
  fail("E0003", {
    name: "fe",
    secret: "w",
  })
);

console.log(
  failMode("E0003", "release", {
    name: "???",
  })
);
console.log(
  failMode("E0003", "debug", {
    name: "???",
    secret: "<SECRET>",
  })
);
