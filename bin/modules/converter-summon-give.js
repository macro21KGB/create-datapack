const chalk = require("chalk");
const {convertGiveCommandToSummonCommand, convertSummonCommandToGiveCommand  } = require("../utils/utils");
const inquirer = require("inquirer");

const run = () => {
 


  inquirer.prompt([
    {
      type: "input",
      name: "command",
      message: "What command would you like to convert?",
      validate: function(value) {
        if (value.length) {
          return true;
        } else {
          return "Please enter a command";
        }
      }
    }
  ]).then(answers => {

    let commandToConvert = "";
    let convertedCommand = "";
    commandToConvert = answers.command;
    
    if (commandToConvert.includes("summon")) {
      console.log(chalk.blue(`Converting ${commandToConvert} to give command`));
      convertedCommand = convertSummonCommandToGiveCommand(convertedCommand);
    } else {
      console.log(chalk.blue(`Converting ${commandToConvert} to summon command`));
      convertedCommand = convertGiveCommandToSummonCommand(commandToConvert);
    }
    console.log(chalk.green(`Converted command: ${convertedCommand}`));
    //TODO rework the summon converter
  });
 
};

module.exports = {
  run,
};
