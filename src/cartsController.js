const { Router } = require('express');
const router = Router();
const fs = require('fs');

const getCarts = () => {
  const data = fs.readFileSync('./db/carrito.json', 'utf-8', (err, data) => {
    if (err) {
      console.log('Error al leer el archivo JSON mediante la función getCarts');
    }
  });
  return JSON.parse(data);
};

const saveCarts = (carts) => {
  fs.writeFileSync('./db/carrito.json', JSON.stringify(carts, null, 2), 'utf-8');
};

const createNewId = (carts) => {
  const maxId = carts.reduce((max, cart) => (cart.id > max ? cart.id : max), 0);
  return maxId + 1;
};

router.post('/', (req, res) => {
  const carts = getCarts();
  const newId = createNewId(carts);

  const newCart = {
    id: newId,
    products: [],
  };

  carts.push(newCart);
  saveCarts(carts);

  res.json({ message: `Nuevo carrito creado`, cart: newCart });
});

router.post('/:cid/product/:pid', (req, res) => {
    const carts = getCarts();
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const quantity = req.body.quantity || 1;
  
    const cart = carts.find((cart) => cart.id === cartId);
  
    if (!cart) {
      return res.status(404).json({ error: `No se encontró un carrito con la ID ${cartId}` });
    }
  
    const existingProduct = cart.products.find((product) => product.id === productId);
  
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      const newProduct = {
        id: productId,
        quantity: quantity,
      };
      cart.products.push(newProduct);
    }
  
    saveCarts(carts);
  
    res.json({ message: `Producto agregado al carrito`, cart: cart });
  });
  

router.get('/:cid', (req, res) => {
  const carts = getCarts();
  const cartId = parseInt(req.params.cid);

  const cart = carts.find((cart) => cart.id === cartId);

  if (!cart) {
    return res.status(404).json({ error: `No se encontró un carrito con la ID ${cartId}` });
  }

  res.json(cart.products);
});

router.post('/:cid/product/:pid', (req, res) => {
  const carts = getCarts();
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);
  const quantity = req.body.quantity || 1;

  const cart = carts.find((cart) => cart.id === cartId);

  if (!cart) {
    return res.status(404).json({ error: `No se encontró un carrito con la ID ${cartId}` });
  }

  const existingProduct = cart.products.find((product) => product.id === productId);

  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    const newProduct = {
      id: productId,
      quantity: quantity,
    };
    cart.products.push(newProduct);
  }

  saveCarts(carts);

  res.json({ message: `Producto agregado al carrito`, cart: cart });
});

module.exports = router;
