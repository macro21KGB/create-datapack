import chalk from "chalk";
const { bold, green, bgGreen } = chalk;

export const run = async () => {
    console.log(bgGreen(`${green("Welcome to the")} ${bgGreen("generator-sites")} ${green("module")}`));
    console.log(`${green("List of custom generator I have created:\n")}`);
    console.log(green(bold('https://mc-floor-crafting.surge.sh/')));
    console.log(green(bold('https://custom-crafting-table-recipe.surge.sh')));
};

