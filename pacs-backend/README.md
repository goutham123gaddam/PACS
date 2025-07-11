# dicomweb-pacs

An easy to use PACS with DICOMWEB and DIMSE service support

## Description
* A nodejs tool to easily spawn a PACS server including DICOM viewer connected via DICOMWEB (QIDO-RS and WADO-RS).
* Comes preinstalled with the popular [OHIF DICOM Web Viewer](https://github.com/OHIF/Viewers) (version 3.7.0).
* Supports OHIF MPR (vtk.js) feature for viewing volumetric datasets
* multithreaded
* sqlite backend

No need for a server, try the [standalone desktop edition](https://github.com/knopkem/pacsnode).

## Prerequisite

* nodejs 12 or newer

## Setup Instructions - npm

* install in empty directory:  
  ```npm init -y```  
  ```npm install dicomweb-pacs```

* update config file located in:  
  ```./node_modules/dicomweb-pacs/config```

* start pacs:  
  ```npx dicomweb-pacs```

## Setup Instructions - source

* clone repository and install dependencies  
  ```npm install```

* update config file located in:  
  ```./config```

* run:  
  ```npm start```

* import DICOM images: use any c-store-scu to push to internal store-scp  
  ```(AET: DICOMWEB_PACS   port: 8888)```

* (or use internal store-scu): put DICOM into import directory and run  
  ```npm run import``` (server needs to be running)

* open webbrowser and start viewing  
  ```http://localhost:5001```

## What to modify

* (optional) change our port or AET 

  ```
    config.source = {
      aet: "OUR_AET",
      ip: "OUR_IP",
      port: "OUR_PORT"
    };
    ```

* add peers to your PACS

  ```
    config.peers = [
    {
      aet: "PEER_AET",
      ip: "PEER_IP",
      port: "PEER_PORT"
    }];
    ```

* update webserver port:  
  ```config.webserverPort = 5001;```

## License
MIT


## server 1 -- name =  node_api_server
1. Has Node api server running on port 4000. for Database & regulat application flow & integrates with frontend
2. Has Dicom server running on port 8891. for viewer apis
3. Has logic to restart server on max connections error.
.env -- APP_TYPE="NODE_SERVER"  config.js -- dicom_port = 8891 No HL7.

## server 2 -- name =  fyzks_dicom_server
1. Has dicom server running on port 8890 to communicate with modalitites
2. Has HL7 server running on port 7777  to integrate with HIS
3. Has node api server running on port 4001 - currently unused
4. Has a file-watcher & exceutes python script to read new studies.
.env -- APP_TYPE="DICOM_HL7"  config.js -- dicom_port = 8890 .

Both servers conenct to the same dicom data folder & database.

## python server -- 
1. A custom script to fetch previous studies of patient belonging to new order from HIS into the new PACS server.
cmd to execute: python-local\python.exe new-server-push-service\push_to_pacs_api_combined.py


