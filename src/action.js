"use strict";

const core = require("@actions/core");
const { invoke } = require("@action-badges/core");
const {
  PoetryDependencyVersion,
  PoetryLicense,
  PoetryVersion,
} = require("./lib");

async function run() {
  const integration = core.getInput("integration", { required: true });
  const validIntegrations = {
    "dependency-version": PoetryDependencyVersion,
    license: PoetryLicense,
    version: PoetryVersion,
  };
  if (integration in validIntegrations) {
    return await invoke(validIntegrations[integration]);
  }
  core.setFailed(
    `integration must be one of (${Object.keys(validIntegrations)})`
  );
}

run();
