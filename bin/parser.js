

exports.parseMCTemplate = (text, namespace) => {
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

		if(!is_reading_content && line.startsWith("<===")) {
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
			console.log(templateObject);
			content = [];
			file_name = '';
			file_content = '';
			is_reading_content = false;
		}

	});

	return templateObject;
}
