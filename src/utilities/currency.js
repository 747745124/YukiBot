import events from 'events'
import cheerio from 'cheerio'
import axios from 'axios'

//return the conversion rate between 2 currencies
//request from google finance
//with control method
const CurrencyChecker = function (interval, proxies = null) {
    events.EventEmitter.call(this);
    this.interval = interval;
    this.proxies = proxies;

    this.start = function (curr_1, curr_2) {
        this.counter = 0;
        this.curr_1 = curr_1;
        this.curr_2 = curr_2;

        this.ticker = setInterval(() => {
            if (this.proxies) {
                this.currentProxy = proxies[this.counter % this.proxies.length];
            }
            else {
                this.currentProxy = null;
            }

            checkRate(this.curr_1, this.curr_2, this.currentProxy, (err, rate) => {
                if (err) {
                    this.emit('error', err);
                }
                else {
                    if (rate) {
                        this.emit('rate-found', rate)
                    }
                    else {
                        this.emit('no-rate-found', null);
                    }
                }
            });
            this.counter++;
        }, this.interval);
    }

    this.stop = function () {
        clearInterval(this.ticker);
    }
};

//check a conversion rate between 2 currencies
//single worker
//@params: {string} curr_1, curr_2
//@return {function(err,string)}
const checkRate = (curr_1, curr_2, proxy, cb) => {

    const url = 'https://google.com/finance/quote/' + curr_1.toUpperCase() + '-' + curr_2.toUpperCase();
    console.log(url)

    axios.get(url, {
        headers: {
            'Accept-Encoding': 'application/json',
            'Connection': 'keep-alive',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US;q=0.9,en;q=0.8',
        }
    }).then((res) => {

        const $ = cheerio.load(res.data);

        // console.log(`Axios got ${res.status}`);
        // console.log($)

        if ($('.fxKbKc').length === 0) {
            return cb(null, null);
        }
        else {
            const rate = $('.fxKbKc').text();
            console.log(rate);
            return cb(null, rate);
        }

    }).catch((err) => {
        console.log(err);
        return cb(err, null);
    })
};

CurrencyChecker.prototype.__proto__ = events.EventEmitter.prototype;

export { CurrencyChecker, checkRate };
