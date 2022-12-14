## YukiBot:

YukiBot is a bot project based on `discord.js`. Several features will be implemented for YukiBot such as restock tracking, currency converter, music player, mini-games etc.



### To Use:

1. Set up Discord Bot through Discord developer portal.

2. Create a `.env` file at the root directory.

```pseudocode
YUKI_BOT_TOKEN=YOUR TOKEN
LOBBY_ID=YOUR THREAD ID FOR ITEM TRACKING
STOCK_ID=YOUR THREAD ID FOR 4090 TRACKING
SPOTIFY_TOKEN=YOUR SPOTIFY APPLICATION ID
SPOTIFY_SECRET=YOUR SPOTIFY APPLICATION SECRET
```

3. Run node.js command to host the bot or use web host service like Heroku.



### Features Implemented:

* ##### RTX 4090 Tracking (items from Best Buy only for now). 

  * Bot will send an alert on any RTX 4090 available on Best Buy.
    * I have already got one.
    * Polling on every minute
  
  * You can modify it to any item from BestBuy
  * 3080 Ti for demonstration as 4090s were rare to see.
  
  <img src="/Users/naoyuki/Library/Application%20Support/typora-user-images/image-20221214172316501.png" alt="image-20221214172316501" style="zoom:50%;" />



* ##### Currency Conversion (Slash Command)

  * Bot will send an alert on certain CNY-USD conversion rate
    * Polling on every 6 hrs

  * User can use slash command to search a conversion rate between two currencies

  <img src="https://live.staticflickr.com/65535/52563903731_7aa7b52fc6_o.png" alt="image-20221214172229387" style="zoom:50%;" />

  

* ##### Play Music (Slash Command)

  * Use Spotify API to search a track by title and artist
    * Song name is required, artist is optional.


  <img src="https://live.staticflickr.com/65535/52563440822_fd48a0d922_o.png" alt="image-20221214141032125" style="zoom: 50%;" />

  

* ##### Thanos (Slash Command)

  * Randomly timeout a user for a random period of time.
    * Like the one in MCU (Though it should be eliminate half of the population)


<img src="https://live.staticflickr.com/65535/52564359405_7aed19d25f_o.png" alt="image-20221214172128860" style="zoom:50%;" />



### Functions:

#### checker (interval, callback)

>  /src/utilities/4090_checker.js

On available item tracked, the bot will send a formatted message to the thread (STOCK_ID).

* Interval: polling interval

* Callback: user-defined function to handle tracked product.

  * product: JSON object

    * name
    * price
    * model
    * img
    * url

    

#### Modify:

To modify the items being tracked on Best Buy, modify the variable `urls` in the `checker` function. Note that this function only works with Best Buy links for now.



#### SAMPLE USAGE:

```javascript
// code below set a tracker for RTX 4090 with 60s polling interval
// on available item tracked, the bot will send a message to a specified thread
const channel = client.channels.cache.get(process.env.STOCK_ID)
let message = {}
checker(60000, (product) => {
    message = product
    channel.send(
        ' :alarm_clock: *New Stock on Best Buy Now Available!*:alarm_clock:'
    )
    channel.send(
        { embeds: [formatter(message)] }
    );
});
```



#### curr_checker (interval, callback)

>/src/utilities/currency_checker.js

On user-specified currency conversion rate found, the bot will send a formatted message to the thread (LOBBY_ID). By deafult, the currency checker will track the conversion rate between CNY and USD.

* Interval: polling interval

* Callback: user-defined function to handle conversion rate
  * conversion rate:
    * Float



#### Modify:

To modify the tracked conversion rate, set the arguments in this line. `r.start('USD', 'CNY')` 



#### SAMPLE USAGE:

```javascript
//curr_1,curr_2,proxy,callback
//rate: conversion rate between curr_1 and curr_2
//Note: curr_1 and curr_2 should be in the form of 3 capital letter, e.g. USD, GBP, CNY, JPY.

checkRate(curr_1, curr_2, null, (err, rate) => {
    if (err)
        console.log(err);
    else if (rate == null)
        interaction.reply({ content: 'Not rate found, check with your input.' })
    else {
        interaction.reply({ content: 'Result:' })
        channel.send(
            `The rate from ${curr_1} to ${curr_2} is ${rate} at ${new Date()}`
        )
    }
})
```



#### Music_API_Controller()

> /src/utilities/get_music_from_spotify.js

`track_searcher` searches a track on user specified artist and song_name, returns a Spotify link. Since Spotify uses OAuth 2.0 for API authentication, a `get_token` method is used to retrieve the access token from Spotify. 



#### SAMPLE USAGE:

```javascript
//track_searcher returns the link of the song
//token returns the access token
//Spotify clientID and clientSecret Required. (Specified .env file)
const music_player = Music_API_Controller
const token = await music_player.get_token()
const track = await music_player.track_searcher(token, song_name, artist_name)
```



### To Do:

* Unit testing
* Disable / Enable certain features by setting up config file
* Code Refactor
  * Slash commands separately stored in files
* Use ChatGPT API to reply smartly
* Mini games implementation
* Host YukiBot on web service