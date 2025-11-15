const { getPool, sql } = require('../config/db');
const { validateProductBody } = require('../validators/productvalidator');

async function getAllProducts(req, res) {
    try {
        const pool = await getPool();
        const result = await pool.request().query('SELECT * FROM PRODUCTS');
        res.status(200).json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

async function getProductById(req, res) {
    try {
        const id = parseInt(req.query.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid id' });
        }

        const pool = await getPool();
        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM PRODUCTS WHERE PRODUCTID = @id');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(result.recordset[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

async function createProduct(req, res) {
    try {
        const { isValid, errors, price, stock } = validateProductBody(req.body);

        if (!isValid) {
            return res.status(400).json({ message: 'Validation failed', errors });
        }

        const name = req.body.PRODUCTNAME.trim();
        const pool = await getPool();
        const result = await pool
            .request()
            .input('name', sql.NVarChar(100), name)
            .input('price', sql.Decimal(10, 2), price)
            .input('stock', sql.Int, stock)
            .query(`
        INSERT INTO PRODUCTS (PRODUCTNAME, PRICE, STOCK)
        OUTPUT INSERTED.*
        VALUES (@name, @price, @stock)
      `);

        res.status(201).json(result.recordset[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

async function updateProduct(req, res) {
    try {
        const id = parseInt(req.query.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid id' });
        }

        const { isValid, errors, price, stock } = validateProductBody(req.body);
        if (!isValid) {
            return res.status(400).json({ message: 'Validation failed', errors });
        }

        const name = req.body.PRODUCTNAME.trim();
        const pool = await getPool();

        const existing = await pool
            .request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM PRODUCTS WHERE PRODUCTID = @id');

        if (existing.recordset.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .input('name', sql.NVarChar(100), name)
            .input('price', sql.Decimal(10, 2), price)
            .input('stock', sql.Int, stock)
            .query(`
        UPDATE PRODUCTS
        SET PRODUCTNAME = @name, PRICE = @price, STOCK = @stock
        OUTPUT INSERTED.*
        WHERE PRODUCTID = @id
      `);

        res.status(200).json(result.recordset[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

async function deleteProduct(req, res) {
    try {
        const id = parseInt(req.query.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid id' });
        }

        const pool = await getPool();
        const result = await pool
            .request()
            .input('id', sql.Int, id)
            .query(`
        DELETE FROM PRODUCTS
        OUTPUT DELETED.*
        WHERE PRODUCTID = @id
      `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
