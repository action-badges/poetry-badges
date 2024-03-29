import { promises as fs } from "fs";
import core from "@actions/core";
import { parse } from "smol-toml";
import { BaseAction } from "@action-badges/core";
import { addv, pep440VersionColor } from "./formatters.js";

class PoetryLicense extends BaseAction {
  get label() {
    return "license";
  }

  async fetch() {
    return parse(await fs.readFile("./pyproject.toml", "utf8"));
  }

  async validate(pyprojectToml) {
    if (
      pyprojectToml.tool &&
      pyprojectToml.tool.poetry &&
      pyprojectToml.tool.poetry.license
    ) {
      return pyprojectToml;
    }
    throw new Error(
      "pyproject.toml does not contain '.tool.poetry.license' property",
    );
  }

  async render() {
    const pyprojectToml = await this.validate(await this.fetch());
    return {
      message: pyprojectToml.tool.poetry.license,
      messageColor: "blue",
    };
  }
}

class PoetryVersion extends BaseAction {
  get label() {
    return "version";
  }

  async fetch() {
    return parse(await fs.readFile("./pyproject.toml", "utf8"));
  }

  async validate(pyprojectToml) {
    if (
      pyprojectToml.tool &&
      pyprojectToml.tool.poetry &&
      pyprojectToml.tool.poetry.version
    ) {
      return pyprojectToml;
    }
    throw new Error(
      "pyproject.toml does not contain '.tool.poetry.version' property",
    );
  }

  async render() {
    const pyprojectToml = await this.validate(await this.fetch());
    return {
      message: addv(pyprojectToml.tool.poetry.version),
      messageColor: pep440VersionColor(pyprojectToml.tool.poetry.version),
    };
  }
}

class PoetryDependencyVersion extends BaseAction {
  get label() {
    return "dependency";
  }

  getInputs() {
    const dependencyType = core.getInput("dependency-type") || "dependencies";
    const dependency = core.getInput("dependency", { required: true });
    return { dependencyType, dependency };
  }

  async fetch() {
    return parse(await fs.readFile("./pyproject.toml", "utf8"));
  }

  async validate(pyprojectToml, dependencyType, dependency) {
    if (
      pyprojectToml.tool &&
      pyprojectToml.tool.poetry &&
      pyprojectToml.tool.poetry[dependencyType] &&
      pyprojectToml.tool.poetry[dependencyType][dependency]
    ) {
      return pyprojectToml;
    }
    throw new Error(
      `pyproject.toml does not contain '.tool.poetry.${dependencyType}.${dependency}' property`,
    );
  }

  async render() {
    const { dependencyType, dependency } = this.getInputs();
    const pyprojectToml = await this.validate(
      await this.fetch(),
      dependencyType,
      dependency,
    );
    const version = pyprojectToml.tool.poetry[dependencyType][dependency];
    const message = version.version ? version.version : version;
    return {
      label: dependency.toLowerCase(),
      message: message.replace(/\s/g, ""),
      messageColor: "blue",
    };
  }
}

function fail(message) {
  core.setFailed(message);
  throw new Error(message);
}

function getAction() {
  const integration = core.getInput("integration", { required: true });
  const validIntegrations = {
    "dependency-version": PoetryDependencyVersion,
    license: PoetryLicense,
    version: PoetryVersion,
  };
  if (integration in validIntegrations) {
    return validIntegrations[integration];
  }
  fail(`integration must be one of (${Object.keys(validIntegrations)})`);
}

export { PoetryDependencyVersion, PoetryLicense, PoetryVersion, getAction };
