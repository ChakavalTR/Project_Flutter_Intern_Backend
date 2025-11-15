function validateProductBody(body) {
    const errors = [];

    if (!body.PRODUCTNAME || body.PRODUCTNAME.trim() === '') {
        errors.push('PRODUCTNAME is required.');
    }
    const price = parseFloat(body.PRICE);
    if (isNaN(price) || price <= 0) {
        errors.push('PRICE must be a positive number.');
    }
    const stock = parseInt(body.STOCK, 10);
    if (isNaN(stock) || stock < 0) {
        errors.push('STOCK must be 0 or positive integer.');
    }

    return { isValid: errors.length === 0, errors, price, stock };
}

module.exports = { validateProductBody };
