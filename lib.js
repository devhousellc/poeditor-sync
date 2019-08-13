#! /usr/bin/env node

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const request = require('request');
const downloadFile = require('download-file');

function getSettings(argv) {
  let argvSettings = _.find(argv, (a) => a.indexOf('--settings') >= 0) || '';

  let paramsString = argvSettings.split('=')[1];
  if (!paramsString) {
    paramsString = 'settings.json';
  }

  return require(path.resolve(process.cwd(), paramsString));
}

function parseProjects(argv) {
  const settings = getSettings(argv);
  let argvProjects = _.find(argv, (a) => a.indexOf('--projects') >= 0);
  if (!argvProjects) {
    return [];
  }

  let paramsString = argvProjects.split('=')[1];
  let paramsAr = paramsString ? paramsString.split(',') : [];

  return _.filter(settings.projects, (p) => paramsAr.indexOf(p.key) >= 0);
}

function exportTranslation(api_token, project, langCode, destination) {
  const req = {
    url: 'https://api.poeditor.com/v2/projects/export',
    body: `api_token=${api_token}&id=${project.id}&language=${langCode}&type=key_value_json`,
  };

  return makeRequest(req)
    .then((response) => {
      return response.body.result.url;
    })
    .then((url) => downloadFile(url, {
      directory: path.resolve(destination, project.path),
      filename: `${langCode}.json`
    }, (e) => {
      if (e) {
        console.log(e);
        throw e;
      }
    }));
}

function importTranslation(api_token, project, langCode, destination, overwrite = 0, syncTerms = 0) {
  const req = {
    url: 'https://api.poeditor.com/v2/projects/upload',
    formData: {
      api_token: api_token,
      id: project.id,
      language: langCode,
      updating: 'terms_translations',
      overwrite,
      sync_terms: syncTerms,
      file: {
        value: fs.createReadStream(path.resolve(destination, project.path, `${langCode}.json`)),
        options: {
          filename: `${langCode}.json`
        }
      }
    }
  };

  return makeRequest(req);
}

function makeRequest(req) {
  const defaultReq = {
    method: 'POST',
    json: true,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  };

  return new Promise((resolve, reject) => {
    request(_.merge(defaultReq, req), (err, res) => {
      if (err) {
        return reject(err);
      }

      resolve(res);
    });
  });
}

module.exports = {
  getSettings,
  parseProjects,
  exportTranslation,
  importTranslation,
};
