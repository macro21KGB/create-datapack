const chalk = require("chalk");
const inquirer = require("inquirer");

const modules = {
  "auto-uninstaller": () => {
    const module = require("./modules/auto-uninstaller");
    module.run();
  },
};

const generateListOfModules = () => {
  const list = [];
  for (const key in modules) {
    if (modules.hasOwnProperty(key)) {
      list.push({ name: key, value: key });
    }
  }
  return list;
};

const executeModule = (moduleName) => {
  if (modules[moduleName]) {
    console.log(chalk.blue(`Executing module: ${chalk.bold(moduleName)}`));
    modules[moduleName]();
  } else {
    console.log(chalk.red("Module not found, check for syntax error"));
  }
};

// create a list using inquirer with the list of modules
// ask for the module name
// execute the module
const runWithInquirer = () => {
  const list = generateListOfModules();
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
  runWithInquirer
};
