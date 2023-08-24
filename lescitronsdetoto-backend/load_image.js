const fs = require('fs');
const pool = require('./queries/DBPool');

const loadImages = async () => {

    const productsResult = await pool.query(`SELECT product_id FROM product`);

    productsResult.rows.forEach(async row => {
        const productId = row.product_id;
        const imageName = row.product_id + '.jpg';
        console.log(`productId: ${productId}, imageName: ${imageName}`);
        const imageData = fs.readFileSync('./images/products/' + imageName);

        await pool.query(
            `UPDATE product SET image_content = $1, image_content_type = 'image/jpeg'
             WHERE product_id = $2`,
            [imageData, productId]
        );
    });

};
loadImages();
