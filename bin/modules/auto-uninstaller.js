const fs = require("fs");
const chalk = require("chalk");

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
  const files = fs.readdirSync(dir);
  for (let i in files) {
    const name = dir + "/" + files[i];
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files_);
    } else {
      if (name.endsWith(".mcfunction")) {
        files_.push(name);
      }
    }
  }
  return files_;
};

/**
 *
 * @param {Array<string>} files
 * @returns {Array<string>}
 */
const scanFiles = (files) => {
  let result = [];
  let entitiesToDelete = [];
  for (let i in files) {
    const file = files[i];
    const lines = fs.readFileSync(file).toString().split("\n");
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

        if (entity)
          if (!entity.includes("player"))
            entitiesToDelete.push(`kill @e${entity}`);
      }
    }
  }
  console.log(entitiesToDelete);
  return result.concat(entitiesToDelete);
};

const generateUninstaller = () => {};

const run = () => {
  console.log(process.cwd());
  // controlla se è presente un file con estensione .mcmeta, se è presente lo ritorna true, altrimenti false
  const isMeta = fs.existsSync(`${process.cwd()}/pack.mcmeta`);

  if (isMeta) {
    console.log("Uninstaller: found pack.mcmeta");
    const files = getFiles(process.cwd());
    const results = scanFiles(files);
    const namespace = files[0]
      .match(/data[/\\]([a-zA-Z_\-+0-9])+/g)[0]
      .split("/")[1];
    const fileName = `${process.cwd()}/data/${namespace}/functions/uninstaller.mcfunction`;
    fs.writeFileSync(fileName, results.join("\n"));
    console.log(chalk.green(`Uninstaller: generated ${chalk.bold(fileName)}`));
  } else {
    console.log(
      chalk.red(
        "Uninstaller: pack.mcmeta not found, Execute this module on the root of the datapack"
      )
    );
  }
};

module.exports = {
  run,
};
