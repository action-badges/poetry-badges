"use strict";

const assert = require("assert");
const {
  PoetryDependencyVersion,
  PoetryLicense,
  PoetryVersion,
  getAction,
} = require("./lib");

describe("PoetryLicense", function () {
  it("throws if license is missing", async function () {
    const stub = new PoetryLicense();
    const responses = [{}, { tool: {} }, { tool: { poetry: {} } }];
    for (const response of responses) {
      stub.fetch = () => response;
      await assert.rejects(stub.render(), {
        name: "Error",
        message:
          "pyproject.toml does not contain '.tool.poetry.license' property",
      });
    }
  });

  it("renders if file is valid", async function () {
    const stub = new PoetryLicense();
    stub.fetch = () => ({ tool: { poetry: { license: "MIT" } } });
    const badge = await stub.render();
    assert.deepStrictEqual({ message: "MIT", messageColor: "blue" }, badge);
  });
});

describe("PoetryVersion", function () {
  it("throws if version is missing", async function () {
    const stub = new PoetryVersion();
    const responses = [{}, { tool: {} }, { tool: { poetry: {} } }];
    for (const response of responses) {
      stub.fetch = () => response;
      await assert.rejects(stub.render(), {
        name: "Error",
        message:
          "pyproject.toml does not contain '.tool.poetry.version' property",
      });
    }
  });

  it("renders if file is valid (stable release)", async function () {
    const stub = new PoetryVersion();
    stub.fetch = () => ({ tool: { poetry: { version: "1.0.1" } } });
    const badge = await stub.render();
    assert.deepStrictEqual({ message: "v1.0.1", messageColor: "blue" }, badge);
  });

  it("renders if file is valid (pre release)", async function () {
    const stub = new PoetryVersion();
    stub.fetch = () => ({ tool: { poetry: { version: "0.2.3" } } });
    const badge = await stub.render();
    assert.deepStrictEqual(
      { message: "v0.2.3", messageColor: "orange" },
      badge
    );
  });
});

describe("PoetryDependencyVersion", function () {
  afterEach(function () {
    delete process.env["INPUT_DEPENDENCY"];
    delete process.env["INPUT_DEPENDENCY-TYPE"];
  });

  it("throws if dependency is missing", async function () {
    process.env["INPUT_DEPENDENCY"] = "Django";
    const stub = new PoetryDependencyVersion();
    const responses = [
      {},
      { tool: {} },
      { tool: { poetry: {} } },
      { tool: { poetry: { dependencies: {} } } },
      { tool: { poetry: { dependencies: { requests: ">=2" } } } },
    ];
    for (const response of responses) {
      stub.fetch = () => response;
      await assert.rejects(stub.render(), {
        name: "Error",
        message:
          "pyproject.toml does not contain '.tool.poetry.dependencies.Django' property",
      });
    }
  });

  it("renders if file is valid (dependencies, implicit)", async function () {
    process.env["INPUT_DEPENDENCY"] = "python";
    const stub = new PoetryDependencyVersion();
    stub.fetch = () => ({
      tool: { poetry: { dependencies: { python: "^3.6" } } },
    });
    const badge = await stub.render();
    assert.deepStrictEqual(
      { label: "python", message: "^3.6", messageColor: "blue" },
      badge
    );
  });

  it("renders if file is valid (dependencies, explicit)", async function () {
    process.env["INPUT_DEPENDENCY"] = "Django";
    process.env["INPUT_DEPENDENCY-TYPE"] = "dependencies";
    const stub = new PoetryDependencyVersion();
    stub.fetch = () => ({
      tool: { poetry: { dependencies: { Django: ">=1.11,<4.0" } } },
    });
    const badge = await stub.render();
    assert.deepStrictEqual(
      { label: "django", message: ">=1.11,<4.0", messageColor: "blue" },
      badge
    );
  });

  it("renders if file is valid (dev-dependencies)", async function () {
    process.env["INPUT_DEPENDENCY"] = "isort";
    process.env["INPUT_DEPENDENCY-TYPE"] = "dev-dependencies";
    const stub = new PoetryDependencyVersion();
    stub.fetch = () => ({
      tool: { poetry: { "dev-dependencies": { isort: "5.8" } } },
    });
    const badge = await stub.render();
    assert.deepStrictEqual(
      { label: "isort", message: "5.8", messageColor: "blue" },
      badge
    );
  });

  it("renders if file is valid (version is object)", async function () {
    process.env["INPUT_DEPENDENCY"] = "black";
    process.env["INPUT_DEPENDENCY-TYPE"] = "dev-dependencies";
    const stub = new PoetryDependencyVersion();
    stub.fetch = () => ({
      tool: {
        poetry: {
          "dev-dependencies": {
            black: { version: "==20.8b1", "allow-prereleases": true },
          },
        },
      },
    });
    const badge = await stub.render();
    assert.deepStrictEqual(
      { label: "black", message: "==20.8b1", messageColor: "blue" },
      badge
    );
  });
});

describe("getAction", function () {
  afterEach(function () {
    delete process.env["INPUT_INTEGRATION"];
  });

  it("Returns the correct action class with expected inputs", function () {
    process.env["INPUT_INTEGRATION"] = "dependency-version";
    assert.strictEqual(PoetryDependencyVersion, getAction());

    process.env["INPUT_INTEGRATION"] = "license";
    assert.strictEqual(PoetryLicense, getAction());

    process.env["INPUT_INTEGRATION"] = "version";
    assert.strictEqual(PoetryVersion, getAction());
  });

  it("Throws an exception with unexpected inputs", function () {
    process.env["INPUT_INTEGRATION"] = "invalid";
    assert.throws(() => getAction(), {
      name: "Error",
      message:
        "integration must be one of (dependency-version,license,version)",
    });
  });
});
