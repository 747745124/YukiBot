import { RestockChecker } from './restock.js';

function checker(interval, callback) {
    var r = new RestockChecker(interval);//polling by minute

    r.on('stock-found', (product) => {
        product.timestamp = new Date().toLocaleString() + ' PST';
        console.log(product);
        callback(product);
    });

    r.on('error', (error) => { console.log(error); })

    var urls = [
        'https://www.bestbuy.com/site/gigabyte-nvidia-geforce-rtx-4090-gaming-oc-24gb-gddr6x-pci-express-4-0-graphics-card-black/6521518.p?skuId=6521518',
        'https://www.bestbuy.com/site/msi-nvidia-geforce-rtx-4090-gaming-trio-24g-24gb-ddr6x-pci-express-4-0-graphics-card/6522371.p?skuId=6522371',
        'https://www.bestbuy.com/site/nvidia-geforce-rtx-4090-24gb-gddr6x-graphics-card-titanium-and-black/6521430.p?skuId=6521430',
        'https://www.bestbuy.com/site/msi-nvidia-geforce-rtx-4090-suprim-liquid-x-24g-24gb-ddr6x-pci-express-4-0-graphics-card/6522334.p?skuId=6522334',
        'https://www.bestbuy.com/site/asus-nvidia-geforce-rtx-4090-tuf-24gb-gddr6x-pci-express-4-0-graphics-card-black/6524436.p?skuId=6524436',
        'https://www.bestbuy.com/site/pny-nvidia-geforce-rtx-4090-24gb-gddr6x-pci-express-4-0-graphics-card-with-triple-fan-black/6522679.p?skuId=6522679',
        'https://www.bestbuy.com/site/asus-nvidia-geforce-rtx-4090-24gb-gddr6x-pci-express-4-0-strix-graphics-card-black/6524435.p?skuId=6524435',
        'https://www.bestbuy.com/site/gigabyte-nvidia-geforce-rtx-4090-windforce-24gb-gddr6x-pci-express-4-0-graphics-card-black/6521517.p?skuId=6521517',
    ]

    r.start(urls);
}

export { checker };