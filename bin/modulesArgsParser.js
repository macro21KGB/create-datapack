import chalk from "chalk";
const { blue, bold, red } = chalk;

import inquirer from "inquirer";


const modules = [
  "auto-uninstaller",
  "converter-summon-give",
  "generator-sites"
];


// execute the module
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
      choices: modules,
    }
  ]);

  await executeModule(answers.module);
};


