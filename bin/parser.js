
/**
 * 
 * @param {string} text the text to parse
 * @param {string} namespace namespace of the datapack
 * @returns the parsed .mclate file
 */
export const parseMCTemplate = (text, namespace) => {
	let file_content = text.split("\n");
	const title = (file_content[0] != "" ? file_content[0] : "UNDEFINED").replace("<###>", "");

	let templateObject = {
		'title': title,
		"files": []
	}

	let file_name = '';
	let content = [];
	let is_reading_content = false;

	file_content.forEach(line => {

		if (!is_reading_content && line.startsWith("<===")) {
			file_name = line.replace("<===", "");
			is_reading_content = true;
		}
		if (is_reading_content && !line.startsWith("===>") && !line.startsWith("<===")) {
			content.push(line);
		}
		if (is_reading_content && line.startsWith("===>")) {
			templateObject.files.push({
				'id': Date.now(),
				'file_name': file_name.trim().replace("<===", "").split(":")[1],
				'file_type': file_name.trim().replace("<===", "").split(":")[0],
				'content': content.join("\n").replace(/NAMESPACE/g, namespace)
			});

			content = [];
			file_name = '';
			file_content = '';
			is_reading_content = false;
		}

	});

	return templateObject;
}

/*
The file has this structure
S S S
S S S
S S S
---
S S S
S A S
S S S
---
S S S
S S S
S S S
===
S minecraft:stone
A minecraft:air
*/


/**
 * 
 * @param {string} text the text take from the structure templates folder
 * @returns {string} the setblock code for the structure
 */
export const parseStructureTemplate = (text) => {

	const splittedText = text.split("\n");
	const symbolsDictionary = getBlocksId(splittedText, splittedText.length - 1, []);
	let coords = {
		x: 0,
		y: 0,
		z: 0
	}

	let ignoreAll = false;

	let structure = "";

	splittedText.forEach(line => {

		if (line == "")
			return;

		if (line.startsWith("---")) {
			coords = { ...coords, y: coords.y + 1 };
			return;
		}

		if (line.startsWith("===")) {
			ignoreAll = true;
		}


		if (!ignoreAll) {
			structure += convertSymbolsIntoCommand(symbolsDictionary, coords, line) + "\n";
			coords = { ...coords, z: coords.z + 1 };
		}

	});

	return structure;
}

/**
 * 
 * @param {{x:number, y:number, z:number}} coords 
 * @param {string} id 
 * @returns 
 */
const createSetBlock = (coords, id) => {
	return `setblock ~${coords.x} ~${coords.y} ~${coords.z} ${id}`;
}

const convertSymbolsIntoCommand = (symbolsDictionary, coords, line) => {

	const splittedLine = line.trim().split(" ");

	let command = "";

	splittedLine.forEach((symbol, index) => {

		if (!symbolsDictionary[symbol])
			return;

		command += `${createSetBlock({ ...coords, x: coords.x + index }, symbolsDictionary[symbol])}\n\n`;
	});

	console.log("COMMAND")
	console.log(command);
	console.log("--------")

	return command;
}

/**
 * 
 * @param {string[]} lines 
 * @param {number} i
 * @param {{string, string}[]} blockIds
 * @returns {{string, string}[]} outputIds
 */
const getBlocksId = (lines, i, blockIds) => {

	if (i == 0)
		throw new Error("The file is not in the correct format");

	if (lines[i].startsWith("---")) {
		throw new Error("The file is not in the correct format");
	}

	if (lines[i].startsWith("==="))
		return blockIds;

	if (lines[i] == "")
		return getBlocksId(lines, i - 1, blockIds);

	const splittedLine = lines[i].trim().split(" ");
	blockIds[splittedLine[0]] = splittedLine[1];
	i--;
	return getBlocksId(lines, i, blockIds);
}
