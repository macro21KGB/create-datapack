const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const folderExplorer = require("inquirer-folder-explorer");

const showGreenMessage = (message) => {
  console.log(chalk.green(message));
};

const showRedMessage = (message) => {
  console.log(chalk.red(message));
};

/**
 * Use inquirer to ask the user for the items to make the crafting,
 * and the result using the default text editor
 * @param {string} defaultMessage
 * @param {(recipeName:string,raweRecipe:string[], selectedPath:string) => void} callback
 * @returns {boolean}
 */
const getInputFromEditor = (defaultMessage, callback) => {
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
const convertGiveCommandToSummonCommand = (giveCommand) => {
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
const convertSummonCommandToGiveCommand = (summonCommand, selector) => {
  const regex = /summon item ~ ~ ~ {Item:{id:"(.*?)",Count:(.*?)b,tag:(.*?)}}/g;
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

/**
 *
 * @param {string} recipeName
 * @param {{id:string,count:number}[]} recipe
 * @returns
 */

module.exports = {
  showGreenMessage,
  showRedMessage,
  getInputFromEditor,
  convertGiveCommandToSummonCommand,
  convertSummonCommandToGiveCommand,
};
