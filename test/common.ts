export type TRIM<S extends string> = S extends ` ${infer T}`
  ? TRIM<T>
  : S extends `${infer T} `
  ? TRIM<T>
  : S;

export type PARAMS<S extends string> =
  S extends `${infer T}\${${infer FIELD}}${infer U}`
    ? TRIM<FIELD> | PARAMS<U>
    : never;
