import { writeFile as _writeFile, existsSync, readFileSync } from "fs";

const writeFile = (documents, filepath, readable = false) => {
  _writeFile(filepath, JSON.stringify(documents,  null, readable ? "\t" : null), err => {
    if (err) console.log("Error writing file:", err);
  });
}

const urlToSafeFilename = (url) => {
  // Remove protocol and domain (if present)
  let filename = url.replace(/^(?:\/\/|[^/]+)*\//, '');

  // Replace unsafe characters with underscores
  filename = filename.replace(/[\/=?&]/g, '_');

  // Limit the length of the filename
  const maxLength = 300; // Example maximum length
  if (filename.length > maxLength) {
      filename = filename.substring(0, maxLength);
  }

  return filename;
}

async function read(endpoint){
  const filename = urlToSafeFilename(endpoint)
  const filepath = `./cached/${filename}.json`
  try {
      // Check if the file exists
      if (existsSync(filepath)) {
          // Read the file synchronously
          const jsonData = readFileSync(filepath, 'utf8');
          return jsonData;
      } else {
          // If the file does not exist, return false
          return false;
      }
  } catch (err) {
      // If an error occurs during file reading or parsing, return false
      console.error('Error reading JSON file:', err);
      return false;
  }
}

function write(endpoint, data){
  const filename = urlToSafeFilename(endpoint)
  const filepath = `./cached/${filename}.json`
  writeFile(data, filepath)
}

export default { write, read }