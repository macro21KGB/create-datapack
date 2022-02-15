import { readdirSync, statSync, readFileSync, existsSync, writeFileSync } from "fs";

import chalk from "chalk";
const { green, bold, red } = chalk;

// cerca nella directory e nelle sottodirectory corrente tutti i file con estensione
//.mcfunction e salva il loro path in un array

/**
 *
 * @param {string} dir directory da cercare
 * @param {Array<string>} files_ array di files da ritornare
 * @returns {Array<string>}
 */
const getFiles = (dir, files_) => {
  files_ = files_ || [];
  const files = readdirSync(dir);
  for (let i in files) {
    const name = dir + "/" + files[i];
    if (statSync(name).isDirectory()) {
      getFiles(name, files_);
    } else {
      if (name.endsWith(".mcfunction")) {
        files_.push(name);
      }
    }
  }
  return deleteDuplicates(files_);
};

/**
 *  Scan the files for searching entity to delete
 * @param {Array<string>} files
 * @returns {Array<string>}
 */
const scanFiles = (files) => {
  let result = [];
  let entitiesToDelete = [];
  for (let i in files) {
    const file = files[i];
    const lines = readFileSync(file).toString().split("\n");
    for (let j in lines) {
      const line = lines[j];
      if (line.includes("scoreboard objectives add")) {
        result.push(
          line
            .replace(
              "scoreboard objectives add",
              "scoreboard objectives remove"
            )
            .split(" ")
            .slice(0, -1)
            .join(" ")
        );
      }
      if (line.includes("execute as @e")) {
        const regexp = new RegExp(/\[([a-zA-Z=:_,]+)\]/g);
        // take the first group of the regexp
        const entity = line.match(regexp) ? line.match(regexp)[0] : null;

        if (entity && !entity.includes("player"))
          entitiesToDelete.push(`kill @e${entity}`);
      }
    }
  }
  return result.concat(entitiesToDelete);
};

const run = () => {
  // controlla se è presente un file con estensione .mcmeta, se è presente lo ritorna true, altrimenti false
  const isMeta = existsSync(`${process.cwd()}/pack.mcmeta`);

  if (isMeta) {
    console.log(green("Uninstaller: found pack.mcmeta"));

    const files = getFiles(process.cwd(), []);
    const results = scanFiles(files);
    const namespace = files[0]
      .match(/data[/\\]([a-zA-Z_\-+0-9])+/g)[0]
      .split("/")[1];

    try {
      const fileName = `${process.cwd()}/data/${namespace}/functions/uninstaller.mcfunction`;
      writeFileSync(fileName, results.join("\n"));
      console.log(
        green(`Uninstaller: generated ${bold(fileName)}`)
      );
    } catch (error) {
      console.log(red(`Uninstaller Failed to generate file: ${error}`));
    }
  } else {
    console.log(
      red(
        "Uninstaller: pack.mcmeta not found, Execute this module on the root of the datapack"
      )
    );
  }
};

/**
 *
 * @param {string[]} array
 * @returns
 */
// delete duplicates from array
const deleteDuplicates = (array) => {
  return array.filter((item, index) => array.indexOf(item) === index);
};

export default {
  run,
  deleteDuplicates,
  getFiles,
  scanFiles,
};
