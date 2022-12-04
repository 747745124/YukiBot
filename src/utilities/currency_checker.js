import { CurrencyChecker } from './currency.js';
function curr_checker(interval, callback) {
    var r = new CurrencyChecker(interval);//polling by minute

    r.on('rate-found', (rate) => {
        // console.log(rate);
        callback(rate);
    });

    r.on('error', (error) => { console.log(error); })

    r.start('USD', 'CNY');
}

export { curr_checker };