import chalk from "chalk";
const { blue, bold, red } = chalk;
import * as autoUninstaller from "../bin/modules/auto-uninstaller.js";

import * as converterSummonGive from "../bin/modules/converter-summon-give.js";

import inquirer from "inquirer";


const modules = {
  "auto-uninstaller": async () => {
    await autoUninstaller.run();
  },
  "converter-summon-give": async () => {
    await converterSummonGive.run();
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
const executeModule = async (moduleName) => {
  if (modules[moduleName]) {
    console.log(blue(`Executing module: ${bold(moduleName)}`));
    await modules[moduleName]();
  } else {
    console.log(red("Module not found, check for syntax error"));
  }
};

// create a list using inquirer with the list of modules
export const selectModuleInquirer = async () => {
  const list = generateListOfModules(modules);
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "module",
      message: "Select a module",
      choices: list,
    }
  ]);

  await executeModule(answers.module);
};


