import { PARAMS } from "test/common";
import {default as jsonerror} from "./def.json"

type Def = typeof jsonerror;
type DefKeys = keyof Def;
type DefType = {
  [K in DefKeys]: {
    Params: PARAMS<Def[K]>;
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
