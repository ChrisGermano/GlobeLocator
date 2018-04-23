# GlobeLocator
Translate lat/long coordinates to points on an animated 3D sphere with D3.js

Still in early stages, the goal of this project is to develop a lightweight and versatile "global presence map" of sorts.


## Changelog

### v0.0.2

Significant update. Developed and integrated a system for tracking Twitter sentiment analysis from tweet content and pulling public location data, geocoding it, and saving it in a local csv for the existing system to read from. Operation no longer requires manual file manipulation.

```
npm run main [keyword] [max-results]
```

This will generate a new file in /searches. <b>Running a search will wipe previous data!</b> Create a new config.json from the template to use.


### v0.0.1

Developed the ability to plot lat/long coordinates on a simulated 3D globe, powered by D3.js and a couple third party micro-libraries to handle the math. Data has to be manually imported as csv and the columns must be in the order of long|lat|name, although name isn't currently used.


#### Developed for and during Digital Surgeons' FizzBuzz Fridays
