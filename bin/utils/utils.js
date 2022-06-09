
import chalk from "chalk"
import { readFileSync, readdirSync, existsSync, mkdirSync } from "fs"
import inquirer from "inquirer"
import { homedir } from "os"
import { dirname, join } from "path"
import { parseMCTemplate } from "../parser.js";
import { fileURLToPath } from 'url'
import dir from "node-dir"


export const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)


export const showGreenMessage = (message) => {
  console.log(chalk.green(message));
};

export const showRedMessage = (message) => {
  console.log(chalk.red(message));
};


/**
 * convert a give command into a summon command
 * @param {string} giveCommand
 * @returns the summon command generated from the give command
 */
export const convertGiveCommandToSummonCommand = (giveCommand) => {

  const regex = new RegExp('give ([0-9a-zA-Z@\\[\\]= ,]+\\]?) ([a-zA-Z:0-9_]+) ?(\\{.*\\})? ([0-9]+)', 'gm')
  const str = `/give @p[limit=4,tag=aaa] minecraft:torch{display:{Name:'{"text":"Torcia Bella"}',Lore:['{"text":"Lore"}']},HideFlags:1,test: 1b} 64
  `;

  let resultRegex;
  try {
    while ((resultRegex = regex.exec(giveCommand)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (resultRegex.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      resultRegex.groups = {
        item: resultRegex[2],
        itemTag: resultRegex[3],
        itemCount: resultRegex[4],
      };

      const item = normalizeMinecraftID(resultRegex.groups.item);
      const itemTag = resultRegex.groups.itemTag;
      const itemCount = resultRegex.groups.itemCount;

      const summonCommand = `summon item ~ ~ ~ {Item:{id:"minecraft:${item}",Count:${itemCount}b, tag:${itemTag}}}`;

      return summonCommand;
    }
  } catch (error) {
    showRedMessage(error);
  }

};

/**
 *
 * @param {string} summonCommand summon command to convert into a give command
 * @param {string} selector selector to use in the give command (default: "@s")
 * @returns the give command generated from the summon command
 */
export const convertSummonCommandToGiveCommand = (summonCommand) => {

  const regex = new RegExp('id: ?"(.*)", ?Count:(\\d+b)(, ?tag:\\{.*)? ?\\}', 'gm')

  let resultRegex;
  let giveCommand = "";
  while ((resultRegex = regex.exec(summonCommand)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (resultRegex.index === regex.lastIndex) {
      regex.lastIndex++;
    }


    resultRegex.groups = {
      item: resultRegex[1],
      itemCount: resultRegex[2],
      itemTag: resultRegex[3],
    };


    const item = normalizeMinecraftID(resultRegex.groups.item);
    const itemCount = resultRegex.groups.itemCount;
    const itemTag = resultRegex.groups.itemTag;


    if (itemTag)
      giveCommand = `give @p ${item}${itemTag.replace(", tag:", "").replace("}}", "}")} ${itemCount.replace(/b/gi, "")}`;
    else
      giveCommand = `give @p ${item} ${itemCount.replace(/b/gi, "")}`;


    return giveCommand;
  }

};

/**
 *
 * @param {string} id item id or name
 * @returns the id of the item withouth the minecraft: prefix
 */
const normalizeMinecraftID = (id) => {
  return id.replace(/minecraft:/gi, "");
};



export const getGeneralConfig = async () => {
  const answers = await inquirer.prompt([
    {
      type: "list",
      message: "Version of minecraft",
      choices: [
        { name: "1.19.x", value: "9" },
        { name: "1.18.x", value: "8" },
        { name: "1.17.x", value: "7" },
        { name: "1.16.x", value: "6" },
      ],
      name: "version",
    },
    {
      type: "input",
      name: "datapackName",
      message: "Name of the datapack",
      default: "Default_Datapack",
    },
    {
      type: "input",
      name: "description",
      message: "Description of the datapack",
      default: "Default description",
    },
    {
      type: "input",
      name: "nameSpace",
      message: "Namespace of the datapack",
      default: "default",
      filter: (input, _) => {
        return input.replace(/ /g, "_").toLowerCase();
      },
    },
    {
      type: "input",
      name: "username",
      message: "Author's Username",
      default: "my_username",
      filter: (input, _) => {
        return input.replace(/ /g, "_").toLowerCase();
      },
    },
    {
      type: "confirm",
      name: "usingTemplate",
      message: "Do you want to use a custom template",
      default: "false",
    },
  ]);

  return answers;

}



/**
 *
 * @param {String} namespace
 * */
export const getTemplates = (namespace) => {
  let templates = [];
  console.log("Getting templates", process.cwd);
  const fromDirectory = join(__dirname, "..", "templates");
  const fromCustomDirectory = join(homedir(), "datapack-templates");


  //Load template file from Inner Configs
  templates.push(...readTemplateFile(fromDirectory, namespace));

  //If a custom folder exists, use the templates located there too
  if (existsSync(fromCustomDirectory)) {
    templates.push(...readTemplateFile(fromCustomDirectory, namespace));
  } else {
    //Generate the folder is it doesn't exists
    mkdirSync(fromCustomDirectory, { recursive: true });
    console.log(
      chalk.blue(
        "Custom Templates Folder Generated in: " + fromCustomDirectory
      )
    );
  }

  return templates;
}

export const readTemplateFile = (directory, namespace) => {
  let files = [];

  const templateFiles = readdirSync(directory);
  for (const file of templateFiles) {
    const fromPath = join(directory, file);
    const data = readFileSync(fromPath);

    files.push(parseMCTemplate(data.toString(), namespace));
  }

  return files.length > 0 ? files : [];
}


/**
 * 
 * @param {string} startPath The path to start from
 * @returns the path to the "Functions" folder
 */
export const findFunctionsFolder = async (startPath) => {

  const files = readdirSync(startPath, { withFileTypes: true });

  for (const file of files) {
    const filePath = join(startPath, file.name);
    if (file.isDirectory()) {

      if (file.name === "minecraft") {
        continue;
      }

      if (file.name === "functions") {
        return filePath;
      } else {
        const result = await findFunctionsFolder(filePath);
        if (result) {
          return result;
        }
      }
    }
  }

}


/**
 * Controlla se è presente un file con estensione .mcmeta, se è presente lo ritorna true, altrimenti false
 * 
 * @param {string} path 
 * @returns {bool} true if there is a mcmeta file, false otherwise
 */
export const checkForMetaFile = (path) => {
  const isMeta = existsSync(join(process.cwd(), 'pack.mcmeta'));

  if (isMeta) {
    return true;
  }
  else {
    console.log(chalk.red("[ERROR]: pack.mcmeta not found"));
    return false;
  }
}