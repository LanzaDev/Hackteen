import express from 'express';
import { createRequest, getAllRequests, getByIdRequest } from './../models.js';

export const requestsRoutes = express.Router();

requestsRoutes.post('/requests', async(req, res, next) => {
  const request = req.body;

  res.statusCode = 400;

  if (!request?.products || !request.products.length) {
    const response = {
      error: {
        message: `the 'products' attribute was not found. This is a required attribute`
      }
    };
    return res.send(response);
  }

  if (!request?.total_value || request.total_value <= 0) {
    const response = {
      error: {
        message: 'the total_value attribute was not found.'
      }
    };
    return res.send(response);
  }

  try {
    const response = await createRequest(request);
    res.status(201).send(response);
  } catch (error) {
    console.log('failed to create request', error);

    const response = {
      error: {
        message: `failed to create request`
      }
    };
    res.status(500).send(response);
  }
});

requestsRoutes.get('/requests', async(req, res, next) => {
  try {
      const response = await getAllRequests();
  
      res.statusCode = 200;
  
      res.send(response);
  
      return;
    } catch (error) {
      console.log('failed to find request', error);
  
      res.statusCode = 500;
  
      const response = {
        error: {
          message: `failed to find request`
        }
      };
  
      res.send(response);
  
      return;
    }
});

requestsRoutes.get('/requests/:id', async(req, res, next) => {
  const id = req.params.id;

  try {
    const response = await getByIdRequest(id);

    res.statusCode = 200;

    if (!response) {
      res.statusCode = 404;
    }

    res.send(response);

    return;
  } catch (error) {
    console.log('failed to find request', error);

    res.statusCode = 500;

    const response = {
      error: {
        message: `failed to find request ${id}`
      }
    };

    res.send(response);

    return;
  }
});
