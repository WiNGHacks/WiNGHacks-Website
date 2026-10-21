import { getSessionToken } from "./session";

const tokenFor = (payload) => `e30.${btoa(JSON.stringify(payload))}.signature`;
const cookiesFor = (token) => ({ get: () => token, remove: jest.fn() });

test("missing cookie does not crash or require removal", () => {
  const cookies = cookiesFor(undefined);
  expect(getSessionToken(cookies)).toBeNull();
  expect(cookies.remove).not.toHaveBeenCalled();
});

test.each(["not-a-jwt", tokenFor({}), tokenFor({ id: "user", exp: 1 })])(
  "clears an unusable cookie: %s", (token) => {
    const cookies = cookiesFor(token);
    expect(getSessionToken(cookies)).toBeNull();
    expect(cookies.remove).toHaveBeenCalledWith("TOKEN", { path: "/" });
  }
);

test("keeps a valid session cookie", () => {
  const token = tokenFor({ id: "user", exp: Math.floor(Date.now() / 1000) + 3600 });
  const cookies = cookiesFor(token);
  expect(getSessionToken(cookies)).toBe(token);
  expect(cookies.remove).not.toHaveBeenCalled();
});
