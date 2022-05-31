import chalk from "chalk";
const { blue, bold, red } = chalk;
import { readdirSync } from "fs";

import { trimExtensionFromFile } from "./utils/stringUtils.js"
import inquirer from "inquirer";
import path from "path";
import { __dirname } from "./utils/utils.js";


//get the modules automatically from the modules folder
const getModulesFromModulesFolder = () => {
  const fetchedModules = readdirSync(path.join(__dirname, "..", "./modules"));
  return fetchedModules;
}


// execute the selected module
const executeModule = async (moduleName) => {
  const currentModule = await import(`./modules/${moduleName}.js`);
  const { run } = currentModule;
  await run();
};

// create a list using inquirer with the list of modules
export const selectModuleInquirer = async () => {
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "module",
      message: "Select a module",
      choices: getModulesFromModulesFolder().map(trimExtensionFromFile),
    }
  ]);

  await executeModule(answers.module);
};


