import { writeFileSync, mkdirSync } from "fs";
import chalk from "chalk";
import path from "path";
const { green } = chalk;

let defaultPackMCMeta = {
  pack: {
    pack_format: 0,
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
export const createMCMeta = (directory, version, description) => {
  console.log(green("Generating MCMETA..."));

  defaultPackMCMeta["pack"]["pack_format"] = +version;
  defaultPackMCMeta["pack"]["description"] = description;

  writeFileSync(
    path.join(process.cwd(), directory, "pack.mcmeta"),
    JSON.stringify(defaultPackMCMeta)
  );
}

//creating cross datapack advancements
export const createGlobalAdvancements = (
  directory,
  username,
  datpackName,
  description
) => {
  console.log(green("Generating Global Advancements..."));
  let currentDir = directory + "/global/advancements";

  //Root advancement
  mkdirSync(currentDir, { recursive: true });
  writeFileSync(
    currentDir + "/root.json",
    JSON.stringify(defaultRootAdvancement)
  );

  //Username Advancement
  defaultUsernameAdvancement.display.icon.nbt = `{SkullOwner: ${username}}`;
  defaultUsernameAdvancement.display.title = username;
  writeFileSync(
    currentDir + `/${username}.json`,
    JSON.stringify(defaultUsernameAdvancement)
  );

  //Datapack Advancement
  defaultDatapackAdvancement.display.title = datpackName;
  defaultDatapackAdvancement.display.description = description;
  defaultDatapackAdvancement.parent = `global:${username}`;
  writeFileSync(
    currentDir + `/${datpackName.replace(/ /g, "_").toLowerCase()}.json`,
    JSON.stringify(defaultDatapackAdvancement)
  );
}

//Creating minecraft/tags/functions for the tick and load functionality
export const createMinecraftTags = (directory, namespace) => {
  console.log(green("Generating Minecraft Tag Functions..."));

  let currentDir = directory + "/minecraft/tags/functions/";
  mkdirSync(currentDir, { recursive: true });

  namespaceMinecraftConfig.values = [namespace + ":load"];
  writeFileSync(
    currentDir + "load.json",
    JSON.stringify(namespaceMinecraftConfig)
  );

  namespaceMinecraftConfig.values = [namespace + ":main"];
  writeFileSync(
    currentDir + "tick.json",
    JSON.stringify(namespaceMinecraftConfig)
  );
}

export const createMainFunctionFolder = (
  directory,
  namespace,
  usingTemplate,
  templateData
) => {
  let currentDir = directory + `/${namespace}/`;
  mkdirSync(currentDir + "functions", {
    recursive: true,
  });

  if (!usingTemplate) {
    console.log(green("Generating Main Function files..."));
    writeFileSync(currentDir + "functions/main.mcfunction", "say main");
    writeFileSync(currentDir + "functions/load.mcfunction", "say load");
  } else {
    console.log(
      green("Generating Main Function files from Templates...")
    );
    templateData.forEach((mcfunction) => {
      let selectedFolder = currentDir + mcfunction.file_type + "/";
      let extension =
        mcfunction.file_type === "functions" ? ".mcfunction" : ".json";
      mkdirSync(selectedFolder, {
        recursive: true,
      });

      console.log(
        green(
          `\tGenerating ${mcfunction.file_type}/${mcfunction.file_name}${extension}`
        )
      );
      writeFileSync(
        selectedFolder + mcfunction.file_name + extension,
        mcfunction.content
      );
    });
  }
}
