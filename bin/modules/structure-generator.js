import { __dirname, __filename, findFunctionsFolder, checkForMetaFile } from "../utils/utils.js";
import { readdirSync, existsSync, writeFileSync, access, readFile, readFileSync } from "fs";
import inquirer from "inquirer";
import { trimExtensionFromFile } from "../utils/stringUtils.js";
import path from "path";
import chalk from "chalk";
import { parseStructureTemplate } from "../parser.js";

const { red } = chalk;

export const run = async () => {

    checkForMetaFile(process.cwd());

    if (!existsSync(path.join(process.cwd(), "./structures"))) {
        console.log(red(`The structures folder doesn't exist here. Make sure you are in the root of your datapack (where is the .mcmeta file).`));
        return;
    }

    const structureListFromFolder = getStructureFromStructureFolder().map(trimExtensionFromFile);


    if (structureListFromFolder.length === 0) {
        console.log(red(`There are no structure files (.mcs) in the structure folder.`));
        return;
    }

    const answers = await inquirer.prompt([
        {
            type: "list",
            name: "structure",
            message: "What structure template would you like to convert?",
            choices: structureListFromFolder,
        }
    ])

    const structureName = await answers.structure;

    const structureCode = readFileSync('structures/' + structureName + '.mcs', 'utf8');

    const functionFolderPath = await findFunctionsFolder(process.cwd());

    generate(parseStructureTemplate(structureCode), path.join(functionFolderPath, structureName + ".mcfunction"));

}

const getStructureFromStructureFolder = () => {
    const fetchedStructure = readdirSync(path.join(process.cwd(), "./structures")).filter(file => file.endsWith(".mcs"));
    return fetchedStructure;
}


/**
 * Write the structure to the given file
 * @param {string} structureCode 
 * @param {string} path 
 */
const generate = (structureCode, path) => {

    try {
        writeFileSync(path, structureCode);
        console.log(chalk.green("Successfully generated structure file at " + chalk.bold(path)));
    } catch (error) {
        console.log(chalk.red("Couldn't generate structure file."));
    }
}

