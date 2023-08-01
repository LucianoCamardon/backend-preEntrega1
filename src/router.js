const productsController = require('./productsController')
const cartsController = require('./cartsController')

const router = app =>{
    app.use('/api/products', productsController);
    app.use('/api/carts', cartsController);
}

module.exports = router;