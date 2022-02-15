
import chalk from "chalk"
import { readFileSync, readdirSync, existsSync, mkdirSync } from "fs"
import inquirer from "inquirer"
import folderExplorer from "inquirer-folder-explorer"
import { homedir } from "os"
import { dirname, join } from "path"
import { parseMCTemplate } from "../parser.js";

export const showGreenMessage = (message) => {
  console.log(chalk.green(message));
};

export const showRedMessage = (message) => {
  console.log(chalk.red(message));
};

/**
 * Use inquirer to ask the user for the items to make the crafting,
 * and the result using the default text editor
 * @param {string} defaultMessage
 * @param {(recipeName:string,raweRecipe:string[], selectedPath:string) => void} callback
 * @returns {boolean}
 */
export const getInputFromEditor = (defaultMessage, callback) => {
  let recipe = [];
  // @ts-ignore
  inquirer.registerPrompt("filePath", require("inquirer-file-path"));
  inquirer
    .prompt([
      {
        type: "input",
        name: "recipeName",
        message: "Enter the recipe Name: ",
        default: "recipe_name",
      },
      {
        type: "editor",
        name: "recipe",
        default: defaultMessage,
      },
    ])
    .then((answers) => {
      folderExplorer(
        "Please choose a folder",
        process.cwd(),
        function (err, folder) {
          const selectedFolder = folder;
          recipe = answers.recipe.split("\n");
          callback(answers.recipeName, recipe, selectedFolder);
        }
      );
    });
  return true;
};

// turn:
// give @p carrot_on_a_stick{display:{Name:'{"text":"TEST","bold":true}'},Unbreakable:1b,test1:1b} 1
// into:
// summon item ~ ~ ~ {Item:{id:"minecraft:carrot",Count:1b,tag:{display:{Name:'{"text":"TEST","bold":true}'},test1:1b}}}

/**
 * convert a give command into a summon command
 * @param {string} giveCommand
 * @returns the summon command generated from the give command
 */
export const convertGiveCommandToSummonCommand = (giveCommand) => {
  const itemToSummon = giveCommand.split(" ")[2];
  const regex = /([a-zA-Z_:]+)(.*)/g;
  const match = regex.exec(itemToSummon);

  try {
    const itemName = match[1];
    const itemNBT = match[2];
    const itemCount = giveCommand.split(" ")[3] || "1";

    if (itemNBT === "" || itemNBT === undefined) {
      return `summon item ~ ~ ~ {Item:{id:"minecraft:${normalizeMinecraftID(
        itemName
      )}",Count:${itemCount}b}}`;
    } else {
      return `summon item ~ ~ ~ {Item:{id:"minecraft:${normalizeMinecraftID(
        itemName
      )}",Count:${itemCount}b,tag:${itemNBT}}}`;
    }
  } catch (e) {
    showRedMessage("Error: Syntax error in the give command");
    return "ERROR";
  }
};

/**
 *
 * @param {string} summonCommand summon command to convert into a give command
 * @param {string} selector selector to use in the give command (default: "@s")
 * @returns the give command generated from the summon command
 */
export const convertSummonCommandToGiveCommand = (summonCommand, selector) => {
  const regex = /summon item ~ ~ ~ ({Item:{id:"(.*?)",Count:(.*?)b,tag:(.*?)}})/g;
  selector = selector || "@p";
  const match = regex.exec(summonCommand);
  try {
    const itemName = match[1];
    const itemCount = match[2];
    const itemNBT = match[3] + "}";

    if (itemNBT === "" || itemNBT === undefined) {
      return `give ${selector} ${normalizeMinecraftID(itemName)} ${itemCount}`;
    } else {
      return `give ${selector} ${normalizeMinecraftID(
        itemName
      )}${itemNBT} ${itemCount}`;
    }
  } catch (e) {
    showRedMessage("Error: Syntax error in the summon command");
    return "ERROR";
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

  const fromDirectory = join(dirname(".\templates"), "templates");
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