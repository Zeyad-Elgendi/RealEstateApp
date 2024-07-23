const express = require('express')
const pool = require('./db')
const port = 3000

const app = express()
app.use(express.json())
//routes
app.get('/', async (req,res)=>{
    try{
        const data = await pool.query('SELECT id, name, address, price, downPayment, installmentYears FROM flats')
        res.status(200).send(data.rows)
    }catch(err){
        console.log(err)
        res.sendStatus(500)
    }
})
app.get('/flat/:id', async (req, res) => {
    const flatId = req.params.id;

    try {
        const data = await pool.query('SELECT * FROM flats WHERE id = $1', [flatId]);
        if (data.rows.length === 0) {
            return res.status(404).send('Flat not found');
        }
        res.status(200).send(data.rows[0]);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});
app.post('/', async (req, res) => {
    const {
        name, address, price, downPayment, installmentYears,
        area, reference_no, bedrooms, bathrooms, delivery_in,
        finishing, finished, compound, sale_type, finishing_type
    } = req.body;

    try {
        await pool.query(`
            INSERT INTO flats (
                name, address, price, downPayment, installmentYears,
                area, reference_no, bedrooms, bathrooms, delivery_in,
                finishing, finished, compound, sale_type, finishing_type
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
            [
                name, address, price, downPayment, installmentYears,
                area, reference_no, bedrooms, bathrooms, delivery_in,
                finishing, finished, compound, sale_type, finishing_type
            ]
        );
        res.status(200).send({ message: "Successfully added flat!" });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});
app.get('/setup',async(req,res)=>{
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Start a transaction

        await client.query(`
            CREATE TABLE IF NOT EXISTS flats (
              id SERIAL PRIMARY KEY,
              name VARCHAR(100),
              address VARCHAR(100),
              price INT,
              downPayment INT,
              installmentYears SMALLINT,
              area VARCHAR(255),
              reference_no VARCHAR(50),
              bedrooms INTEGER,
              bathrooms INTEGER,
              delivery_in DATE,
              finishing VARCHAR(255),
              finished BOOLEAN,
              compound VARCHAR(255),
              sale_type VARCHAR(255), 
              finishing_type VARCHAR(255)
            );
          `);

        const insertQuery = `
          INSERT INTO flats (
            name, address, price, downPayment, installmentYears, area, reference_no, bedrooms, bathrooms, delivery_in, finishing, finished, compound, sale_type, finishing_type
          ) VALUES
            ('Flat A', '123 Street A', 100000, 20000, 5, '120 sqm', 'REF123', 3, 2, '2023-12-01', 'Semi-finished', true, 'Compound A', 'Sale', 'Basic'),
            ('Flat B', '456 Street B', 150000, 30000, 10, '150 sqm', 'REF456', 4, 3, '2024-06-15', 'Finished', false, 'Compound B', 'Rent', 'Luxury'),
            ('Flat C', '789 Street C', 200000, 40000, 15, '180 sqm', 'REF789', 5, 4, '2025-01-30', 'Under Construction', false, 'Compound C', 'Sale', 'Premium')
        `;
        await client.query(insertQuery);

        await client.query('COMMIT'); // Commit the transaction
        res.status(200).send({ message: "Successfully created table and inserted dummy values!" });
    } catch (err) {
        await client.query('ROLLBACK'); // Rollback the transaction in case of an error
        console.log(err);
        res.sendStatus(500);
    } finally {
        client.release(); // Release the client back to the pool
    }
})
const setupDatabase = async () => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Start a transaction

        await client.query(`
            CREATE TABLE IF NOT EXISTS flats (
              id SERIAL PRIMARY KEY,
              name VARCHAR(100),
              address VARCHAR(100),
              price INT,
              downPayment INT,
              installmentYears SMALLINT,
              area VARCHAR(255),
              reference_no VARCHAR(50),
              bedrooms INTEGER,
              bathrooms INTEGER,
              delivery_in DATE,
              finishing VARCHAR(255),
              finished BOOLEAN,
              compound VARCHAR(255),
              sale_type VARCHAR(255), 
              finishing_type VARCHAR(255)
            );
        `);

        const insertQuery = `
            INSERT INTO flats (
              name, address, price, downPayment, installmentYears, area, reference_no, bedrooms, bathrooms, delivery_in, finishing, finished, compound, sale_type, finishing_type
            ) VALUES
              ('Flat A', '123 Street A', 100000, 20000, 5, '120 sqm', 'REF123', 3, 2, '2023-12-01', 'Semi-finished', true, 'Compound A', 'Sale', 'Basic'),
              ('Flat B', '456 Street B', 150000, 30000, 10, '150 sqm', 'REF456', 4, 3, '2024-06-15', 'Finished', false, 'Compound B', 'Rent', 'Luxury'),
              ('Flat C', '789 Street C', 200000, 40000, 15, '180 sqm', 'REF789', 5, 4, '2025-01-30', 'Under Construction', false, 'Compound C', 'Sale', 'Premium')
        `;
        await client.query(insertQuery);

        await client.query('COMMIT'); // Commit the transaction
        console.log("Successfully created table and inserted dummy values!");
    } catch (err) {
        await client.query('ROLLBACK'); // Rollback the transaction in case of an error
        console.log(err);
    } finally {
        client.release(); // Release the client back to the pool
    }
};
app.listen(port,() => {
    console.log(`Server has started on port: ${port}`);
    setupDatabase();
});

