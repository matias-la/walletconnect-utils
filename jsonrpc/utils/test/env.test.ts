import "mocha";
import * as chai from "chai";

import { isReactNative, isBrowser } from "../src";

describe("Environment", () => {
  it("isReactNative", () => {
    chai.expect(isReactNative()).to.be.false;
  });
  it("isBrowser", () => {
    chai.expect(isBrowser()).to.be.false;
  });
});
