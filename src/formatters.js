import pep440 from "@renovatebot/pep440";

const ignoredVersionPatterns = /^[^0-9]|[0-9]{4}-[0-9]{2}-[0-9]{2}/;
function addv(version) {
  version = `${version}`;
  if (version.startsWith("v") || ignoredVersionPatterns.test(version)) {
    return version;
  } else {
    return `v${version}`;
  }
}

function pep440VersionColor(version) {
  if (!pep440.valid(version)) {
    return "lightgrey";
  }
  const parsedVersion = pep440.explain(version);
  if (parsedVersion.is_prerelease || parsedVersion.public.startsWith("0.")) {
    return "orange";
  }
  return "blue";
}

export { addv, pep440VersionColor };
