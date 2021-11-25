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
};
