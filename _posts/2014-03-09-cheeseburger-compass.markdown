---
title: "Cheeseburger Compass"
subtitle: "A handheld device to that navigates to flavor"
description: A GIS / python / raspberry pi collaboration!
featured_image: white-castle.jpg
tags: [Software Engineering, Projects]
---

### Work work...
My wife, Briana is a very talented Geographic Information Systems Analyst. That means she makes maps and massages geographic data to get clients information they needs about where in the world their projects are being undertaken.

One project involved assessing the surface area of all the parking lots belonging to a major national retailer. This project was seeded to her with some latitude/longitude pairs that were sometimes as far as a couple miles away from where the actual storefront was. This left her having to manually reconcile the addresses of these stores against where they actually were so they could go about measuring the surface area of this project.

After a few hours of going about this manually she wondered to herself if there was a better way. She brought the problem home, and she and I wrote a few lines of python that would take a spreadsheet of street addresses, send them off to [Google's Geocoding API](https://developers.google.com/maps/documentation/geocoding/start) and get back lat/longs that were basically exactly on the front doorstep of the address every time. Major improvement. Days of work saved.

### Play!
How could we use this for evil? We decided to try and make a standalone, offline hardware device that would aid you in locating the nearest cheeseburger wherever you were on the globe. Could we have done this with an iPhone and a quick search? Of course! Would that have been as much fun? Never! We had a trip to NYC coming up in a couple weeks and our hope was to take this thing out there, drop ourselves off in the middle of the city somewhere and make our way to a white castle with only a directional heading and a distance measurement.

![](/images/compass.gif)


### Scraping and Geocoding
In order for the gizmo to be able to point you in the delicious direction, it needed to know where the flavor was. We needed some data. Briana and I tried a few different methods to find lists of hamburger restaurants addresses, and ended up hacking little data spiders & scrapers for three major chains. We ran these address lists through the geocoder and voila, cheeseburger coordinates:
 * [Five Guys](https://github.com/madmao/castle-compass/blob/master/csv/Five%20Guys.csv) 1151 locations
 * [In n Out](https://github.com/madmao/castle-compass/blob/master/csv/In%20N%20Out.csv) 148 locations
 * [White Castle](https://github.com/madmao/castle-compass/blob/master/csv/White%20Castle.csv) 409 locations

Armed with latitudes and longitudes, we needed to work on our chassis.

### Hardware
If you don't know about [Adafruit Industries](https://www.adafruit.com/), you really should! Run by MIT hacker & engineer, Limor "Ladyada" Fried, Adafruit builds and sells small, re-mixable electronic components fashioned as creative and artistic ingredients. They even offer some ["sewable" arduino boards](https://www.adafruit.com/product/659) built for integration into fashion projects. It's so cool!

Anyway, for our little project, we wanted to whip the thing together quickly, so writing python for a raspberry pi seemed as low-friction as you could get. We also wanted to be mobile, so we needed some battery power. And we needed some kind of readout, so we picked a neat little LCD that had some buttons that you could hook into that allowed us to switch between restaurants.

#### Parts & Assembly
(Some of these have been updated to their more modern equivalents)
 * [Raspberry Pi 3 - Model B](https://www.adafruit.com/product/3055)
 * [Blue & White 16x2 LCD+Keypad Kit for Raspberry Pi](https://www.adafruit.com/product/1115)
 * [GPS Breakout Board](https://www.adafruit.com/product/746)
 * [Power Supply and Battery Charger](https://www.adafruit.com/product/2465)
 * [Lithium Ion Battery](https://www.adafruit.com/product/353)

Assembly was very easy enough: the LCD board was built as a 'shield' which means it essentially snaps right on top of the Raspberry Pi itself (the green PCB poking out under there.) The power supply and GPS module required some solder.

![](/images/hogan.jpg)

Notice the fine electrical tape flourishes, the professional quality soldered points on the charging board, and the disheveled wrapping of the power cord around the li-ions. With the battery folded under the PCBs, the damned thing looked like a bomb. The wifi dongle allowed us to remotely update the software during development, and was pulled for runtime.


### Software

Most of the software was glue, [open source available here](https://github.com/madmao/castle-compass). Adafruit provided easy-to-use python interfaces to the GPS, LCD and buttons. I did pull the hardware-dependent GPS polling off into a thread to stay out of the way of the display and input loops. 

I made some feeble attempts at calculating distance and bearing on a sphere. These are solved problems, though, so I ended up just doing some simple python transcriptions from stackoverflow.

The one little challenge that I couldn't find any easy drop-in was a simple conversion for degrees to cardinal direction.

```python
def bearing_to_cardinal(input_bearing):
    cardinals = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
    percentage_around = (float(input_bearing) / 360.0) + 0.03125
    if percentage_around > 1.0:
        percentage_around -= 1.0
    cardinal_index = int(percentage_around * len(cardinals))
    return cardinals[cardinal_index]
```

You would turn the finished product on by plugging in the power source from the battery, it would wait for a 3D GPS lock for about 30 seconds, then it would happily point you in the direction of the nearest selected restaurant, updating at about 10Hz as you moved around.

![](/images/white-castle.jpg)

No big deal!

### Tragic Death
I really enjoyed the ramshackle aesthetic of the device: wires and bulbous batteries, exposed PCB. It was fun to show off, but unfortunately it was not resistant to abuse. After a few days of carting it around caseless, the SD card slot on the pi got torqued off. We never got to take the project to the big city for the test drive we wanted.

```python
except KeyboardInterrupt:
    pi_log("  Cheeseburger\n    Shutdown!")
```

### Next one
The pi is power hungry, the battery we had was only good for maybe a couple of hours. For rev 2 I'd go lower power with an arduino solution. Databases of coordinates start to challenge storage in that context though. Maybe I should just ask google. ;) 