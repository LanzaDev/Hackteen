import { createProduct, getAllProducts, getByIdProduct, updateProduct, deleteProduct } from './models.js';

export default async function route(req, res, data) {
  res.setHeader('Content-Type', 'application/json', 'utf-8');

  if (req.method === 'GET' && req.url === '/') {
    const { content } = data;

    res.statusCode = 200;

    const response = {
      message: `${content} get`
    };

    res.end(JSON.stringify(response));

    return;
  }

  if (req.method === 'GET' && req.url === '/products') {
    try {
      const response = await getAllProducts();
      
      res.statusCode = 200;
      
      res.end(JSON.stringify(response));
      
      return;
    } catch (error) {
      console.log('failed to find product', error);
      
      res.statusCode = 500;
      
      const response = {
        error: {
          message: `failed to find products`
        }
      };
      
      res.end(JSON.stringify(response));
      
      return;
    }
  }

  if (req.method === 'GET' && req.url.split('/')[1] === 'products' && !isNaN(req.url.split('/')[2])) {
    const id = req.url.split('/')[2];

    try {
      const response = await getByIdProduct(id);
      
      res.statusCode = 200;

      if (!response) {
        res.statusCode = 404; 
      }

      res.end(JSON.stringify(response));
      
      return;
    } catch (error) {
      console.log('failed to find product', error);
      
      res.statusCode = 500;
      
      const response = {
        error: {
          message: `failed to find product ${id}`
        }
      };

      res.end(JSON.stringify(response));
  
      return;
    }
  }

  if (req.method === 'POST' && req.url === '/products') {
    const body = [];

    req.on('data', (part) => {
      body.push(part);
    });

    req.on('end', async() => {
      const product = JSON.parse(body);
  
      res.statusCode = 400;

      if (!product?.name) {
        const response = {
          error: {
            message: 'the name attribute was not found. This is a required attribute.'
          }
        };

        res.end(JSON.stringify(response));
  
        return;
      }

      if (!product?.price) {
        const response = {
          error: {
            message: 'the price attribute was not found. This is a required attribute.'
          }
        };

        res.end(JSON.stringify(response));
  
        return;
      }

      try {
        const response = await createProduct(product);

        res.statusCode = 201;

        res.end(JSON.stringify(response));
  
        return;
      } catch (error) {
        console.log('failed to create product', error);
        
        res.statusCode = 500;
        
        const response = {
          error: {
            message: `failed to create product ${product.name}`
          }
        };
        
        res.end(JSON.stringify(response));
        
        return;
      }
    });

    req.on('error', (error) => {
      console.log('failed to process the request', error);
    
      res.statusCode = 400;
    
      const response = {
        error: {
          message: 'failed to process the request'
        }
      };
      
      res.end(JSON.stringify(response));
      
      return;
    });
    
    return;
  }

  if (req.method === 'PATCH' && req.url.split('/')[1] === 'products' && !isNaN(req.url.split('/')[2])) {
    const body = [];

    req.on('data', (part) => {
      body.push(part);
    });

    req.on('end', async() => {
      const product = JSON.parse(body);
  
      res.statusCode = 400;

      if (!product?.name && !product?.price) {
        const response = {
          error: {
            message: `No attributes were found.`
          }
        };

        res.end(JSON.stringify(response));
  
        return;
      }
      
      const id = req.url.split('/')[2];
      try {
        const response = await updateProduct(id, product);

        res.statusCode = 200;
            
        res.end(JSON.stringify(response));
  
        return;
      } catch (error) {
        console.log('failed to update product', error);
        
        res.statusCode = 500;
  
        const response = {
          error: {
            message: `failed to update product ${product.name}`
          }
        };
  
        res.end(JSON.stringify(response));
        
        return;
      }
    });
    req.on('error', (error) => {
      console.log('failed to process the request', error);
    
      res.statusCode = 400;
    
      const response = {
        error: {
          message: 'failed to process the request'
        }
      };
      
      res.end(JSON.stringify(response));
      
      return;
    });
    
    return;
  }

  if (req.method === 'DELETE' && req.url.split('/')[1] === 'products' && !isNaN(req.url.split('/')[2])) {
    const id = req.url.split('/')[2];

    try {
      const found = await deleteProduct(id);

      res.statusCode = 204;
            
      if (!found) {
        res.statusCode = 404;
      }

      res.end();
      
      return;
    } catch (error) {
      console.log('failed to delete product', error);
      
      res.statusCode = 500;
      
      const response = {
        error: {
          message: `failed to delete product ${id}`
        }
      };
      
      res.end(JSON.stringify(response));
      
      return;
    }
  }

  res.statusCode = 404;

  const response = {
    error: {
      message: 'route not found',
      url: req.url
    }
  };

  res.end(JSON.stringify(response));
}