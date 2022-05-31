import { __dirname, __filename, findFunctionsFolder, checkForMetaFile } from "../utils/utils.js";
import { readdirSync, existsSync, writeFileSync, access, readFile, readFileSync } from "fs";
import inquirer from "inquirer";
import { trimExtensionFromFile } from "../utils/stringUtils.js";
import path from "path";
import chalk from "chalk";
import { parseStructureTemplate } from "../parser.js";

const { blue, bold, red } = chalk;

export const run = async () => {

    checkForMetaFile(process.cwd());

    if (!existsSync(path.join(process.cwd(), "./structure"))) {
        console.log(red(`The structure folder doesn't exist.`));
        return;
    }

    const answers = await inquirer.prompt([
        {
            type: "list",
            name: "structure",
            message: "What structure template would you like to convert?",
            choices: getStructureFromStructureFolder().map(trimExtensionFromFile)
        }
    ])

    const structureName = answers.structure;

    const structureCode = readFileSync('structure/' + structureName + '.mcs', 'utf8');

    generate(parseStructureTemplate(structureCode), path.join(await findFunctionsFolder(process.cwd()), structureName + ".mcfunction"));

}

const getStructureFromStructureFolder = () => {
    const fetchedStructure = readdirSync(path.join(process.cwd(), "./structure")).filter(file => file.endsWith(".mcs"));
    return fetchedStructure;
}

const generate = (structureCode, path) => {

    try {
        writeFileSync(path, structureCode);
        console.log(chalk.green("Successfully generated structure file at " + chalk.bold(path)));
    } catch (error) {
        console.log(chalk.red("Couldn't generate structure file."));
    }
}

