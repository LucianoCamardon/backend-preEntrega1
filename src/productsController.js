const { Router } = require('express');
const router= Router();
const fs = require('fs');
    
const getProducts = () => {
    const data = fs.readFileSync('./db/products.json', 'utf-8', (err,data)=>{
    if(err){Console.log('Error a leer json mediante funcion getProducts')}
    });
    return JSON.parse(data);
};

const saveProduct = (products) => {
    fs.writeFileSync('./db/products.json', JSON.stringify(products, null, 2), 'utf-8');
};

const createNewId = (products) =>{
    const maxId = products.reduce((max,product)=>(product.id>max ? product.id:max),0);
    return maxId +1;
}

router.get('/', (req, res)=>{
    fs.readFile('./db/products.json', 'utf-8',(err,data)=>{
        if(err){
            res.json('Error al leer el json')
        }
        const products = JSON.parse(data)

         const limit = parseInt(req.query.limit);
        if(!isNaN(limit)){
            return res.json(products.slice(0, limit))
        }else{
            return res.json(products);
        }
    })
})

router.get('/:id', (req, res) => {
    fs.readFile('./db/products.json', 'utf-8', (err, data) => {
    if (err) {
        res.json({ error: 'Error al leer el archivo JSON' });
        return;
    }
    
    const products = JSON.parse(data);
    const idToFind = parseInt(req.params.id);
    const productFound = products.find((product) => product.id === idToFind);
    
    if (productFound) {
        res.json({ message: productFound });
    } else {
        res.json({ error: `No se encontró un producto con la id ${idToFind}` });
    }
    });
});
 
router.post('/', (req, res)=>{
    const products = getProducts();
    const{ product, stock, price } = req.body;
    const newId = createNewId(products);

    const newProduct={  
        product,
        stock,
        price,
        id : newId,
    }
        
    products.push(newProduct);
    saveProduct(products);

    res.json({ message: `Añadido el producto: ${newProduct.product}`})
})

router.put('/:id', (req, res)=>{
    const idToFind = parseInt(req.params.id);
    const products = getProducts();
    const { product, stock, price } = req.body;

    const productToUpdate = data.find((product)=>{product.id===idToFind})
        
    productToUpdate.product = product || productToUpdate.product;
    productToUpdate.stock = stock || productToUpdate.stock;
    productToUpdate.price = price || productToUpdate.price;

    saveProduct(products);
    res.json({message: `Producto ${idToFind} actualizado`})
})

router.delete('/:id', (req, res) => {
    const products = getProducts();
    const productId = parseInt(req.params.id);
      
    const productIndex = products.findIndex((product) => product.id === productId);
      
    if (productIndex === -1) {
      return res.status(404).json({ error: `No se encontró un producto con la ID ${productId}` });
    }
      
    const deletedProduct = products.splice(productIndex, 1);
      
    saveProduct(products);
    res.json({ message: `Producto eliminado`, product: deletedProduct[0] });
});



module.exports = router;