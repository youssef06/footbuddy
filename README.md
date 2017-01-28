FootBuddy: A smart command line tool for Football fans
==================================================
All data is from [api.football-data.org](http://api.football-data.org/)

- Next 5 games of your favourite team

![Screen1](https://raw.githubusercontent.com/youssef06/footbuddy/master/images/1.gif)

- Last 5 games of another team 

![Screen2](https://raw.githubusercontent.com/youssef06/footbuddy/master/images/2.gif)

- Check and navigate through a league fixtures

![Screen3](https://raw.githubusercontent.com/youssef06/footbuddy/master/images/3.gif)

- Check league table

![Screen4](https://raw.githubusercontent.com/youssef06/footbuddy/master/images/4.gif)

- Check upcoming/past games of your favourite team or any other team.
- Check league tables.
- Check league fixtures for any league.

If you have any suggestion/fix please feel free to open an issue or contribute :)

Install
-------

```
npm install -g footbuddy
```

Commands
------- 
You can view all available commands using:
```
footbuddy -h
```
Available commands:

```
  next [n]     Check upcoming n games
  last [n]     Check last n games
  table        View league table
  competition  View competition
```

On first use you will be asked to choose a favourite team, that team will be later used as a default value for your next commands unless you specify the "--custom" option:
```
footbuddy next 5 --custom
# you will be prompted to choose a different team for this command
``` 
TODO
-------
 
 Add more capabilities to the Bot:
 - Give the user the ability to change his favourite team.