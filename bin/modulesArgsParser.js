const chalk = require("chalk");
const inquirer = require("inquirer");

const modules = {
  "auto-uninstaller": () => {
    const module = require("./modules/auto-uninstaller");
    module.run();
  },
  "floor-crafting-recipe": () => {
    const module = require("./modules/floor-crafting-recipe");
    module.run();
  },
  "converter-summon-give": () => {
    const module = require("./modules/converter-summon-give");
    module.run();
  },
};

/**
 *
 * @param {Object} modules
 * @returns {Array<{name: string, value:string}>} lista di nomi dei moduli
 */
const generateListOfModules = (modules) => {
  const list = [];
  for (const key in modules) {
    if (modules.hasOwnProperty(key)) {
      list.push({ name: key, value: key });
    }
  }
  return list;
};

// execute the module
const executeModule = (moduleName) => {
  if (modules[moduleName]) {
    console.log(chalk.blue(`Executing module: ${chalk.bold(moduleName)}`));
    modules[moduleName]();
  } else {
    console.log(chalk.red("Module not found, check for syntax error"));
  }
};

// create a list using inquirer with the list of modules
const runWithInquirer = () => {
  const list = generateListOfModules(modules);
  inquirer
    .prompt([
      {
        type: "list",
        name: "module",
        message: "Select a module",
        choices: list,
      },
    ])
    .then((answers) => {
      executeModule(answers.module);
    });
};

module.exports = {
  executeModule,
  runWithInquirer,
};
