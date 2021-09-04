const fs = require("fs");
const chalk = require("chalk");

let defaultPackMCMeta = {
  pack: {
    pack_format: "",
    description: "",
  },
};

let defaultRootAdvancement = {
  display: {
    title: "Installed Datapacks",
    description: "Installed Datapacks",
    icon: {
      item: "minecraft:knowledge_book",
    },
    background: "minecraft:textures/block/gray_concrete.png",
    show_toast: false,
    announce_to_chat: false,
  },
  criteria: {
    trigger: {
      trigger: "minecraft:tick",
    },
  },
};

let defaultUsernameAdvancement = {
  display: {
    title: "",
    description: "",
    icon: {
      item: "minecraft:player_head",
      nbt: "{SkullOwner:USERNAME}",
    },
    show_toast: false,
    announce_to_chat: false,
  },
  parent: "global:root",
  criteria: {
    trigger: {
      trigger: "minecraft:tick",
    },
  },
};

let defaultDatapackAdvancement = {
  display: {
    title: "",
    description: "",
    icon: {
      item: "minecraft:bedrock",
    },
    show_toast: false,
    announce_to_chat: true,
  },
  parent: "global:USERNAME",
  criteria: {
    trigger: {
      trigger: "minecraft:tick",
    },
  },
};

let namespaceMinecraftConfig = {
  replace: false,
  values: ["NAMESPACE:load/main"],
};

//Creating pack.MCMeta file
exports.createMCMeta = (directory, version, description) => {
  console.log(chalk.green("Generating MCMETA..."));

  defaultPackMCMeta["pack"]["pack_format"] = +version;
  defaultPackMCMeta["pack"]["description"] = description;

  fs.writeFileSync(
    process.cwd() + "\\" + directory + "\\pack.mcmeta",
    JSON.stringify(defaultPackMCMeta)
  );
};

//creating cross datapack advancements
exports.createGlobalAdvancements = (
  directory,
  username,
  datpackName,
  description
) => {
  console.log(chalk.green("Generating Global Advancements..."));
  let currentDir = directory + "/global/advancements";

  //Root advancement
  fs.mkdirSync(currentDir, { recursive: true });
  fs.writeFileSync(
    currentDir + "/root.json",
    JSON.stringify(defaultRootAdvancement)
  );

  //Username Advancement
  defaultUsernameAdvancement.display.icon.nbt = `{SkullOwner: ${username}}`;
  defaultUsernameAdvancement.display.title = username;
  fs.writeFileSync(
    currentDir + `/${username}.json`,
    JSON.stringify(defaultUsernameAdvancement)
  );

  //Datapack Advancement
  defaultDatapackAdvancement.display.title = datpackName;
  defaultDatapackAdvancement.display.description = description;
  defaultDatapackAdvancement.parent = `global:${username}`;
  fs.writeFileSync(
    currentDir + `/${datpackName.replace(/ /g, "_").toLowerCase()}.json`,
    JSON.stringify(defaultDatapackAdvancement)
  );
};

//Creating minecraft/tags/functions for the tick and load functionality
exports.createMinecraftTags = (directory, namespace) => {
  console.log(chalk.green("Generating Minecraft Tag Functions..."));

  let currentDir = directory + "/minecraft/tags/functions/";
  fs.mkdirSync(currentDir, { recursive: true });

  namespaceMinecraftConfig.values = [namespace + ":load"];
  fs.writeFileSync(
    currentDir + "load.json",
    JSON.stringify(namespaceMinecraftConfig)
  );

  namespaceMinecraftConfig.values = [namespace + ":main"];
  fs.writeFileSync(
    currentDir + "tick.json",
    JSON.stringify(namespaceMinecraftConfig)
  );
};

exports.createMainFunctionFolder = (directory, namespace, usingTemplate, templateData) => {
  let currentDir = directory + `/${namespace}/`;
  fs.mkdirSync(currentDir, {
    recursive: true
  });

  if (!usingTemplate) {
    console.log(chalk.green("Generating Main Function files..."));
    fs.writeFileSync(currentDir + "/functions/main.mcfunction", "say main");
    fs.writeFileSync(currentDir + "/functions/load.mcfunction", "say load");
  }
  else {

    console.log(chalk.green("Generating Main Function files from Templates..."));
    templateData.forEach(mcfunction => {
      let selectedFolder = currentDir + mcfunction.file_type + "/";
      let extension = mcfunction.file_type === "functions" ? ".mcfunction" : ".json";
      fs.mkdirSync(selectedFolder, {
        recursive: true
      });

      console.log(chalk.green(`\tGenerating ${mcfunction.file_name}`));
      fs.writeFileSync(selectedFolder + mcfunction.file_name + extension , mcfunction.content);
    });
  }

};
