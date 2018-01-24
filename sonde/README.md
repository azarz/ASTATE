# Sonde ASTATE

> Sonde de l'application météo ASTATE

## Prérequis

Pour fonctionner, la sonde a besoin d'une part :

 - d'une fausse station météo mettant à jour les données (fakesonde de Cédric Esnault)
 - d'une base de donnée pour stocker les informations (InfluxDB)

### Installation de fakesonde

``` bash
git clone https://gitlab.com/cedricici/fakesonde
cd fakesonde
npm install
```

### Installation de influxdb

``` bash
sudo apt install influxdb
```

## Installation

``` bash
https://github.com/azarz/ASTATE
cd ASTATE
cd sonde
npm install
```

## Lancement

Pour lancer l'application on a besoin de 4 terminaux :

 - Influxdb

``` bash
sudo -s
influxd
```

 - fakesonde (dans le dossier fakesonde)

``` bash
sudo -s
npm start
```

 - la sonde ASTATE (dans le dossier ASTATE/sonde)
``` bash
sudo -s 
node sonde.js
```

 - l'API ASTATE

``` bash
sudo -s
npm start
```

