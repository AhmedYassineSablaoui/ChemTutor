# ChemTutor Database Structure

## Overview
The ChemTutor application now has a comprehensive PostgreSQL database structure with dedicated tables for tracking user activities and feature usage.

## Database Tables

### 1. **user_profiles** - User Profile Information
Extended user profile information linked to Django's built-in User model.

**Fields:**
- `id` - Primary key
- `user_id` - Foreign key to Django User (OneToOne relationship)
- `bio` - Text field for user biography
- `institution` - User's educational institution
- `education_level` - User's education level
- `avatar_url` - URL to user's avatar image
- `created_at` - Profile creation timestamp
- `updated_at` - Last update timestamp

**Auto-created:** A profile is automatically created when a new user registers.

---

### 2. **login_history** - Login Session Tracking
Tracks all user login attempts and sessions.

**Fields:**
- `id` - Primary key
- `user_id` - Foreign key to Django User
- `login_time` - Timestamp when user logged in
- `logout_time` - Timestamp when user logged out (nullable)
- `ip_address` - Client's IP address
- `user_agent` - Browser/client user agent string
- `session_token` - Authentication token for the session
- `is_successful` - Boolean indicating if login was successful

**Automatic Tracking:**
- Login record created automatically when user logs in
- Logout time updated when user logs out
- IP address and user agent captured from request

---

### 3. **reaction_formatter** - Reaction Balancing History
Stores all chemical reaction balancing and formatting requests.

**Fields:**
- `id` - Primary key
- `user_id` - Foreign key to Django User (nullable for anonymous users)
- `input_reaction` - Original reaction input by user
- `balanced_reaction` - Balanced reaction output
- `reactants` - JSON field with reactant details
- `products` - JSON field with product details
- `metadata` - JSON field with compound metadata
- `is_successful` - Boolean indicating if balancing succeeded
- `error_message` - Error message if balancing failed
- `created_at` - Request timestamp

**Automatic Tracking:**
- Record created every time a user uses the reaction formatter
- Stores both successful and failed attempts
- Captures all reaction details and metadata

---

### 4. **qa_history** - Question & Answer History
Stores all Q&A interactions with the chemistry tutor.

**Fields:**
- `id` - Primary key
- `user_id` - Foreign key to Django User (nullable for anonymous users)
- `question` - User's chemistry question
- `answer` - AI-generated answer
- `sources` - JSON field with source documents used
- `is_successful` - Boolean indicating if Q&A succeeded
- `error_message` - Error message if Q&A failed
- `response_time` - Time taken to generate response (in seconds)
- `created_at` - Request timestamp

**Automatic Tracking:**
- Record created every time a user asks a question
- Stores both successful and failed attempts
- Tracks response time for performance monitoring

---

### 5. **correction_history** - Statement Correction History
Stores all chemistry statement correction requests.

**Fields:**
- `id` - Primary key
- `user_id` - Foreign key to Django User (nullable for anonymous users)
- `original_statement` - Original chemistry statement
- `corrected_statement` - AI-corrected statement
- `was_changed` - Boolean indicating if statement was modified
- `is_successful` - Boolean indicating if correction succeeded
- `error_message` - Error message if correction failed
- `response_time` - Time taken to generate correction (in seconds)
- `created_at` - Request timestamp

**Automatic Tracking:**
- Record created every time a user uses the correction feature
- Stores both successful and failed attempts
- Tracks whether the statement was actually changed
- Monitors response time for performance

---

## Legacy Tables (Backward Compatibility)

### 6. **api_usersession** - Legacy Session Tracking
Original session tracking model (kept for backward compatibility).

### 7. **api_queryhistory** - Legacy Query History
Original query history model (kept for backward compatibility).

---

## Automatic Data Saving

All feature interactions are automatically saved to their respective tables:

### **User Registration**
- Creates a new User in Django's auth_user table
- Automatically creates a UserProfile via Django signals
- No manual intervention required

### **User Login**
- Creates a LoginHistory record with:
  - Login timestamp
  - IP address
  - User agent
  - Session token

### **User Logout**
- Updates the LoginHistory record with logout timestamp

### **Reaction Formatter Usage**
- Creates a ReactionFormatter record with:
  - Input reaction
  - Balanced reaction
  - All metadata
  - Success/failure status

### **Q&A Feature Usage**
- Creates a QAHistory record with:
  - Question and answer
  - Source documents
  - Response time
  - Success/failure status

### **Correction Feature Usage**
- Creates a CorrectionHistory record with:
  - Original and corrected statements
  - Whether it was changed
  - Response time
  - Success/failure status

---

## Admin Interface

All tables are registered in Django Admin with enhanced interfaces:

### Access Admin Panel
1. Navigate to: `http://localhost:8000/admin/`
2. Login with superuser credentials
3. View and manage all database records

### Admin Features
- **Search:** Search records by user, content, timestamps
- **Filters:** Filter by success status, dates, users
- **Read-only:** History tables are read-only (no manual edits)
- **Date Hierarchy:** Easy navigation by date
- **Shortened Display:** Long text fields are truncated in list view

---

## Database Connection

The application connects to PostgreSQL via Docker:

```yaml
Database: chemtutor_db
User: chemtutor_user
Host: db (Docker service)
Port: 5432
```

---

## Querying the Database

### Via Django Shell
```bash
docker-compose exec backend python manage.py shell
```

```python
from api.models import *

# Get all reactions by a user
user_reactions = ReactionFormatter.objects.filter(user__username='ahmed')

# Get recent Q&A history
recent_qa = QAHistory.objects.all()[:10]

# Get login history for a user
logins = LoginHistory.objects.filter(user__username='ahmed')

# Get corrections that changed the statement
changed_corrections = CorrectionHistory.objects.filter(was_changed=True)
```

### Via PostgreSQL CLI
```bash
docker-compose exec db psql -U chemtutor_user -d chemtutor_db
```

```sql
-- View all tables
\dt

-- Query reaction formatter
SELECT * FROM reaction_formatter ORDER BY created_at DESC LIMIT 10;

-- Query Q&A history
SELECT * FROM qa_history ORDER BY created_at DESC LIMIT 10;

-- Query login history
SELECT * FROM login_history ORDER BY login_time DESC LIMIT 10;

-- Query corrections
SELECT * FROM correction_history ORDER BY created_at DESC LIMIT 10;
```

---

## Performance Considerations

- **Indexes:** All tables have indexes on foreign keys and timestamp fields
- **Ordering:** Default ordering by most recent first (-created_at)
- **JSON Fields:** Used for flexible metadata storage
- **Nullable User:** Anonymous users can use features (user_id is nullable)

---

## Data Privacy

- User data is stored securely in PostgreSQL
- Passwords are hashed using Django's authentication system
- IP addresses are stored for security monitoring
- All history tables track both authenticated and anonymous users

---

## Backup Recommendations

Regular backups are recommended:

```bash
# Backup entire database
docker-compose exec db pg_dump -U chemtutor_user chemtutor_db > backup.sql

# Restore from backup
docker-compose exec -T db psql -U chemtutor_user chemtutor_db < backup.sql
```

---
## 📈 Benefits of This Structure:

1. Data Analytics: Track feature usage, user behavior
2. Audit Trail: Know who did what and when
3. User Insights: Understand your user base better
4. Debugging: Track errors and issues more effectively
5. Personalization: Build user-specific features later

## Future Enhancements

Potential improvements:
1. Add analytics dashboard for usage statistics
2. Implement data retention policies
3. Add user activity reports
4. Create API endpoints for history retrieval
5. Add export functionality for user data
