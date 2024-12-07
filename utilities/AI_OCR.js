const fs = require('node:fs')
async function query(filename) {
	const data = fs.readFileSync(filename);
	const response = await fetch(
		"https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large",
		{
			headers: {
				Authorization: "Bearer "+global.config.apikeys.huggingFace,
				"Content-Type": "application/json",
			},
			method: "POST",
			body: data,
		}
	);
	const result = await response.json();
	return result;
}

module.exports = query