#!/usr/bin/env node
import chalk from "chalk";
import { mkdirSync } from "fs";
import inquirer from "inquirer";
import { homedir } from "os";
import { createGlobalAdvancements, createMainFunctionFolder, createMCMeta, createMinecraftTags } from './configs.js';
import { getGeneralConfig, getTemplates } from "./utils/utils.js";

import { selectModuleInquirer } from "./modulesArgsParser.js";
import { exit } from "process";
import figlet from "figlet";
const { prompt } = inquirer;


const sleep = (ms = 2000) => new Promise((resolve) => setTimeout(resolve, ms));


console.clear();
figlet("Create-Datapack", (err, data) => {
  if (err) {
    console.log(err);
    exit(1);
  }
  console.log(chalk.green(data));
  console.log(
    chalk.underline(chalk.bold("by macro21KGB")
    )
  );
})
await sleep(2000);

//if the argument is not empty, open the module screen
if (process.argv.length > 2 && process.argv[2] === "-m") {
  await selectModuleInquirer();
  exit();
}


const answers = await getGeneralConfig();

if (!answers.usingTemplate) {
  generateDirectoryStructure(answers, null);
}

console.log(
  chalk.blue(
    "To edit the templates, go to: " +
    chalk.bold(homedir() + "\\datapack-templates")
  )
);

//Get the templates
const templates = getTemplates(answers.nameSpace);

const choices = templates.map((template) => {
  return {
    name: template.title.trim(),
    value: template.files,
  };
});

//Ask to choose the template to add
prompt({
  type: "rawlist",
  message: "Choose a template",
  choices: choices,
  name: "templateInUse",
})
  .then((templateData) => {
    generateDirectoryStructure(answers, templateData.templateInUse);
  });




/**
 *
 * @param {Object} data
 * @param {any} templateData
 */
function generateDirectoryStructure(data, templateData) {
  const baseDir = "./" + data.datapackName + "/data";
  mkdirSync(baseDir, { recursive: true });
  createMCMeta(data.datapackName, data.version, data.description);
  createGlobalAdvancements(
    baseDir,
    data.username,
    data.datapackName,
    data.description
  );

  createMinecraftTags(baseDir, data.nameSpace);

  if (templateData === null) {
    createMainFunctionFolder(baseDir, data.nameSpace, false, null);
  }
  else {
    createMainFunctionFolder(
      baseDir,
      data.nameSpace,
      true,
      templateData
    );
  }
  console.log(chalk.green("✔ All Done!"));
}





