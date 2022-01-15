import { PARAMS } from "test/common";

enum ECode {
  E0001 = "hello ${    yourname }, my name is ${myname}",
  E0002 = "username  ${    name } is not exist",
}
type EnumDef = typeof ECode;
type EnumDefKeys = keyof EnumDef;
type EnumDefType = {
  [K in EnumDefKeys]: PARAMS<EnumDef[K]>;
};

function enumfail<
  K extends EnumDefKeys,
  PARAMS extends EnumDefType[K],
  INJECT extends { [K in PARAMS]: any }
>(key: K, context: INJECT): string {
  return "";
}

enumfail("E0001", {
  yourname: "anakin",
  myname: "luke",
});

// fail("E0001", {
//   yourname: "",
//   fe: "",
// });

enumfail("E0002", {
  name: "",
});
