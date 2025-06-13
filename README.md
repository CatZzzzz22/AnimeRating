# AnimeRating

Dataset source: https://www.kaggle.com/datasets/dbdmobile/myanimelist-dataset?resource=download&select=users-score-2023.csv

# Set Up Data Set
To set up the data set, first you need to install MySQL.
- on MacOS:
  - brew update
  - brew install mysql
  - if you never installed brew, run: /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
- on Windows:

Then:
- chmod +x setup_dataset.sh
- ./setup_dataset.sh

Enter your username and password in the prompt (the username and password are typically set during installation of MySQL. If you didn't change the username, it's typically "root" by default).

And now the dataset is ready!
