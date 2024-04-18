import { getGroups } from "./api.ts";
import { parseGroups } from "./parse.ts";
import { join } from "@std/path/join";
import { Group } from "./types.ts";

const OUTPUT_DIR = "out";
const GROUPS_HTML_FILEPATH = "groups.html";
const GROUPS_JSON_FILEPATH = "groups.json";

const groupsHtmlFilepath = join(OUTPUT_DIR, GROUPS_HTML_FILEPATH);
const groupsJsonFilepath = join(OUTPUT_DIR, GROUPS_JSON_FILEPATH);

console.log(`Fetching groups...`);

let groupsHTML: string;
try {
  groupsHTML = await Deno.readTextFile(groupsHtmlFilepath);
  console.log(`Skipping since file already exists`);
} catch (e) {
  if (!(e instanceof Deno.errors.NotFound)) {
    throw e;
  }

  groupsHTML = await getGroups();
  await Deno.writeTextFile(groupsHtmlFilepath, groupsHTML);
}

const groups = parseGroups(groupsHTML);
await Deno.writeTextFile(groupsJsonFilepath, JSON.stringify(groups));
