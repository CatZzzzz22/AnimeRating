# AnimeRating

Dataset source: https://www.kaggle.com/datasets/dbdmobile/myanimelist-dataset?resource=download&select=users-score-2023.csv

# Set Up Data Set
To set up the data set, first you need to install MySQL.
- a. On MacOS, run the commands in terminal:
  - brew update
  - brew install mysql
  - If you never installed brew, run:
    - /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    - echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
    - eval "$(/opt/homebrew/bin/brew shellenv)"

- b. On Windows:
  - You need to install Git Bash: https://git-scm.com/download/win
  - i. If you prefer to use VS Code:
    - Open VS Code, press Ctrl+Shift+P and search for "Terminal: Select Default Profile"
    - Choose Git Bash
    - Now press Ctrl+` to open a new terminal
  - ii. Otherwise:
    - Click the Windows Start Menu
    - Search for Git Bash
    - Click it and it will open a standalone terminal window

Then run:
- mysql -u [your MySQL username][1] -p (log into MySQL)
  => input your password[1] and then you'll get into MySQL
- SET GLOBAL local_infile = 1; (turn on the permission to load the CSV file)
- exit (exit MySQL)
- chmod +x setup_dataset.sh
- ./setup_dataset.sh

Enter your username and password in the prompt[1] 

And now the dataset is ready!

# To Test Your SQL Command in MySQL
Run the following commands in the terminal:
- mysql -u [your MySQL username][1] -p
- USE AnimeRatingApp;
Now you can test your SQL commands.
If you want to exit MySQL, simply input "exit".

[1] The username and password are typically set during the installation of MySQL. If you didn't change the username, it's typically "root" by default.
