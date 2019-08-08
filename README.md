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
            
            --settings='./settings.json' 		 absolute or relative path to the settings file. By default './settings'
            --projects=references,common 		 the project keys. By default all from config
            --overwrite 				 overwrite the translations on POEditor
            --sync 					 sync terms
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
## Configs
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
