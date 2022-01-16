import { PARAMS } from "src/test/common";
import jsonerror from "./def.json";

type First<T> = T extends infer F | infer O
  ? F extends string
    ? F
    : ""
  : T extends string
  ? T
  : "";

type Def = typeof jsonerror;
type DefKeys = keyof Def;
type DefType = {
  [K in DefKeys]: {
    Params: PARAMS<First<keyof Def[K]>>;
  };
};

function fail<
  K extends DefKeys,
  INJECT extends { [K in PARAMS]: any },
  PARAMS extends DefType[K]["Params"]
>(key: K, context: INJECT): string {
  return "";
}

fail("E0001", {
  yourname: "anakin",
  myname: "luke",
});

// fail("E0001", {
//   yourname: "",
//   fe: "",
// });

fail("E0002", {
  name: "",
});
