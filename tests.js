const convertSummonCommandToGiveCommand = (summonCommand, selector) => {
    const regex = /summon item ~ ~ ~ ({Item:{id:"(.*?)",Count:(.*?)b,tag:(.*?)}})/g;
    selector = selector || "@p";
    const match = regex.exec(summonCommand);
    try {
        const tags = match[1];
        console.log(tags);
        const tagsJson = JSON.parse(tags);
        console.log(tagsJson);


        if (itemNBT === "" || itemNBT === undefined) {
            return `give ${selector} ${normalizeMinecraftID(itemName)} ${itemCount}`;
        } else {
            return `give ${selector} ${normalizeMinecraftID(
                itemName
            )}${itemNBT} ${itemCount}`;
        }
    } catch (e) {
        console.log("Error: Syntax error in the summon command");
        return "ERROR";
    }
};

convertSummonCommandToGiveCommand("summon item ~ ~ ~ {Item:{id:\"\",Count:'1b',tag:{ench:[{id:16,lvl:1}]}}}");