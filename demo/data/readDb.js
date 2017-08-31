/**
 * Read json file
 *
 * @param {string} file
 * @param {function} callback
 */
function readJsonFile(file, callback) {
  let rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType('application/json');
  rawFile.open('GET', file, true);
  rawFile.onreadystatechange = () => {
    if (rawFile.readyState === 4 && rawFile.status === 200) {
      callback(rawFile.responseText);
    }
  };
  rawFile.send(null);
}

readJsonFile('../../demo/data/db.json', (data) => {
  window.localData = JSON.parse(data);
});
