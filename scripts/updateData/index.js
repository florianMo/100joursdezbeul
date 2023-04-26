import {join} from 'path';
import {extractAttacData} from './extractAttacData/extractAttacData.js';
import {backupFile, extractCSVData, saveData, saveJSONAsCSV} from './utils/files.util.js';

const scriptArgs = process.argv.slice(2);
const filename = scriptArgs[0];
const dataFile = join(process.cwd(), './src/lib/assets/data.json');
const ignoredDataFile = join(process.cwd(), './src/lib/assets/data-ignored.json');
const metadataFile = join(process.cwd(), './src/lib/assets/metadata.json');
const backupDataFile = join(process.cwd(), `data-${Date.now()}.bck.json`);
const attacCSV = join(process.cwd(), `attac-new-events.csv`);

async function run() {
  await backupFile(dataFile, backupDataFile);
  const data = await extractCSVData(filename);
  await saveData(dataFile, data.addedEvents);
  await saveData(ignoredDataFile, data.ignoredEvents);
  await saveData(metadataFile, {
    lastImport: new Date().toISOString(),
    validEvents: data.addedEvents.length,
    invalidEvents: data.ignoredEvents.length,
  });
  const attacData = await extractAttacData();
  saveJSONAsCSV(attacCSV, attacData);
}

await run();