import events from 'events'
import cheerio from 'cheerio'
import axios from 'axios'

process.env.UV_THREADPOOL_SIZE = 128;

const RestockChecker = function (interval, proxies = null) {
    events.EventEmitter.call(this);

    this.interval = interval;
    this.proxies = proxies;

    this.start = function (urls) {
        this.urls = urls;
        this.counter = 0;

        this.ticker = setInterval(() => {
            if (this.proxies) {
                this.currentProxy = proxies[this.counter % this.proxies.length];
            }
            else {
                this.currentProxy = null;
            }

            checkStock(this.urls, (err, product) => {
                if (err) {
                    this.emit('error', err);
                }
                else {
                    if (product) {
                        this.emit('stock-found', product)
                    }
                    else {
                        this.emit('no-stock-found', null);
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

const checkStock = (urls, cb) => {

    for (var url of urls) {
        axios.get(url, {
            headers: {
                'Accept-Encoding': 'application/json',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US;q=0.9,en;q=0.8',
            }
        }).then((res) => {
            const $ = cheerio.load(res.data);
            // console.log(`Axios got ${res.status}`);

            if ($('.add-to-cart-button').text() != 'Add to Cart') {
                return cb(null, null);
            }
            else {
                var product = {
                    name: null,
                    model: null,
                    price: null,
                    img: null,
                    url: url
                };
                product.name = $('.sku-title').text();
                product.model = $('.model .product-data-value').text();
                product.price = '$' + $('.priceView-hero-price [aria-hidden=true]').text().split('$')[1];
                product.img = $('img')[0].attribs.src
                return cb(null, product);
            }
        }).catch((err) => {
            console.log(err);
            return cb(err, null);
        })
    }
};

RestockChecker.prototype.__proto__ = events.EventEmitter.prototype;

export { RestockChecker };