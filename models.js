import Sequelize from 'sequelize';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './dev.db'
});

sequelize.authenticate();

export const Product = sequelize.define('product', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false
  }
});

export async function createProduct(product) {
  try {
    const result = await Product.create(product);
    console.log(`product ${result.name} created successfully`);
    return result;
  } catch (error) {
    console.log('failed to create product', error);
    throw error;
  }
}

export async function getAllProducts() {
  try {
    const result = await Product.findAll();
    console.log('products: ', result);
    return result;
  } catch (error) {
    console.log('failed to find product', error);
    throw error;
  }
}

export async function getByIdProduct(id) {
  try {
    const result = await Product.findByPk(id);
    console.log('product: ', result);
    return result;
  } catch (error) {
    console.log('failed to find product', error);
    throw error;
  }
}

export async function updateProduct(id, dataProduct) {
  try {
    const result = await Product.findByPk(id);
    if (result?.id) {
      for (const key in dataProduct) {
        if (key in result) {
          result[key] = dataProduct[key];
        }
      }
      result.save()
      console.log('product updated successfully: ', result);
    }
    return result;
  } catch (error) {
    console.log('failed to update product', error);
    throw error;
  }
}

export async function deleteProduct(id) {
  try {
    const result = await Product.destroy({ where: { id: id } });
    console.log('product deleted successfully: ', result);
  } catch (error) {
    console.log('failed to delete product', error);
    throw error;
  }
}

export const Request = sequelize.define('request', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  total_value: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
  }
});

export const ProductRequest = sequelize.define('product_request', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false
  }
});

Product.belongsToMany(Request, { through: ProductRequest });
Request.belongsToMany(Product, { through: ProductRequest });

export async function createRequest(newRequest) {
  try {
    const request = await Request.create({
      total_value: newRequest.totalValue,
      status: 'pending'
    });

    for (const prod of newRequest.products) {
      const product = await Product.findByPk(prod.id);
      if (product) {
        request.addProduct(product, { through: { quantity: prod.quantity, price: product.price } });
      }
    }

    console.log(`request created successfully`);
    
    return request;
  } catch (error) {
    console.log('failed to create request', error);
    throw error;
  }
}

export async function getAllRequests() {
  try {
    const result = await ProductRequest.findAll();
    console.log('requests: ', result);
    return result;
  } catch (error) {
    console.log('failed to find request', error);
    throw error;
  }
}

export async function getByIdRequest(id) {
  try {
    const result = await Request.findByPk(id);
    console.log('request: ', result);
    return result;
  } catch (error) {
    console.log('failed to find request', error);
    throw error;
  }
}