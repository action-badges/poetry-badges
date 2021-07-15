"use strict";

const { invoke } = require("@action-badges/core");
const { getAction } = require("./lib");

(async () => {
  return await invoke(getAction());
})();
