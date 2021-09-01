#! /usr/bin/env node

const inquirer = require("inquirer");
const fs = require("fs");
const chalk = require("chalk");
const configs = require("./configs");

const questions = [
  {
    type: "list",
    message: "Version of minecraft",
    choices: [{name: "1.17.x", value: "7"},{name: "1.16.x", value: "6"}],
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
    }
  },
  {
    type: "input",
    name: "username",
    message: "Author's Username",
    default: "my_username",
    filter: (input, _) => {
      return input.replace(/ /g, "_").toLowerCase();
    }
  },
];

console.log(chalk.blue("Current Path: " + chalk.bold(process.cwd())));

inquirer
  .prompt(questions)
  .then((answers) => {
    genereateDirectoryStructure(answers);
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });



function genereateDirectoryStructure(data) {
  const baseDir = "./" + data.datapackName + "/data";
  fs.mkdirSync(baseDir, { recursive: true });
	configs.createMCMeta(data.datapackName, data.version, data.description);
  configs.createGlobalAdvancements(baseDir, data.username, data.datapackName, data.description);
  configs.createMinecraftTags(baseDir, data.nameSpace);
  configs.createMainFunctionFolder(baseDir, data.nameSpace)
  
}
