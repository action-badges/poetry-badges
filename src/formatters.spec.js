"use strict";

const assert = require("assert");
const { pep440VersionColor } = require("./formatters");

describe("pep440VersionColor", function () {
  it("generates correct colors for versions", function () {
    const testCases = [
      ["1.0.1", "blue"],
      ["v2.1.6", "blue"],
      ["1.0.1+abcd", "blue"],
      ["1.0", "blue"],
      ["v1", "blue"],
      [9, "blue"],
      [1.0, "blue"],
      ["1.0.1-rc1", "orange"],
      ["1.0.1rc1", "orange"],
      ["1.0.0-Beta", "orange"],
      ["1.0.0Beta", "orange"],
      ["1.1.0-alpha", "orange"],
      ["1.1.0alpha", "orange"],
      ["1.0.1-dev", "orange"],
      ["1.0.1dev", "orange"],
      ["2.1.6-b1", "orange"],
      ["2.1.6b1", "orange"],
      ["0.1.0", "orange"],
      ["v0.1.0", "orange"],
      ["v2.1.6-b1", "orange"],
      ["0.1.0+abcd", "orange"],
      ["2.1.6-b1+abcd", "orange"],
      ["0.0.0", "orange"],
      [0.1, "orange"],
      ["0.9", "orange"],
      ["6.0.0-SNAPSHOT", "lightgrey"],
      ["2.1.6-prerelease", "lightgrey"],
      [true, "lightgrey"],
      [null, "lightgrey"],
      ["cheese", "lightgrey"],
    ];
    for (const testCase of testCases) {
      assert.strictEqual(
        pep440VersionColor(testCase[0]),
        testCase[1],
        testCase[0], //message
      );
    }
  });
});
