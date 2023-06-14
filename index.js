const express = require('express');
const mysql = require('mysql');

const app = express();
app.use(express.json()); 

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'sheetal',
    connectionLimit: 10,
    insecureAuth: true
});

// GET API - Retrieve all records
app.get('/records', (req, res) => {
    const query = `
      SELECT r.id, r.department, r.roll, r.shift, r.brandSD, r.deviceDate, r.engineerName, r.inChargeName, i.itemName, i.unit, i.code, i.timeValue
      FROM records AS r
      JOIN items AS i ON r.id = i.recordId
    `;
    pool.query(query, (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Error retrieving records from database' });
      } else {
        // Group the items by record ID
        const recordsMap = new Map();
        results.forEach((row) => {
          const { id, department, roll, shift, brandSD, deviceDate, engineerName, inChargeName, itemName, unit, code, timeValue } = row;
          if (!recordsMap.has(id)) {
            recordsMap.set(id, {
              id,
              department,
              roll,
              shift,
              brandSD, 
              deviceDate,
              engineerName,
              inChargeName,
              items: [],
            });
          }
          recordsMap.get(id).items.push({ itemName, unit, code, timeValue });
        });
  
        // Convert the map values to an array
        const records = Array.from(recordsMap.values());
  
        res.json(records);
      }
    });
  });

// POST API - Create a new record
app.post('/records', (req, res) => {
    const { department, roll, shift, brandSD, deviceDate, engineerName, inChargeName, items } = req.body;
    console.log('Received POST request with body:', req.body);

    // Insert the record into the database
    pool.query(
        'INSERT INTO records (department, roll, shift, brandSD, deviceDate, engineerName, inChargeName) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [department, roll, shift, brandSD, deviceDate, engineerName, inChargeName],
        (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Error inserting record into database' });
            } else {
                console.log('Record inserted into "records" table'); 
                const recordId = results.insertId;
                console.log('Generated recordId:', recordId);

                if (Array.isArray(items)) {
                    const itemValues = items.map((item) => [recordId, item.itemName, item.unit, item.code, item.shift, item.timeValue]);

                    // Insert the items into the database
                    pool.query(
                        'INSERT INTO items (recordId, itemName, unit, code, shift, timeValue) VALUES ?',
                        [itemValues],
                        (err) => {
                            if (err) {
                                console.error(err);
                                res.status(500).json({ error: 'Error inserting items into database' });
                            } else {
                                console.log('Items inserted into "items" table');
                                res.json({ message: 'Record created successfully' });
                            }
                        }
                    );
                } else {
                    console.error('Items is not an array:', items);
                    res.status(400).json({ error: 'Invalid request payload' });
                }
            }
        }
    );
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});