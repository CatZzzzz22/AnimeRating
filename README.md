# AnimeRating
## C1 - Loading and Running
### Technical Requirements
- Node.js (latest stable) and NPM
  - Install Node.js: https://nodejs.org
- MySQL Community Server
- Python3 and pip3 (or Python and pip if you're on Windows)

First you need to install MySQL - follow the steps to install MySQL:
- a. For Mac users:
  - Run the following commands in the terminal
    ```
    brew update
    brew install mysql
    ```
  - If you never installed brew, run:
    ```
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
    eval "$(/opt/homebrew/bin/brew shellenv)"
    ```

- b. For Windows users:
  1. Download Installer: https://dev.mysql.com/downloads/installer/
  2. Run the installer
  3. After finishing installation, you need to install Git Bash: https://git-scm.com/download/win
    - i. If you prefer to use VS Code:
      - Open VS Code, press Ctrl+Shift+P and search for "Terminal: Select Default Profile"
      - Choose Git Bash
      - Now press Ctrl+` to open a new terminal
    - ii. Otherwise:
      - Click the Windows Start Menu
      - Search for Git Bash
      - Click it and it will open a standalone terminal window

If you get the error:
```"ERROR 3948 (42000) at line 4: Loading local data is disabled; this must be enabled on both the client and server sides"```.
It means you haven't turn on the permission of loading CSV files locally. Please refer to the section "Turn On Local Infile Permission In MySQL" and then rerun the bash file.

### Turn On Local Infile Permission In MySQL
You can choose to config the permission temporarily or make it permanent.
1. Turn on the permission temporarily:
   ```
   mysql -u [your MySQL username] -p      (log into MySQL)
   => input your password and then you'll get into MySQL
   SET GLOBAL local_infile = 1;           (turn on the permission to load the CSV file)
   exit                                   (exit MySQL)
   ```
The username and password are typically set during the installation of MySQL. It's typically "root" by default if you didn't change the username.

Note: If you choose to temporarily turn on the permission, then each time you see the error "Loading local data is disabled; this must be enabled on both the client and server sides", you need to set the variable to 1 again.

2. Turn on the permission permanently:

  ```nano /usr/local/etc/my.cnf```
- add the line under the section heading ```[mysqld]```: ```local_infile=1```
- Press Ctrl + O to save, Enter to confirm, and Ctrl + X to exit

  ```brew services restart mysql            (restart MySQL)```

To check if you have turned on the permission to load the CSV file in MySQL:
- run the following command in MySQL: 
  ```SHOW GLOBAL VARIABLES LIKE 'local_infile'```
- You should see local_infile is "ON"


### Set Up The Dataset
To create and load the sample database, see below section to run the backend.

### Run The Application
You need two terminals, one for frontend and one for backend, and keep them running at the same time.
- To Start The Frontend
  - Run the following commands in ```weebseek/frontend```:
    ```
    npm i
    npm run dev
    ```

- To Start The Backend
  - Create a file named ```.env``` in the ```weebseek/backend``` directory, in which put:
    ```
    DB_USER=your_username
    DB_PASSWORD=your_password
    ```
  - Run the following commands in ```weebseek/backend```:
    ```
    pip3 install -r requirements.txt
    python3 app.py
    ```

### Currently supported Features
- Sort animes by rating or aired date
- To do:
  - Filter animes by name, genres or type
  - Create accounts and log in
  - Create watchlists

## C2 - SQL Code
All SQL code for this project can be found in ```sql```

## C3 - SQL Queries for Features (test queries over sample data)
All SQL queries can be found in ```sample_sql```

## C4 - SQL Queries for Features (test queries over production data)
(to do for milestone 2)

## C5 - Application Code
All application code can be found in ```weebseek```

## Contributors
- Tracy Hua
- Grace Luo
- Mengdie Wu
- Kwan Yoon
- Catherine Zhang

## Source
Dataset source: https://www.kaggle.com/datasets/dbdmobile/myanimelist-dataset?resource=download&select=users-score-2023.csv
