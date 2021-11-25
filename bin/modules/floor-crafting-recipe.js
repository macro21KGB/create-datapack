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
      const [parsedRecipe, finalItem] = parseFloorCraftingRecipe(recipe);
      console.log(finalItem);
      generateFloorCraftingRecipe(recipeName, parsedRecipe, finalItem, path);
    }
  );
};

/**
 *
 * @param {string[]} recipe
 * @return {[{ count: number, id: string }[], { count: number, id: string }]}
 */
const parseFloorCraftingRecipe = (recipe) => {
  const result = [];
  let finalItem = {};
  const resultRegex = /RESULT: (.*)/;

  recipe.forEach((line) => {
    if (line === "") return;
    const resultMatch = line.match(resultRegex);
    if (resultMatch) {
      finalItem = { count: 1, id: resultMatch[1] };
    } else {
      const amount = line.split(" ")[0];
      const item = line.split(" ")[1];
      result.push({ count: +amount, id: item });
    }
  });
  //@ts-ignore
  return [result, finalItem];
};

/**
 *
 * @param {string} recipeName Name of the recipe
 * @param {{id:string,count:number}[]} recipe
 * @param {{count:number,id:string}} resultItem
 * @param {string} path Selected Path of the folder to put the recipe in
 */
const generateFloorCraftingRecipe = (recipeName, recipe, resultItem, path) => {
  let executePart = "";
  let killPart = "";

  recipe.forEach((item) => {
    executePart += `execute as @e[type=minecraft:item, nbt={Item:{id:"${item.id}", Count:${item.count}b}}] run `;
  });

  executePart += `summon minecraft:item ~ ~ ~ {Tags: ["fresh_craft"], Item: { id: ${resultItem.id}, Count: ${resultItem.count}b}}`;

  recipe.forEach((item) => {
    killPart += `execute at @e[type=item, tag=fresh_craft] run kill @e[type=item,sort=nearest,distance=..1, nbt={ Item: { id: "${item.id}", Count: ${item.count}b}}]\n`;
  });

  killPart +=
    "tag @e[type=item,tag=fresh_craft,limit=1, sort=nearest] remove fresh_craft";

  console.log(executePart + "\n\n");
  console.log(killPart);

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

module.exports = {
  run,
};
