const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // For parsing application/json

// Set up PostgreSQL connection
const pool = new Pool({
  user: 'Your User Name',
  host: 'Your IP',
  database: 'Your Database Name',
  password: 'Your Password',
  port: "Your Port Number",
});

// Define API routes


app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM public.customer WHERE customer_email = $1 AND password = $2',
      [email, password]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.post('/loadTasks', async (req, res) => {
    const { table, id } = req.body; // Extract the table name and customer ID from the request body
  
    // Define a whitelist of allowed table names
    const allowedTables = ['sunday','monday','tuesday','wednesday', 'thursday', 'friday', 'saturday', 'grocery_list']; // Add your allowed tables here
  
    // Validate the table name
    if (!allowedTables.includes(table)) {
      return res.status(400).json({ message: 'Invalid table name' });
    }
  
    try {
      const queryText = `SELECT * FROM public.${table} WHERE customer_id = $1`; // Dynamically construct the query string
      const result = await pool.query(queryText, [id]);
  
      if (result.rows.length > 0) {
        res.json(result.rows); // Send the rows as an array
      } else {
        res.status(404).json({ message: 'No tasks found' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });

  app.post('/addTasks', async (req, res) => {
    const { table, id, item } = req.body; // Extract the table name, customer ID, and item from the request body
  
    // Define a whitelist of allowed table names
    const allowedTables = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'grocery_list'];
  
    // Validate the table name
    if (!allowedTables.includes(table)) {
      return res.status(400).json({ message: 'Invalid table name' });
    }
  
    try {
      // Construct the query string to insert the task
      const queryText = `INSERT INTO public.${table} (Customer_ID, Task_DESC, Is_Checked) VALUES ($1, $2, false) RETURNING *`; 
      const result = await pool.query(queryText, [id, item]);
  
      // Send back the inserted row
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });

   app.post('/deleteTasks', async (req, res) => {
    const { table, id, item } = req.body; // Extract the table name, customer ID, and item from the request body
  
    // Define a whitelist of allowed table names
    const allowedTables = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'grocery_list'];
  
    // Validate the table name
    if (!allowedTables.includes(table)) {
      return res.status(400).json({ message: 'Invalid table name' });
    }
  
    try {
      // Construct the query string to insert the task
      const queryText = `DELETE FROM public.${table} WHERE task_desc = $2 and task_id = $1`; 
      const result = await pool.query(queryText, [id, item]);
  
      // Send back the inserted row
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });
  
  app.post('/alterCheckTasks', async (req, res) => {
    const { table, id, item, check } = req.body;
  
    // Define a whitelist of allowed table names
    const allowedTables = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'grocery_list'];
  
    // Validate the table name
    if (!allowedTables.includes(table)) {
      return res.status(400).json({ message: 'Invalid table name' });
    }
  
    try {
      // Construct the query string to update the task's checked status
      const queryText = `UPDATE public.${table} SET is_checked = $3 WHERE customer_id = $1 AND task_desc = $2 RETURNING *`; 
      const result = await pool.query(queryText, [id, item, check]);
  
      // Check if any row was updated and return the appropriate response
      if (result.rows.length > 0) {
        res.status(200).json(result.rows[0]);
      } else {
        res.status(404).json({ message: 'Task not found or update failed' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });

  app.post('/checkEmail', async (req, res) => {
    const { email } = req.body;
  
    try {
      // Construct the query string to check if the email exists in the customer table
      const queryText = `SELECT * FROM public.customer WHERE customer_Email = $1`;
      const result = await pool.query(queryText, [email]);
  
      // Check if any row was found and return the appropriate response
      if (result.rows.length > 0) {
        res.json({ exists: true }); // Respond with JSON indicating the email exists
      } else {
        res.json({ exists: false }); // Respond with JSON indicating the email does not exist
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });
  
  app.post('/updateEmail', async (req, res) => {
    const { id, email } = req.body;
  
    try {
      // Construct the query string to update the task's checked status
      const queryText = `UPDATE public.customer SET customer_email = $2 WHERE customer_id = $1 RETURNING *`; 
      const result = await pool.query(queryText, [ id, email]);
  
      // Check if any row was updated and return the appropriate response
      if (result.rows.length > 0) {
        res.status(200).json(result.rows[0]);
      } else {
        res.status(404).json({ message: 'Email failed to update' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }); 

  app.post('/updatePin', async (req, res) => {
    const { id, pin } = req.body;
  
    try {
      // Construct the query string to update the task's checked status
      const queryText = `UPDATE public.customer SET pin = $2 WHERE customer_id = $1 RETURNING *`; 
      const result = await pool.query(queryText, [ id, pin]);
  
      // Check if any row was updated and return the appropriate response
      if (result.rows.length > 0) {
        res.status(200).json(result.rows[0]);
      } else {
        res.status(404).json({ message: 'Pin failed to update' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });

  app.post('/updatePassword', async (req, res) => {
    const { id, password } = req.body;
  
    try {
      // Construct the query string to update the task's checked status
      const queryText = `UPDATE public.customer SET password = $2 WHERE customer_id = $1 RETURNING *`; 
      const result = await pool.query(queryText, [ id, password]);
  
      // Check if any row was updated and return the appropriate response
      if (result.rows.length > 0) {
        res.status(200).json(result.rows[0]);
      } else {
        res.status(404).json({ message: 'Password failed to update' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });

  app.post('/addCustomer', async (req, res) => {
    const { firstName, lastName, pin, password, email } = req.body; // Extract the table name, customer ID, and item from the request body
  
    try {
      // Construct the query string to insert the task
      const queryText = `INSERT INTO public.customer (first_name, last_name, pin, password, customer_email) VALUES ($1, $2, $3, $4, $5) RETURNING *`; 
      const result = await pool.query(queryText, [firstName, lastName, pin, password, email]);
  
      // Send back the inserted row
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });

  app.post('/forgotPassword', async (req, res) => {
    const { email, pin } = req.body;
    try {
      const result = await pool.query(
        'SELECT * FROM public.customer WHERE customer_email = $1 AND pin = $2',
        [email, pin]
      );
      if (result.rows.length > 0) {
        res.json(result.rows[0]);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
