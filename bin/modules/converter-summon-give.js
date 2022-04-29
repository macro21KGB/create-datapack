import chalk from "chalk";
const { blue, green } = chalk;
import { convertGiveCommandToSummonCommand, convertSummonCommandToGiveCommand } from "../utils/utils.js";
import inquirer from "inquirer";

export const run = async () => {

  const answers = await inquirer.prompt(
    {
      type: "input",
      name: "command",
      message: "What command would you like to convert?",
      validate: function (value) {

        if (value.length == 0)
          return "Please enter a command";

        if (!value.includes("summon") || !value.includes("give"))
          return "Please enter a summon/give command";

        return true;
      }
    }
  )


  let commandToConvert = "";
  let convertedCommand = "";
  commandToConvert = answers.command;

  if (commandToConvert.includes("summon")) {
    console.log(blue(`Converting ${commandToConvert} to give command`));
    convertedCommand = convertSummonCommandToGiveCommand(commandToConvert);
  } else {
    console.log(blue(`Converting ${commandToConvert} to summon command`));
    convertedCommand = convertGiveCommandToSummonCommand(commandToConvert);
  }
  console.log(green(`Converted command: ${convertedCommand}`));

};

