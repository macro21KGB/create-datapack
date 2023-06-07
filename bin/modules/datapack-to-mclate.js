import { existsSync, readFileSync } from "fs";
import chalk from "chalk";
import { join } from "path";
import inquirer from "inquirer";
import { readdir } from "fs/promises";
const { red } = chalk;

// get all file names from a folder recursively, and return them as an array
/**
 * 
 * @param {string} dir The path to the folder
 * @returns {Promise<string[]>} An array of file names
 */
const getAllFiles = async (dir) => {
    const dirents = await readdir(dir, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
        const res = join(dir, dirent.name);
        return dirent.isDirectory() ? getAllFiles(res) : res;
    }));
    return Array.prototype.concat(...files);
};

export const run = async () => {
    // controlla se è presente un file con estensione .mcmeta, se è presente lo ritorna true, altrimenti false
    const ifMetaExists = existsSync(join(process.cwd(), 'pack.mcmeta'));

    if (!ifMetaExists) {
        console.log(
            red(
                "Uninstaller: pack.mcmeta not found, Execute this module on the root of the datapack"
            )
        );
    }

    let files = await getAllFiles(join(process.cwd(), "data"));

    console.log(files);

    files = files.map((file) => {
        const content = readFileSync(file).toString();

        return {
            path: file,
            content: content,
        }
    });

    const answers = await inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "Insert the title of the template",
        }
    ]);

    const title = '<###>' + answers.title;
    console.log(title);

}