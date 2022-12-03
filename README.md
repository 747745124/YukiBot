## YukiBot:

YukiBot is a bot project based on `discord.js`. I am going to implement several features for YukiBot such as stock tracking, mini-games etc..



### To Use:

1. Set up Discord Bot through Discord developer portal.

2. Create a `.env` file at the root directory.

```pseudocode
YUKI_BOT_TOKEN=YOUR TOKEN
LOBBY_ID=YOUR THREAD ID FOR ITEM TRACKING
STOCK_ID=YOUR THREAD ID FOR 4090 TRACKING
```

3. Run node.js command to host the bot 



### Features Implemented:

#### checker (interval, callback)

>  /src/4090_checker.js

RTX 4090 Tracking (items from Best Buy only for now). On available item tracked, the bot will send a formatted message to the thread (STOCK_ID).

* Interval: polling interval

* Callback: user-defined function with tracked product.

  * product: JSON object

    * name
    * price
    * model
    * img
    * url

    

##### Modify:

To modify the items being tracked on Best Buy, modify the variable `urls` in the `checker` function. Note that this function only works with Best Buy links for now.



##### SAMPLE USAGE:

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





### To Do:

* Unit testing
* Mini games implementation
* Slash Commands etc.
* Host YukiBot on a server.