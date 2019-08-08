# @Devhouse/poeditor-sync

##Install
For `yarn`
```
yarn add @Devhouse/poeditor-sync
```
Or `npm`
```
npm install @Devhouse/poeditor-sync --save-dev
```


## Usage

1) ###upload
    ```
    poeditor-sync:upload --help
    ```
    
    ```
    usage:
        
         poeditor-sync:download keys=[param]
        
    keys: 
        
        --settings='./settings.json' 		 Absolute or relative path to the settings file. By default './settings'
        --projects=references,common 		 The project keys. By default all from config
        --overwrite 			 0 | 1   Set it to 1 if you want to overwrite translations. By default 0
        --sync-terms 			 0 | 1   Set it to 1 if you want to sync your terms (terms that are not found in the uploaded file will be deleted from project and the new ones added). Ignored if updating = translations. By default 0
    ```
2) ###download
    ```
    poeditor-sync:dowload --help
    ```
    
    ```
    usage: 
        
         poeditor-sync:download keys=[param]
        
    keys: 
        
        --settings='./settings.json' 		 absolute or relative path to the settings file. By default './settings'
        --projects=references,common 		 the project keys. By default all from config
    ```
## Config example
```json
{
  "api_token": "your_poeditor-api-key",
  "dirName": "./",
  "projects": [
    {
      "id": 123123,
      "key": "common",
      "name": "The common translations",
      "langCodes": [
        "no", "sv", "en"
      ],
      "path": "i18n"
    }
  ]
}
```
