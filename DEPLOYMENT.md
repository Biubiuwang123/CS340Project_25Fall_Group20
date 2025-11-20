# Deployment Guide
## Deploying to classwork.engr.oregonstate.edu:2016

### Prerequisites
- SSH access to `classwork.engr.oregonstate.edu`
- Your ONID credentials
- Database credentials already configured in `project/database/db-connector.js`

### Deployment Methods

**Option A: Automated GitHub Deployment (Recommended)**

Use the provided script for automated deployment:
```bash
# From your local machine
./deploy-github.sh your-onid
```

This script will:
1. Create the directory structure (`cs340/project/home`)
2. Clone your GitHub repository
3. Copy files to a working directory (keeping original unchanged)
4. Install dependencies
5. Set up the database

**Option B: Manual GitHub Deployment**

Follow these steps manually:

```bash
# 1. SSH into the server
ssh your-onid@classwork.engr.oregonstate.edu

# 2. Create directory structure
mkdir -p ~/cs340/project/home
cd ~/cs340/project/home

# 3. Clone the repository
git clone https://github.com/Biubiuwang123/CS340Project_25Fall_Group20.git

# 4. Copy files to working directory (keeping original unchanged)
cp -r CS340Project_25Fall_Group20/project beaver-stationary
cp CS340Project_25Fall_Group20/DDL.sql beaver-stationary/
cp CS340Project_25Fall_Group20/DML.sql beaver-stationary/
cp CS340Project_25Fall_Group20/PL.sql beaver-stationary/

# 5. Navigate to working directory
cd beaver-stationary
```

**Option C: Using SCP (Alternative)**
```bash
# From your local machine, navigate to the project root
cd /Users/qwang/CS340Project_25Fall_Group20/CS340Project_25Fall_Group20

# Upload the entire project (excluding node_modules)
scp -r project DDL.sql PL.sql DML.sql your-onid@classwork.engr.oregonstate.edu:~/cs340/project/home/
```

### Step 2: Install Dependencies on Server

```bash
# Navigate to your working directory
cd ~/cs340/project/home/beaver-stationary  # or your chosen directory

# Install Node.js dependencies
npm install
```

### Step 3: Set Up Database

Make sure your database credentials in `project/database/db-connector.js` are correct for the server environment.

Then run the SQL files:
```bash
# Option 1: Use the run-sql-files.js script (recommended)
cd ~/cs340/project/home/beaver-stationary
node run-sql-files.js

# Option 2: Run SQL files manually via MySQL
mysql -h classmysql.engr.oregonstate.edu -u cs340_xushi -p cs340_xushi < DDL.sql
mysql -h classmysql.engr.oregonstate.edu -u cs340_xushi -p cs340_xushi < PL.sql
mysql -h classmysql.engr.oregonstate.edu -u cs340_xushi -p cs340_xushi < DML.sql
```

### Step 4: Start the Application

```bash
cd ~/cs340/project/home/beaver-stationary

# For production (runs in background with forever)
npm run production

# To stop the application
npm run stop_production

# To check if it's running
forever list
```

### Step 5: Verify Deployment

Visit: `http://classwork.engr.oregonstate.edu:2016/`

### Troubleshooting

1. **Port 2016 not accessible**: Make sure the port is open and you have permissions
2. **Database connection errors**: Verify credentials in `db-connector.js`
3. **Application not starting**: Check logs with `forever logs`
4. **Module not found errors**: Run `npm install` again

### Useful Commands

```bash
# View application logs
forever logs app.js

# Restart the application
forever restart app.js

# Stop the application
forever stop app.js

# Check if port 2016 is in use
lsof -i :2016
```

