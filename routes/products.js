import express from 'express';

import { createProduct, getAllProducts, getByIdProduct, updateProduct, deleteProduct } from './../models.js';

export const productsRoutes = express.Router();

productsRoutes.get('/products', async (req, res, next) => {
  try {
    const response = await getAllProducts();

    res.statusCode = 200;

    res.send(response);

    return;
  } catch (error) {
    console.log('failed to find product', error);

    res.statusCode = 500;

    const response = {
      error: {
        message: `failed to find products`
      }
    };

    res.send(response);

    return;
  }
});

productsRoutes.get('/products/:id', async (req, res, next) => {
  const id = req.params.id;

  try {
    const response = await getByIdProduct(id);

    res.statusCode = 200;

    if (!response) {
      res.statusCode = 404;
    }

    res.send(response);

    return;
  } catch (error) {
    console.log('failed to find product', error);

    res.statusCode = 500;

    const response = {
      error: {
        message: `failed to find product ${id}`
      }
    };

    res.send(response);

    return;
  }
});

productsRoutes.post('/products', async (req, res, next) => {
  const product = req.body;

  res.statusCode = 400;

  if (!product?.name) {
    const response = {
      error: {
        message: 'the name attribute was not found. This is a required attribute.'
      }
    };

    res.send(response);

    return;
  }

  if (!product?.price) {
    const response = {
      error: {
        message: 'the price attribute was not found. This is a required attribute.'
      }
    };

    res.send(response);

    return;
  }

  try {
    const response = await createProduct(product);

    res.statusCode = 201;

    res.send(response);;

    return;
  } catch (error) {
    console.log('failed to create product', error);

    res.statusCode = 500;

    const response = {
      error: {
        message: `failed to create product ${product.name}`
      }
    };

    res.send(response);;

    return;
  }
});

productsRoutes.patch('/products/:id', async (req, res, next) => {
  const product = req.body;

  res.statusCode = 400;

  if (!product?.name && !product?.price) {
    const response = {
      error: {
        message: `No attributes were found.`
      }
    };

    res.send(response);

    return;
  }

  const id = req.params.id;
  try {
    const response = await updateProduct(id, product);

    res.statusCode = 200;

    res.send(response);

    return;
  } catch (error) {
    console.log('failed to update product', error);

    res.statusCode = 500;

    const response = {
      error: {
        message: `failed to update product ${id}`
      }
    };

    res.send(response);

    return;
  }
});

productsRoutes.delete('/products/:id', async (req, res, next) => {
  const id = req.params.id;

  try {
    const found = await deleteProduct(id);

    res.statusCode = 204;

    if (!found) {
      res.statusCode = 404;
    }

    res.send();

    return;
  } catch (error) {
    console.log('failed to delete product', error);

    res.statusCode = 500;

    const response = {
      error: {
        message: `failed to delete product ${id}`
      }
    };

    res.send(response);

    return;
  }
});