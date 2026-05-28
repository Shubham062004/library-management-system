# LuminaLib Edge Case Testing Manual

This manual documents critical edge cases, business boundaries, transactional integrity assertions, and failure scenarios preconfigured and handled inside the LuminaLib Library Management System.

---

## 🔒 Authentication & Rate-Limiting Edge Cases

### 1. Brute-Force Login Flooding
- **Edge Case**: A malicious actor or automated script floods `/auth/login` with credentials guessing payloads.
- **Handling Mechanism**: Preconfigured `express-rate-limit` middleware intercepts public logins, tracking queries by IP.
- **Expected Outcome**:
  * First 100 requests in 15 minutes: `200 OK` or `401 Unauthorized`.
  * Request 101+: `429 Too Many Requests` status, returning a secure JSON payload:
    ```json
    {
      "success": false,
      "message": "Too many requests from this IP, please try again after 15 minutes."
    }
    ```

---

## 👥 Member Domain Edge Cases

### 2. Duplicate Cardholder Registration
- **Edge Case**: Creating a member using an email address that is already registered.
- **Handling Mechanism**: The backend queries the member database using a unique index look-up. If a match is found, it immediately throws a `ConflictError` before proceeding.
- **Expected Outcome**: `409 Conflict` status with a descriptive message.

### 3. Malformed UUID Queries (`GET /members/:id`)
- **Edge Case**: Requesting member details by passing a non-UUID parameter string (e.g. `GET /members/invalid-uuid-string`).
- **Handling Mechanism**: The UUID format validator scrub middleware intercepts queries at routing bounds.
- **Expected Outcome**: `400 Bad Request` validation error, preventing the database search layer from executing malformed SQL structures.

---

## 📚 Book Domain Edge Cases

### 4. Inventory Boundary Exhaustion
- **Edge Case**: Cataloging a book with a negative quantity (e.g. `quantity: -5`).
- **Handling Mechanism**: Zod enforces a strict `nonnegative()` constraint on integer catalog bounds.
- **Expected Outcome**: `400 Bad Request` returning a validation errors array.

### 5. Duplicate Cataloging (ISBN Collision)
- **Edge Case**: Cataloging a new book with an ISBN that already exists in the catalog.
- **Handling Mechanism**: A unique index on the `isbn` column in the Book table is intercepted in the service layer, throwing a custom `ConflictError`.
- **Expected Outcome**: `409 Conflict` with a descriptive message.

---

## 📡 Issuance & Transactional Integrity Edge Cases

### 6. Borrowing Out-of-Stock Books
- **Edge Case**: A member attempts to borrow a book where `availableQuantity` is currently `0`.
- **Handling Mechanism**: The issuance service executes a strict transactional boundary check:
  ```typescript
  if (book.availableQuantity <= 0) {
    throw new BadRequestError('Book is currently out of stock.');
  }
  ```
- **Expected Outcome**: `400 Bad Request` with message `"Book is currently out of stock."`.

### 7. Active Borrow Limits Exceeded
- **Edge Case**: A member attempts to borrow a book when they already have 5 active (unreturned) checkouts.
- **Handling Mechanism**: The database transaction counts the member's active outstanding issuances (`status = 'ISSUED'`). If this count $\ge 5$, it blocks checkouts.
- **Expected Outcome**: `400 Bad Request` with message `"Member has reached their maximum borrowing limit (5 books)."`

### 8. Double Return Prevention
- **Edge Case**: Attempting to return a book that has already been returned (e.g. calling `PUT /issuances/:id/return` multiple times on the same UUID).
- **Handling Mechanism**: The return service evaluates the current status of the issuance record before executing transactions:
  ```typescript
  if (issuance.status === 'RETURNED') {
    throw new BadRequestError('Book has already been returned.');
  }
  ```
- **Expected Outcome**:
  * First return call: `200 OK` (actualReturnDate populated, availableQuantity incremented).
  * Subsequent return calls: `400 Bad Request` (blocked, availableQuantity unchanged).

---

## 🔍 SQL Injection & Parameter Injection Prevention

### 9. Pagination Manipulation
- **Edge Case**: Passing malicious string payloads in query integer bounds (e.g. `GET /books?page=DROP+TABLE+Book&limit=abc`).
- **Handling Mechanism**: Query variables are sanitized, parsed, and scrubbed through Zod types, parsing string parameters into integers and enforcing fallback defaults.
- **Expected Outcome**: Safe default routing (`page = 1`, `limit = 10`) is applied, or an explicit validation error is returned, avoiding SQL injection vulnerabilities.
