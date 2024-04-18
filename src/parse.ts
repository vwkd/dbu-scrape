import { DOMParser, Element } from "deno_dom";
import { Group } from "./types.ts";

/**
 * Parse groups from HTML
 *
 * @returns array of groups
 */
export function parseGroups(text: string): Group[] {
  const doc = new DOMParser().parseFromString(text, "text/html")!;

  const divs = doc.querySelectorAll("div#searchRez > div.gruppen_teil")!;

  const groups = [];
  for (const div of divs) {
    // todo: workaround for types, replace once fixed, see https://github.com/b-fuze/deno-dom/issues/141
    const d = div as Element;

    const titleElement = d.querySelector("div.gruppen_title:nth-child(1)")!;

    const title = titleElement.textContent;
    // note: ignore URL in `onclick` attribute since same as URL in anchor below

    const textElement = d.querySelector("div.gruppen_text:nth-child(2)")!;

    const websiteElement = textElement.querySelector("a");
    const website = websiteElement?.getAttribute("href")!;

    const emailElement = textElement.querySelector("script");
    const email = emailElement?.textContent.match(
      /^gen_mail_to_link\('(.+?)','(.+?)'\);$/,
    )?.slice(1).join("@");

    const lines = [...textElement.childNodes]
      .filter((cn) => cn.nodeName == "#text")
      .map((cn) => cn.textContent)
      .filter((cn) => cn.trim())
      .filter((cn) => cn.trim() != "|");

    if (!(lines.length == 2 || lines.length == 3)) {
      console.debug(title);
      console.warn(`Unexpected number of lines: ${lines.length}`);
    }

    const tradition = lines[0].trim().replace(/^Tradition: /, "");

    if (!tradition) {
      console.debug(title);
      throw new Error(`Unexpected tradition: ${lines[0]}`);
    }

    const address = lines[1].trim().replace(/( |\t)+/g, " ").replace(
      / \|$/,
      "",
    );

    if (!address) {
      console.debug(title);
      throw new Error(`Unexpected address: ${lines[1]}`);
    }

    const barrierefrei = lines[2]?.trim() == "| - barrierefrei -"
      ? true
      : undefined;

    if (lines[2] && !barrierefrei) {
      console.debug(title);
      throw new Error(`Unexpected lines[2]: ${lines[2]}`);
    }

    const urlElement = d.querySelector("div.gruppen_text:nth-child(3) > a")!;
    const url = urlElement.getAttribute("href")!;

    groups.push({
      title,
      tradition,
      address,
      email,
      website,
      barrierefrei,
      url,
    });
  }

  return groups;
}
