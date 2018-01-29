# HORDES

[![click to watch a hordes demo video](https://i.vimeocdn.com/video/606634311.webp)](https://vimeo.com/194627789?autoplay=true)
click to watch demo video.

This is an electronjs implementation of Hordes. Hordes is an rss aggregator with the goal of being a multi-media research and analysis toolset. This version of Hordes uses Mapbox, Leaflet, Node, jQuery and Json to create an interactive news environment. As such you will need a Mapbox account for Hordes to function. In addition there are some Twitter capabilities such as search and tweeting via python for which you will need a Twitter account and associated api keys, however, this is not a part of the distribution at the moment.

## Configure

This will eventually be done via a dialogue on first run but for now you must manually configure hordes. 
1. Download and unzip [hordes.zip](https://hordes.info/hordes.zip) into your user's Home directory.
2. Inside the hordes directory you'll find four files: hordes_sources.json, config.json, hordes_settings.txt, keywords.txt.
3. Open config.json in a text editor and configure your mapbox api credentials.
```json
	[
	  {
	    "mapboxAcct":"https://api.mapbox.com/styles/v1/your-mapbox-user-name",
	    "mapboxToken":"your-mapbox-token",
	    "mapboxId":"your-mapbox-id",
	    "mapboxThemes":[
		  {"name":"Dark","key":"your-tileset-key","icon":"dark.png"},
		  {"name":"Streets","key":"your-tileset-key","icon":"streets.png"},
		  {"name":"Light","key":"your-tileset-key","icon":"light.png"},
		  {"name":"Outdoors","key":"your-tileset-key","icon":"outdoors.png"},
		  {"name":"SatelliteStreets","key":"your-tileset-key","icon":"satellite.png"},
		  {"name":"Bright","key":"your-tileset-key","icon":"bright.png"},
		  {"name":"CaseFile","key":"your-tileset-key","icon":"CaseFile.png"}
		]
	  }
	]
```

## To Use

There are some dependencies you will need for certain features as well as basic operation.

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository anywhere on your computer
git clone https://github.com/hordes/hordes
# Go into the repository
cd hordes
# Install node dependencies
npm install
```

After all of that is complete just start:
```bash
# run the app
npm start
```

## new in v0.4
* load news sources via local json config
* prefetch latest data from all sources
* keywords
* search each node rss for keywords
* make media available for active node
* live & scheduled audio
* open story in default browser
* pin news source to map
* summarize source on pin click
* location search tools
* owner property
* priority property
* email property
* change map style

## future ideas
* twitter bot/search
* search engine integration
* save notebook
* compare node keyword matches
* relational notes across sources
* pin stories which occur in several nodes if beyond threshold & in keywords list
* search for live video from current source
* integrate Firefox plugin
* dynamic source granularity based on zoom index
* add source priority property for dynamic sources
* edit config dialogue
* user add event pin
* user add source
* optional location based sources ("News near me")
* rate source
* cli tools
* user defined themes
* create/edit keyword lists dialogue
* generate report
* data visualization (charts, graphs etc)
* collaboration tools (chat,sources,notes)

#### License [CC0 (Public Domain)](LICENSE.md)
