# LuminaLib API Validation Checklist

This checklist documents the runtime request validation schemas powered by **Zod** inside the Express backend application. It details required fields, formatting rules, constraint boundaries, and error patterns for each domain module.

---

## 🔑 Authentication Validator Schema

### Login Fields (`POST /auth/login`)
- [x] **`email`**:
  * Required: Yes
  * Type: String
  * Rule: Valid email format (`email()`)
  * Violation Error: `"Invalid email address format"`
- [x] **`password`**:
  * Required: Yes
  * Type: String
  * Rule: Minimum length of 6 characters (`min(6)`)
  * Violation Error: `"Password must be at least 6 characters"`

---

## 👥 Member Validator Schema

### Member Registration (`POST /members`)
- [x] **`name`**:
  * Required: Yes
  * Type: String
  * Rule: Minimum 1 character, stripped whitespace (`min(1)`)
  * Violation Error: `"Name is required"`
- [x] **`email`**:
  * Required: Yes
  * Type: String
  * Rule: Valid email format (`email()`)
  * Violation Error: `"Invalid email format"`
- [x] **`phone`**:
  * Required: Yes
  * Type: String
  * Rule: Exactly 10-digit number (`regex(/^\d{10}$/)`)
  * Violation Error: `"Phone number must be exactly 10 digits"`

### Member Updates (`PUT /members/:id`)
- [x] **Path Parameter (`id`)**: Must be a valid UUID v4 format.
- [x] **Request Body**: Optional properties matching the registration rules (at least one field must be provided for modification).

---

## 📚 Book Validator Schema

### Book Cataloging (`POST /books`)
- [x] **`title`**:
  * Required: Yes
  * Type: String
  * Rule: Minimum 1 character (`min(1)`)
  * Violation Error: `"Title is required"`
- [x] **`author`**:
  * Required: Yes
  * Type: String
  * Rule: Minimum 1 character (`min(1)`)
  * Violation Error: `"Author is required"`
- [x] **`isbn`**:
  * Required: Yes
  * Type: String
  * Rule: Clean string matching ISBN-10 or ISBN-13 format
  * Violation Error: `"ISBN must be a valid 10 or 13 character numeric string"`
- [x] **`quantity`**:
  * Required: Yes
  * Type: Integer
  * Rule: Non-negative integer (`int().nonnegative()`)
  * Violation Error: `"Quantity must be a non-negative integer"`

---

## 📡 Issuance Validator Schema

### Book Issuance Request (`POST /issuances`)
- [x] **`bookId`**:
  * Required: Yes
  * Type: String
  * Rule: Must be a valid UUID v4 format
  * Violation Error: `"Invalid Book UUID format"`
- [x] **`memberId`**:
  * Required: Yes
  * Type: String
  * Rule: Must be a valid UUID v4 format
  * Violation Error: `"Invalid Member UUID format"`
- [x] **`targetReturnDate`**:
  * Required: No
  * Type: String
  * Rule: Must be a valid ISO-8601 Date string. Automatically defaults to **14 days from issue date** if omitted.

---

## 🔍 Query Parameters Validation

### Paginated Listing (`GET /members` and `GET /books`)
- [x] **`page`**:
  * Type: Integer
  * Rule: Must be $\ge 1$. Defaults to `1`.
- [x] **`limit`**:
  * Type: Integer
  * Rule: Must be $\ge 1$. Defaults to `10`.
- [x] **`search`**:
  * Type: String
  * Rule: Optional search string matching terms case-insensitively.
- [x] **`sortBy`**:
  * Type: String
  * Rule: Limited to a whitelist of columns (e.g. `createdAt`, `name`, `title`, `availableQuantity`).
- [x] **`sortOrder`**:
  * Type: String
  * Rule: Enum of `asc` or `desc`. Defaults to `desc`.
