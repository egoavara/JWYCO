export const jsonerror = {
  E0001: "hello ${    yourname }, my name is ${myname}",
  // E0002: "username  ${    name } is not exist",
  E0003: {
    release: "username ${    name } is not exist",
    debug: "username ${    name } is not exist, ${secret}",
  },
} as const;
