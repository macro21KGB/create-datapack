#! /usr/bin/env node

const inquirer = require("inquirer");
const fs = require("fs");
const chalk = require("chalk");
const configs = require("./configs");
const path = require("path");
const parser = require("./parser");

const questions = [
  {
    type: "list",
    message: "Version of minecraft",
    choices: [
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
];

console.log(chalk.blue("Current Path: " + chalk.bold(process.cwd())));

inquirer
  .prompt(questions)
  .then((answers) => {

    //If using a tempalte, get the templates from the file in the templates folder
    if (answers.usingTemplate) {

      console.log(chalk.blue("To edit the templates, go to: " + chalk.bold(__dirname + "\\templates")));

      //Get the templates
      const templates = getTemplates(answers.nameSpace);

      let choices = [];
      templates.forEach((template) => {
        choices.push({
          name: template.title,
          value: template.files,
        });
      });

      //Ask to choose the template to add
      inquirer
        .prompt({
          type: "list",
          message: "Choose a template",
          choices: choices,
          name: "templateInUse",
        })
        .then((templateData) => {
          generateDirectoryStructure(answers, templateData.templateInUse);
        });
    } else {
      generateDirectoryStructure(answers, null);
    }
  })
  .catch((error) => {
    console.log(error);
  });

function generateDirectoryStructure(data, templateData) {
  const baseDir = "./" + data.datapackName + "/data";
  fs.mkdirSync(baseDir, { recursive: true });
  configs.createMCMeta(data.datapackName, data.version, data.description);
  configs.createGlobalAdvancements(
    baseDir,
    data.username,
    data.datapackName,
    data.description
  );

  configs.createMinecraftTags(baseDir, data.nameSpace);

  if (templateData === null)
    configs.createMainFunctionFolder(baseDir, data.nameSpace, false, null);
  else
    configs.createMainFunctionFolder(
      baseDir,
      data.nameSpace,
      true,
      templateData
    );

  console.log(chalk.green("✔ All Done!"));
}

function getTemplates(namespace) {
  let templates = [];
  const fromDirectory = __dirname + "\\templates";

  const files = fs.readdirSync(fromDirectory);
  for (const file of files) {
    const fromPath = path.join(fromDirectory, file);

    const data = fs.readFileSync(fromPath);

    templates.push(parser.parseMCTemplate(data.toString(), namespace));
  }
  return templates;
}
