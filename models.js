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
    await Product.create(product);
    console.log(`product ${product.name} created successfully`);
  } catch (error) {
    console.log('failed to create product', error);
  }
}

export async function readAllProducts() {
  try {
    const result = await Product.findAll();
    console.log('products: ', result);
  } catch (error) {
    console.log('failed to find product', error);
  }
}

export async function readByIdProduct(id) {
  try {
    const result = await Product.findByPk(id);
    console.log('product: ', result);
  } catch (error) {
    console.log('failed to find product', error);
  }
}

export async function updateProduct(id, dataProduct) {
  try {
    const result = await Product.update(dataProduct, { where: { id:id } });
    console.log('product updated successfully: ', result);
  } catch (error) {
    console.log('failed to update product', error);
  }
}

export async function deleteProduct(id) {
  try {
    const result = await Product.destroy({ where: { id:id } });
    console.log('product deleted successfully: ', result);
  } catch (error) {
    console.log('failed to delete product', error);
  }
}