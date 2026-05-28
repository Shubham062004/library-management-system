# LuminaLib QA Testing Guide

This guide establishes the backend Quality Assurance (QA) testing strategy, API verification workflows, health checks, error boundaries, and environment execution standards for the LuminaLib Library Management System.

---

## 📈 QA & Testing Strategy

LuminaLib utilizes a **pyramid-based testing hierarchy** combining structural Zod type validations at request arrival, strict transactional isolation at DB level, and automated multi-stage blackbox integration testing using **Postman Collection Runners**.

```text
    ┌──────────────────────────────────────────────┐
    │          Blackbox Postman Runners            │  <-- Automated end-to-end user scenarios
    ├──────────────────────────────────────────────┤
    │         PostgreSQL Database Isolation        │  <-- Prisma transaction constraints & rollbacks
    ├──────────────────────────────────────────────┤
    │          Zod Runtime Schema Scrubber         │  <-- Scrub malformed payloads at Express arrival
    └──────────────────────────────────────────────┘
```

### 1. Verification Layers
1. **Zod Input Scrubber**: Rejects incorrect fields, formatting errors, or malicious payloads before entering the business layer ($O(1)$ fast failure).
2. **Standardized Express Error Interceptors**: Catches custom thrown Exceptions and processes them into standardized envelopes, shielding internal traces.
3. **Database Consistency Gates**: PostgreSQL unique constraints and custom transactional checks act as the last line of defense.
4. **Postman Collection Tests**: Simulates cardholder checkouts, returns, inventory updates, and analytical aggregations to verify system operation.

---

## 💚 GET /health System Verification

The `/health` endpoint acts as the primary smoke-testing boundary used by container orchestration networks (e.g. Docker, Kubernetes) to check system statuses.

* **URL**: `GET /health`
* **Security**: Public (No authentication required)
* **Response payload**:
```json
{
  "success": true,
  "message": "Server running successfully"
}
```

---

## 🚨 Error Handling & HTTP Status Standards

LuminaLib adheres to a strict HTTP status code mapping structure to enable deterministic client integration:

| HTTP Status | Trigger Classification | Message Pattern Example |
| :--- | :--- | :--- |
| **200 OK** | Success of standard queries (GET, PUT) | `"Member updated successfully"` |
| **201 Created** | Success of creation operations (POST) | `"Book cataloged successfully"` |
| **400 Bad Request** | Zod validation violations or parameter errors | `"Request validation failed"` (with errors grid) |
| **401 Unauthorized** | Session token expired, invalid, or missing | `"Access denied. Bearer JWT missing or expired."` |
| **404 Not Found** | Record UUID does not exist | `"The requested resource UUID was not found."` |
| **409 Conflict** | Duplication of unique constraints bounds | `"Member with email rahul@example.com already active"` |
| **429 Too Many Requests** | Rate-limiting limit exceeded on login | `"Too many requests from this IP..."` |
| **500 Server Error** | Unexpected internal system crashes | `"An unexpected error occurred on the server."` |

---

## 🚀 Executing Postman Automated Collections

To execute the full automated test suite inside Postman:

### 1. Onboarding Setup
1. Open Postman. Click **Import** in the top-left.
2. Select and import the two files located in the repository:
   * **Collection**: `backend/postman/LuminaLib.postman_collection.json`
   * **Environment**: `backend/postman/LuminaLib.postman_environment.json`
3. Ensure the active environment is set to **LuminaLib Environment** in the top-right.

### 2. Auto-Hydration Token Automation (DX)
* When you execute `POST /auth/login` (found inside the **Auth** folder), Postman runs a built-in **Test Script**:
  ```javascript
  var response = pm.response.json();
  if (response.success && response.data.token) {
      pm.environment.set("TOKEN", response.data.token);
  }
  ```
* This sets the `TOKEN` environment variable automatically. Since the entire collection inherits the Bearer Authentication credentials (`Authorization: Bearer {{TOKEN}}`), subsequent protected requests are authenticated instantly.

### 3. Collection Runner execution
1. Right-click the **LuminaLib LMS APIs** collection.
2. Select **Run Collection**.
3. Choose the execution order (preconfigured sequentially from Health -> Auth -> Members -> Books -> Issuances -> Analytics).
4. Click **Run LuminaLib LMS APIs**.
5. All tests should pass successfully with active assertions verifying responses and status codes!
