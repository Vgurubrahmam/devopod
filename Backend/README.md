# Customer Management System

## **Overview**
The Customer Management System is a web-based project that allows users to manage customer and user information. The system is built using **Node.js**, **Express.js**, and **PostgreSQL**, enabling seamless handling of user registration, customer data, and search functionalities.

---

## **Project Objectives**
1. Manage users and customers effectively.
2. Allow searching and filtering of customer data based on specific criteria.
3. Provide a relational database structure to associate customers with users.
4. Offer RESTful APIs for CRUD operations.

---

## **Database Design**

### **Tables**

#### 1. **Users Table**
Stores information about users who can manage customers.
```sql
CREATE SCHEMA IF NOT EXISTS user_auth;
CREATE TABLE IF NOT EXISTS user_auth.users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. **Customers Table**
Stores customer details and associates them with users via a foreign key.
```sql
CREATE TABLE IF NOT EXISTS user_auth.coustomerData (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  user_id INTEGER REFERENCES user_auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## **API Endpoints**

### 1. **User Management**

#### **Create User Table**
- **Endpoint**: `GET /userTable`
- **Description**: Initializes the `users` table if it doesn’t exist and fetches all user data.

```javascript
app.get("/userTable", async (req, res) => {
  const schemaOfUserTable = `
    CREATE SCHEMA IF NOT EXISTS user_auth;
    CREATE TABLE IF NOT EXISTS user_auth.users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(schemaOfUserTable);
    console.log("User table created successfully.");
    const result = await pool.query("SELECT * FROM user_auth.users");
    res.status(200).json({ message: "User table exists or was created successfully.", data: result.rows });
  } catch (err) {
    console.error("Error creating user table:", err.message);
    res.status(500).json({ error: "Failed to create or fetch user table." });
  }
});
```

### 2. **Customer Management**

#### **Create Customer Table**
- **Endpoint**: `GET /coustomerTable`
- **Description**: Initializes the `coustomerData` table if it doesn’t exist and fetches all customer data.

```javascript
app.get("/coustomerTable", async (req, res) => {
  const coustomerData = `
    CREATE TABLE IF NOT EXISTS user_auth.coustomerData (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone VARCHAR(255) NOT NULL,
      company VARCHAR(255),
      user_id INTEGER REFERENCES user_auth.users(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(coustomerData);
    console.log("Customer table created successfully.");
    const result = await pool.query("SELECT * FROM user_auth.coustomerData");
    res.status(200).json({ message: "Customer table exists or was created successfully.", data: result.rows });
  } catch (err) {
    console.error("Error creating customer table:", err.message);
    res.status(500).json({ error: "Failed to create or fetch customer table." });
  }
});
```

#### **Add a New Customer**
- **Endpoint**: `POST /addCustomer`
- **Description**: Adds a new customer associated with a user.

```javascript
app.post("/addCustomer", async (req, res) => {
  const { name, email, phone, company, user_id } = req.body;

  try {
    const addCustomerQuery = `
      INSERT INTO user_auth.coustomerData (name, email, phone, company, user_id)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    const result = await pool.query(addCustomerQuery, [name, email, phone, company, user_id]);
    res.status(201).json({ message: "Customer added successfully", customer: result.rows[0] });
  } catch (err) {
    console.error("Error adding customer:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});
```

#### **Search for Customers**
- **Endpoint**: `GET /searchCustomer/:query`
- **Description**: Searches for customers by name, email, or phone using a case-insensitive query.

```javascript
app.get("/searchCustomer/:query", async (req, res) => {
  const { query } = req.params;

  try {
    const searchQuery = `
      SELECT * FROM user_auth.coustomerData
      WHERE name ILIKE $1 OR email ILIKE $1 OR phone ILIKE $1;
    `;
    const result = await pool.query(searchQuery, [`%${query}%`]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.status(200).json({ message: "Search successful", customers: result.rows });
  } catch (err) {
    console.error("Error performing search:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});
```

#### **Filter Customers by Company**
- **Endpoint**: `GET /filterCustomersByCompany/:company`
- **Description**: Retrieves customers associated with a specific company.

```javascript
app.get("/filterCustomersByCompany/:company", async (req, res) => {
  const { company } = req.params;

  try {
    const filterQuery = `
      SELECT * FROM user_auth.coustomerData
      WHERE company ILIKE $1;
    `;
    const result = await pool.query(filterQuery, [`%${company}%`]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No customers found for the specified company" });
    }

    res.status(200).json({ message: "Filtered customers retrieved successfully", customers: result.rows });
  } catch (err) {
    console.error("Error filtering customers by company:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});
```

---

## **Technologies Used**
1. **Node.js**: For backend server.
2. **Express.js**: For building RESTful APIs.
3. **PostgreSQL**: For relational database management.
4. **pg**: PostgreSQL client for Node.js.
5. **JavaScript**: Programming language for backend development.

---

## **Setup and Installation**

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Setup PostgreSQL**:
   - Install PostgreSQL.
   - Create a database.
   - Update the `pool` configuration in the project to connect to your database.

4. **Run the Server**:
   ```bash
   node index.js
   ```

5. **Test API Endpoints**:
   Use tools like **Thunder Client**, **Postman**, or **cURL**.

---




## **Conclusion**
The Customer Management System provides a robust solution for managing users and customers with search and filtering capabilities. It is designed to be scalable and extendable for future features.

