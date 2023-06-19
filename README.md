# tech-curve-aasignment


To run the project, follow these instructions:

1. Install dependencies: Navigate to the project directory in your terminal and run the following command to install the required dependencies mentioned in the package.json file:
npm install

2. Set up the MySQL database: Before running the project, you need to create the necessary tables in the MySQL database. Open a MySQL client (such as MySQL Workbench or the MySQL command-line client) and execute the SQL statements in the createTable.txt file. These statements will create the records and items tables.

3. Configure database connection: In the index.js file, ensure that the database connection details match the correct credentials for your MySQL database. Verify that the host, user, password, and database values are accurate. Update them if necessary.

4. Start the server: In your terminal, navigate to the project directory and run the following command to start the server:
node index.js
Alternatively, if you have nodemon installed as a development dependency, you can use the following command:
npx nodemon index.js
The server will start running and listening on port 3000.

5. Test the endpoints: With the server running, you can test the endpoints using an API testing tool like Postman or by making HTTP requests directly. Here are two example endpoints:
To retrieve all records, send a GET request to http://localhost:3000/records.
To create a new record, send a POST request to http://localhost:3000/records with the appropriate request body.
