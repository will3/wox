import Curve from "./Curve";

test("get value", () => {
  const curve = new Curve();
  expect(curve.sample(0.5)).toEqual(0.5);
});

test("get value 2", () => {
  const curve = new Curve([-1, -0.6, 0, 1], [-1, -0.1, 0.1, 1]);

  expect(curve.sample(-0.3)).toEqual(0);
  expect(curve.sample(-0.4)).toEqual(-0.033333333333333354);
});

test("get value lower than first interval", () => {
  const curve = new Curve([-1, -0.6, 0, 1], [-1, -0.1, 0.1, 1]);

  expect(curve.sample(-2)).toEqual(-1);
});

test("get value higher than last interval", () => {
  const curve = new Curve([-1, -0.6, 0, 1], [-1, -0.1, 0.1, 1]);

  expect(curve.sample(2)).toEqual(1);
});
