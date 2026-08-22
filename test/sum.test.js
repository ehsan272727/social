import { describe, expect, test } from "vitest";

describe.skip("Math.sqrt", () => {
  test("Returns the square root of perfect squares", () => {
    expect(Math.sqrt(4)).toBe(2);
    expect(Math.sqrt(9)).toBe(3);
  });

  test("returns NaN for negative numbers", () => {
    expect(Math.sqrt(-1)).toBeNaN();
  });

  test("returns 0 for 0", () => {
    expect(Math.sqrt(0)).toBe(0);
  });
});

test.todo("Test toggle button");

test.skip.for([
  [1, 1, 2],
  [2, 2, 3],
])("add(%i, %s) -> %f", ([a, b, expected]) => {
  expect(a + b).toBe(expected);
});

test("toBe vs toEqual", () => {
  const a = { name: "Ehsan" };
  const b = { name: "Ehsan", b: undefined };

  expect(a).not.toBe(b);
  expect(a).toEqual(b);
  expect(a).toStrictEqual(b);
});

test("null checks", () => {
  const n = null;

  expect(n).toBeNull();
  expect(n).toBeDefined();
  expect(n).toBeFalsy();
  expect(n).not.toBeTruthy();
  expect(n).not.toBeUndefined();
});

test("zero", () => {
  const z = 0;

  expect(z).toBeDefined(); // passes: 0 is defined
  expect(z).toBeFalsy(); // passes: 0 is falsy
  expect(z).not.toBeNull(); // passes: 0 is not null
});
