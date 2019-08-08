#! /usr/bin/env node

const _ = require('lodash');
const colors = require('colors');
const lib = require('../lib');

if (_.find(process.argv, (arg) => arg === '--help')) {
  console.log(`
    usage:
        
         poeditor-sync:download keys=[param]
        
    keys: 
        
        --settings='./settings.json' \t\t Absolute or relative path to the settings file. By default './settings'
        --projects=references,common \t\t The project keys. By default all from config
        --overwrite \t\t\t 0 | 1   Set it to 1 if you want to overwrite translations. By default 0
        --sync-terms \t\t\t 0 | 1   Set it to 1 if you want to sync your terms (terms that are not found in the uploaded file will be deleted from project and the new ones added). Ignored if updating = translations. By default 0
  `);
  process.exit(0);
}

const overwrite = !!_.find(process.argv, (arg) => arg === '--overwrite') ? 1 : 0;
const syncTerms = !!_.find(process.argv, (arg) => arg === '--sync-terms') ? 1 : 0;
const projects = lib.parseProjects(process.argv);
const settings = lib.getSettings(process.argv);

(async () => {
  if (!projects.length) {
    console.log(colors.red.underline('You need to specify al least one project (e.i. --projects=marketplace,widget,references)'));
    return;
  }

  const importCallbacks = [];

  _.forEach(projects, (project) => {
    _.forEach(project.langCodes, (lang) => {
      importCallbacks.push(() => {
        console.log(colors.blue(`Import ${project.name} ${lang}`));

        return lib.importTranslation(settings.api_token, project, lang, settings.dirName, overwrite, syncTerms)
          .then((response) => console.log(colors.green(`Done`, response.body.result)));
      });
    });
  });

  for (const [ind, callback] of importCallbacks.entries()) {
    // Updates terms / translations - No more than one request every 30 seconds.
    const delay = ind === importCallbacks.length - 1 ? 0 : 30000;

    await new Promise((resolve) => {
      (async () => {
        let time = 30;
        let interval = setInterval(() => {
          process.stdout.write('Next request after: ' + time + ' \r');
          time--;
        }, 1000);

        await callback();
        setTimeout(() => {
          clearInterval(interval);
          resolve();
        }, delay);
      })();
    });
  }
})();
