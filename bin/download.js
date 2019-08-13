#! /usr/bin/env node

const _ = require('lodash');
const colors = require('colors');
const lib = require('../lib');

if (_.find(process.argv, (arg) => arg === '--help')) {
  console.log(`
    usage: 
        
         poeditor-sync:download keys=[param]
        
    keys: 
        
        --settings='./settings.json' \t\t absolute or relative path to the settings file. By default './settings'
        --projects=references,common \t\t the project keys. By default all from config
  `);
  process.exit(0);
}

let projects = lib.parseProjects(process.argv);
let settings = lib.getSettings(process.argv);

projects = projects.length ? projects : settings.projects;

(async () => {
  const exportCallbacks = [];

  _.forEach(projects, (project) => {
    _.forEach(project.langCodes, (lang) => {
      const callback = () => {
        console.log(colors.blue(`Downloading translations: ${project.name} ${lang}.json`));

        return lib.exportTranslation(settings.api_token, project, lang, settings.dirName);
      };

      exportCallbacks.push(callback);
    });
  });

  for (const callback of exportCallbacks) {
    await callback();
    console.log(colors.green.underline('Done!'));
  }
})();
