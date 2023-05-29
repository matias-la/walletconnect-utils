import "mocha";
import * as chai from "chai";

import pino, { Logger } from "pino";

import {
  getDefaultLoggerOptions,
  generateChildLogger,
} from "../src";

describe("Logger", () => {
  let logger: Logger;
  before(() => {
    logger = pino(getDefaultLoggerOptions());
  });
  it("init", () => {
    chai.expect(logger).to.not.be.undefined;
  });
});
