const chalk = require("chalk");
const inquirer = require("inquirer");
const PATH = require("path");

const {
  showGreenMessage,
  showRedMessage,
  getInputFromEditor,
} = require("../utils/utils");
const fs = require("fs");

let recipe = [];

const run = () => {
  const recipe = getInputFromEditor(
    "<amount> <minecraft:item_name>\nExample:\n1 minecraft:glowstone_dust\n3 minecraft:redstone\nFor defining the result:\nRESULT: minecraft:<minecraft:name>\nor\nuse mcstacker.net, generate a give command and do the same thing\nRESULT: give @p ....",
    (recipeName, recipe, path) => {
      const parsedCraftingRecipe = parseFloorCraftingRecipe(recipe);
      if (typeof parsedCraftingRecipe === "boolean") return;
      else {
        const [parsedRecipe, finalItem] = parsedCraftingRecipe;
        console.log(chalk.green("Recipe parsed successfully!"));
        generateFloorCraftingRecipe(recipeName, parsedRecipe, finalItem, path);
      }
    }
  );
};

/**
 * Parse the recipe received from the user and validate it, if it is valid return the parsed recipe and the result item
 * if it is not valid return false
 * @param {string[]} recipe
 * @return {[{ count: number, id: string }[], { count: number, id: string }] | false}
 */
const parseFloorCraftingRecipe = (recipe) => {
  const result = [];
  let finalItem = {};
  let isInvalid = false;
  const resultRegex = /RESULT: (.*)/;

  recipe.forEach((line, index) => {
    if (!validateRecipeStep(line)) {
      showRedMessage("Invalid recipe step at line " + (index + 1));
      isInvalid = true;
    } else {
      const resultMatch = line.match(resultRegex);
      if (resultMatch) {
        finalItem = { count: 1, id: resultMatch[1] };
      } else {
        if (line === "") return;
        const amount = line.split(" ")[0];
        const item = line.split(" ")[1];
        result.push({ count: +amount, id: item });
      }
    }
  });

  if (isInvalid) return false;
  //@ts-ignore
  else return [result, finalItem];
};

/**
 * this function will generate the necessary code to create a floor crafting recipe
 * @param {string} recipeName Name of the recipe
 * @param {{id:string,count:number}[]} recipe
 * @param {{count:number,id:string}} resultItem
 * @param {string} path Selected Path of the folder to put the recipe in
 */
const generateFloorCraftingRecipe = (recipeName, recipe, resultItem, path) => {
  let executePart = "";
  let killPart = "";

  recipe.forEach((item, index) => {
    executePart += `execute as @e[type=minecraft:item, nbt={Item:{id:"${
      item.id
    }", Count:${item.count}b}}${index > 0 ? ", distance=..1" : ""}] run `;
  });

  executePart += `summon minecraft:item ~ ~ ~ {Tags: ["fresh_craft"], Item: { id: "${resultItem.id}", Count: ${resultItem.count}b}}`;

  recipe.forEach((item) => {
    killPart += `execute at @e[type=item, tag=fresh_craft] run kill @e[type=item,sort=nearest,distance=..1, nbt={ Item: { id: "${item.id}", Count: ${item.count}b}}]\n`;
  });

  killPart +=
    "tag @e[type=item,tag=fresh_craft,limit=1, sort=nearest] remove fresh_craft";

  appendFunctionToFile(
    "\n" + executePart + "\n\n" + killPart,
    PATH.join(path, `main.mcfunction`)
  );
};

const appendFunctionToFile = (text, path) => {
  fs.appendFile(path, text, (err) => {
    if (err) {
      showRedMessage(err);
      return;
    }
    showGreenMessage("Recipe created!");
  });
};

/*validate the line in the following from:
  
  1. if the line start with a number, it must be followed by a space and a item name
  2. if the line start with RESULT: it must be followed by a item name
  3. if the line is empty, it must be ignored
  */
/**
 *
 * @param {string} line
 * @returns {boolean} true if the line is valid, false otherwise
 */
const validateRecipeStep = (line) => {
  const regex = /^[0-9]+\s[a-zA-Z0-9_:]+$/;
  const resultRegex = /^RESULT: (.*)/;
  if (line === "") return true;
  if (line.match(regex)) return true;
  if (line.match(resultRegex)) return true;
  return false;
};

module.exports = {
  run,
  validateRecipeStep,
  generateFloorCraftingRecipe,
  parseFloorCraftingRecipe,
};
