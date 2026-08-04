# 🔐 Auth-Bouncer: Advanced Authentication Powerhouse

> **Spring Boot 3.5.3 + React 19 | Production-Ready Authentication System**  
> *Don't like the theme? Hit refresh and watch the magic happen! ✨*

---

## 🎯 **The Complete Authentication Experience**

### 🏠 **Homepage - Where It All Begins**
![Auth-Bouncer Homepage](Screenshots/Homepage.png)

**What's happening behind the scenes?** Our Spring Boot backend serves this sleek interface while managing complex authentication flows, JWT token generation, and secure session handling.

---

### 🎯 **Authentication Flow Architecture**
```mermaid
graph TB
    A[Client Request] --> B{Authentication Type}
    
    B -->|Local Auth| C[Email/Password]
    B -->|OAuth2| D[Google/GitHub]
    B -->|OTP| E[Email OTP]
    
    C --> F[AuthController]
    D --> G[OAuthController]
    E --> H[OtpAuthController]
    
    F --> I[AuthService]
    G --> J[GoogleOAuthService/GithubOAuthService]
    H --> K[OtpService]
    
    I --> L[JWT Generation]
    J --> L
    K --> L
    
    L --> M[Access Token + Refresh Token]
    M --> N[HttpOnly Cookie + Bearer Token]
    
    N --> O[JWTFilter Validation]
    O --> P[SecurityContext]
    P --> Q[Protected Resources]
    
    style A fill:#e1f5fe
    style L fill:#c8e6c9
    style Q fill:#fff3e0
```

## 🔑 **Multiple Authentication Methods - Backend Flexibility at Its Finest**

### 📧 **Traditional Email/Password Authentication**
![Login Interface](Screenshots/id_pass.png)

**Backend Magic:**
- **BCrypt Password Hashing** (Strength: 12) for maximum security
- **JWT Access + Refresh Token** dual-layer system
- **HttpOnly Secure Cookies** for refresh token storage
- **Real-time validation** with Spring Security filters

### 🌐 **OAuth2 Social Login - Seamless Integration**
![OAuth Integration](Screenshots/0auth.png)

**Backend Powerhouse Features:**
- **Google OAuth2** complete flow implementation
- **GitHub OAuth2** with email verification
- **Automatic user provisioning** for new social accounts
- **Token exchange** and secure user info retrieval
- **RestTemplate** integration for external API calls

### 📱 **OTP Authentication - Email-Based Security**
![OTP Request](Screenshots/otp.png)

**Advanced Backend Implementation:**
- **Random OTP generation** with secure algorithms
- **Gmail SMTP integration** for email delivery
- **Time-based expiration** handling
- **Redis caching** for OTP storage and validation

---

## 📨 **Real-World Email Integration**

### 📧 **OTP Email Delivery in Action**
![OTP Email Example](Screenshots/ex_otp_receive.png)

**Backend Email Service Features:**
- **Gmail SMTP** configuration with app passwords
- **HTML email templates** for professional communication
- **Delivery confirmation** and error handling
- **Rate limiting** to prevent spam

### 🔄 **OTP Resend Functionality**
![OTP Resend](Screenshots/resend%20otp.png)

**Smart Backend Logic:**
- **Cooldown periods** to prevent abuse
- **Automatic cleanup** of expired OTPs
- **Retry mechanisms** with exponential backoff

---

## 🛡️ **Role-Based Access Control (RBAC) - Security Architecture**

### 👑 **Admin Dashboard - Elevated Privileges**
![RBAC System](Screenshots/rbac.png)

**Backend Security Implementation:**
- **Spring Security** role-based endpoint protection
- **JWT Claims** with role information
- **`@PreAuthorize`** method-level annotations on controller endpoints (`ControllerForAdmin`, `ControllerForUser`, `UserController`) — checked at the method level via Spring Security's expression handler, on top of URL-pattern matching
- **Hierarchical permission** system

**Protected Endpoints:**
- `/api/is-admin/**` - Admin-only resources
- `/api/is-user/**` - User-level access
- **Dynamic role checking** in JWT filter

---

## 🔐 **Advanced Security Features**

### 🔑 **Password Management System**
![Password Change](Screenshots/change_pass.png)

**Backend Security Measures:**
- **Current password verification** before changes
- **BCrypt re-hashing** with salt rotation
- **Session invalidation** after password change
- **Audit logging** for security events

### 🚦 **Rate Limiting**
Real Redis-backed rate limiting, not a marketing bullet — `RateLimitingFilter` runs as a servlet filter in front of `/api/auth/login`, `/api/auth/request-otp`, and `/api/auth/verify-otp`.
- **`INCR` + `EXPIRE`** fixed-window counter per `client IP + path`, keyed as `rate_limiting:{ip}path:{path}`
- Configurable ceiling via `rate.limiting.max.requests` (default 20 requests/minute)
- Expiry is set only on the first hit in the window, so the window is a true fixed window
- Over the limit → short-circuits the chain and returns 429 before the request reaches the controller

### 🔒 **Brute-Force Lockout**
`LoginAttemptService` tracks failures **per email** in Redis, independent of the IP-based rate limiter (so an attacker rotating IPs still can't brute-force one account):
- Failed login → `INCR` on `login_attempts:{email}`, with a 15-minute `EXPIRE` set on the first failure
- 5 failed attempts within that window → account locked (`AuthController` returns `423 Locked`)
- Successful login → counter is deleted, resetting the window

### ♻️ **Redis-Backed Refresh Tokens (Real Revocation)**
Refresh tokens aren't just JWTs trusted on signature — `RefreshTokenService` stores the current token per user in Redis (`refresh-token:{email}`), so logout actually kills the session server-side instead of relying on client-side cookie deletion:
- **Login/refresh** → token written to Redis with a TTL matching the refresh token's expiry (rotation overwrites the old entry)
- **Every refresh request** → checked against what's stored in Redis, not just JWT signature validity — a token that's valid-but-revoked is rejected
- **Logout** → deletes the Redis entry, immediately invalidating that session

---

## 🏗️ **Backend Architecture - The Real MVP**

### 🚀 **Spring Boot 3.5.3 Powerhouse**
```
🔧 Core Technologies:
├── Java 21 (Latest LTS)
├── Spring Security 6
├── PostgreSQL + JPA
├── Redis Caching
├── JWT (jjwt 0.12.6)
└── Maven Build System
```
---

## 🔥 **Backend Service Architecture**


#### 🛡️ **AuthService - The Authentication Brain**
- User registration with duplicate validation
- Secure login with BCrypt verification, gated by `LoginAttemptService` lockout checks
- JWT token generation and refresh rotation
- HttpOnly cookie management for security
- Delegates to `RefreshTokenService` for Redis-backed session revocation on logout

#### 🎫 **JWTService - Token Management Master**
- Access token generation (15-minute expiry)
- Refresh token handling (7-day rotation)
- Claims parsing and validation
- Signature verification with HMAC-SHA256

#### 🌐 **OAuth Services - Social Integration Experts**
- **GoogleOAuthService**: Complete OAuth2 flow
- **GithubOAuthService**: GitHub authentication
- Token exchange with external providers
- User profile synchronization

#### 📧 **OtpService - Email Security Specialist**
- Cryptographically secure OTP generation
- SMTP email delivery with templates
- Time-based expiration management
- Anti-spam protection mechanisms

---

## 🗄️ **Database & Caching Strategy**

### 📊 **PostgreSQL Data Layer**
- **User Entity** with audit trails
- **Role-based** permission system
- **Provider tracking** (LOCAL, GOOGLE, GITHUB)
- **Automatic timestamps** with JPA auditing

### ⚡ **Redis Caching Layer**
- **Refresh token store** — `refresh-token:{email}` → enables real server-side revocation on logout, not just cookie deletion
- **OTP storage** with TTL expiration
- **Rate limiting counters** — fixed-window `INCR`/`EXPIRE` on auth endpoints
- **Brute-force lockout counters** — per-email failed-login tracking, independent of IP-based rate limiting

---

## 🔐 **Security Implementation Deep Dive**

### 🛡️ **Multi-Layer Security Architecture**

#### **Layer 1: Request Filtering**
- Custom JWT filter intercepts all requests
- Bearer token extraction and validation
- Security context population
- CORS configuration for cross-origin requests

#### **Layer 2: Authentication Management**
- Spring Security authentication provider
- BCrypt password encoder (strength 12)
- UserDetailsService integration
- Session management (stateless)

#### **Layer 3: Authorization Control**
- Role-based method security
- Endpoint-level access control
- Dynamic permission checking
- Audit trail logging

---

## 🚀 **API Endpoints - RESTful Excellence**

### 🎯 **Authentication Endpoints**
| Method | Endpoint | Purpose | Security |
|--------|----------|---------|----------|
| `POST` | `/api/auth/register` | User Registration | Public |
| `POST` | `/api/auth/login` | Email/Password Login | Public |
| `POST` | `/api/auth/refresh` | Token Refresh | Cookie Auth |
| `POST` | `/api/auth/logout` | Secure Logout | Cookie Auth |
| `POST` | `/api/auth/google/callback` | Google OAuth2 | Public |
| `POST` | `/api/auth/github/callback` | GitHub OAuth2 | Public |
| `POST` | `/api/auth/request-otp` | OTP Generation | Public |
| `POST` | `/api/auth/verify-otp` | OTP Verification | Public |

### 👤 **Account Management Endpoints**
| Method | Endpoint | Purpose | Security |
|--------|----------|---------|----------|
| `POST` | `/api/modify-user/send-otp` | OTP for account changes | Authenticated |
| `POST` | `/api/modify-user/verify-otp` | Confirm account change | Authenticated |
| `POST` | `/api/modify-user/make-admin` | Promote user to ADMIN | Admin |

### 🔒 **Protected Resources**
| Endpoint Pattern | Required Role | Description |
|------------------|---------------|-------------|
| `/api/is-user/**` | USER | User-level resources |
| `/api/is-admin/**` | ADMIN | Admin-only resources (incl. `/all-users`) |
| `/api/health/**` | Public | Health checks |

---

## ⚙️ **Configuration & Environment**

### 🔧 **Backend Configuration Highlights**
- **JWT Secret Management** with environment variables
- **Database Connection Pooling** for performance
- **CORS Configuration** for frontend integration
- **Email SMTP Settings** with Gmail integration
- **OAuth2 Client Credentials** management

### 🌍 **Environment Setup**
```bash
# Backend Power-Up
cd AB-Backend
mvn clean install
mvn spring-boot:run

# Frontend Launch
cd AB-Frontend  
npm install
npm run dev
```

---

## 📊 **Performance & Scalability**

### ⚡ **Optimization Features**
- **Connection Pooling** with HikariCP
- **Redis Caching** for session data
- **JWT Stateless** authentication
- **Lazy Loading** with JPA
- **Async Processing** for email delivery

### 📈 **Scalability Considerations**
- **Horizontal scaling** ready architecture
- **Database indexing** on critical fields
- **Caching strategies** for frequent queries
- **Load balancer** compatible design

---

## 🧪 **Development & Testing**

### 🔍 **Backend Testing Strategy**

33 tests across three layers, built directly against the real service/controller/repository code (no throwaway examples):

**Unit tests (JUnit 5 + Mockito)**
- `OtpServiceTest` — OTP generation, Redis-backed expiry, resend cooldown logic
- `RefreshTokenServiceTest` — refresh token issuance, rotation, and invalidation
- `JWTServiceTest` — real HMAC-SHA256 signing/parsing, exercised against actual crypto rather than mocked out
- `AuthServiceTest` — registration/login orchestration across multiple collaborating mocks
- `LoginAttemptServiceTest` — Redis-backed lockout counters and key-prefix handling

**HTTP layer (`@WebMvcTest` + MockMvc)**
- `AuthControllerTest` — bad password (400), duplicate email on register (400), invalid/expired refresh token (400), and account lockout after repeated failures (423)

**Persistence layer (`@DataJpaTest` + H2)**
- `UserRepositoryTest` — repository queries against an in-memory H2 instance

| Layer | Tool | Class(es) |
|-------|------|-----------|
| Service (unit) | JUnit 5 + Mockito | `OtpService`, `RefreshTokenService`, `JWTService`, `AuthService`, `LoginAttemptService` |
| Controller (HTTP) | `@WebMvcTest` + MockMvc | `AuthController` |
| Repository (data) | `@DataJpaTest` + H2 | `UserRepository` |

Mockito patterns exercised along the way: `RedisTemplate`/`opsForValue()` stubbing chains, `@Mock` vs `@InjectMocks` boundaries, `ReflectionTestUtils` for `@Value`-injected fields, and argument matchers (`any()`, `eq()`, `argThat()`, `ArgumentCaptor`).

### 🛠️ **Development Tools**
- **Spring Boot DevTools** for hot reload
- **Lombok** for boilerplate reduction
- **Maven** for dependency management
- **PostgreSQL** for development database

---

## 🚀 **Production Deployment**

### 🔒 **Security Hardening**
- Environment-specific JWT secrets
- HTTPS enforcement
- Redis-backed rate limiting (fixed-window `INCR`/`EXPIRE`) on `/api/auth/login`, `/api/auth/request-otp`, `/api/auth/verify-otp`
- Per-email brute-force lockout (5 failures / 15-minute window) independent of IP-based rate limiting
- SQL injection prevention
- XSS protection headers

### 📊 **Monitoring & Logging**
- Application performance monitoring
- Security audit logging
- Error tracking and alerting
- Health check endpoints

---

## 🎉 **Why Auth-Bouncer Rocks**

### 💪 **Backend Strengths**
- **Enterprise-Grade Security** with multiple authentication methods
- **Scalable Architecture** built with Spring Boot best practices  
- **Production-Ready** with comprehensive error handling
- **Developer-Friendly** with clean, well-documented code
- **Modern Stack** using latest Java 21 and Spring Boot 3.5.3

### 🌟 **Key Differentiators**
- **Multi-Authentication Support** (Local, OAuth2, OTP)
- **Robust JWT Implementation** with refresh token rotation
- **Real Email Integration** with Gmail SMTP
- **Role-Based Security** with fine-grained permissions
- **Caching Strategy** with Redis for performance

---

**🔥 Built by a passionate developer who believes in secure, scalable, and beautiful code**  
*Powered by Spring Boot 3.5.3 + React 19 - The perfect full-stack combination*

---

*Don't forget to hit that refresh button and see the theme magic! ✨*
