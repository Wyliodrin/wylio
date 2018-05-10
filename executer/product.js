const productApi = require ('../utils/api').products;
const Table = require ('cli-table');
exports.provision = async function (argv){
    params = {
        clusterId: argv.clusterId,
        type: argv.type,
        shell: argv.shell,
        name: argv.name,
        platform: argv.platform,
        serial: argv.serial
    }
    if (argv.publicKey && argv.privateKey){
        params.key = {
            public: argv.publicKey,
            private: argv.privateKey
        }
    }
    if (argv.longitude || argv.latitude || argv.altitude){
        params.location = {
            lon: argv.longitude,
            lat: argv.latitude,
            alt: argv.altitude
        }
    }
    let response = await productApi.provision (params);
    if (response)
        console.log ('Product successfully provisioned.');
    else
        console.log ('Could not provision product');
};

exports.list = async function (argv){
    let products = await productApi.list (argv.cluster_id);
    if (products && products.length > 0){
        let table = new Table({
            head: ['Name', 'Id', 'Type', 'Status', 'Registered']
        });
        for (product of products){
           table.push ([product.name, product.productId, product.type, product.status, product.registerType]);
        }
        console.log (table.toString());
    }
    else
        console.log ('No products to display.');
};

exports.get = async function (argv){
    let product = await productApi.get (argv.product_id);
    if (product){
      console.log (JSON.stringify (product, null, 3));
    }
    else
        console.log ('Product not found.');
};

exports.delete = async function (argv){
    let response = await productApi.delete (argv.product_id);
    if (response){
      console.log ('Product deleted successfully.');
    }
    else
        console.log ('Could not delete product.');
};

exports.schedule = async function (argv){
    let response = await productApi.schedule({
        productId: argv.product_id,
        action: argv.action});
    if (response){
      console.log ('Action scheduled successfully.');
    }
    else
        console.log ('Could not schedule action for product.');
};

exports.unschedule = async function (argv){
    let response = await productApi.unschedule({
        productId: argv.product_id,
        action: argv.action});
    if (response){
      console.log ('Action unschedule successfully.');
    }
    else
        console.log ('Could not unschedule action for product.');
};

exports.edit = async function (argv){
    let params = {
        productId: argv.product_id,
        name: argv.name,
        hardware: argv.hardware,
        shell: argv.shell
    };

    if (argv.longitude || argv.latitude || argv.altitude){
        params.location = {
            lon: argv.longitude,
            lat: argv.latitude,
            alt: argv.altitude
        }
    }

    if ((argv.updateCluster != undefined) || argv.updateHours || argv.updateFrom || argv.updateTo){
        params.update = {
            useCluster: argv.updateCluster,
            betweenHours: argv.updateHours,
            from: argv.updateFrom,
            to: argv.updateTo,
            interval: argv.updateInterval
        }
    }
   // console.log (params);
    let response = await productApi.edit (params);
    if (response){
        console.log ('Product successfully updated.');
    }
    else{
        console.log ('Could not update product.');
    }
};

exports.getJson = async function (argv){
    let file = await productApi.getWyliodrinJSON (argv.productId);
    if (file)
        console.log (JSON.stringify (file, null, 3));
    else
        console.log ('Could not get file.');
};

exports.addScript = async function (argv){
    let scripts = {};
    scripts[argv.name] = argv.command;
    let params = {
        productId: argv.productId,
        scripts: scripts
    }

    let response = await productApi.edit (params);
    if (response)
        console.log ('Script added successfully.');
    else
        console.log ('Could not add script to product.');
};

exports.deleteScript = async function (argv){
    let scripts = {};
    scripts[argv.name] = '';
    let params = {
        productId: argv.productId,
        scripts: scripts
    }

    let response = await productApi.edit (params);
    if (response)
        console.log ('Script removed successfully.');
    else
        console.log ('Could not remove script from product.');
};
