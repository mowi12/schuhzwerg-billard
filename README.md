<p align="center">
    <a href="https://schuhzwerg.com">
        <img src="static/img/logo.png" alt="logo" width="300">
    </a>
</p>

<h1 align="center">Schuhzwerg Billard</h1>

### How to run locally

1. Run `npm install` to get the dependencies.
2. Run `npm run start` in the root directory of this repository.

### Build for production

1. Run `npm install` to get the dependencies.
2. Run `npm run build` to build for production.
3. Run `npm run serve` to test your build locally.

### Adding a new game

`python3 schuh.py <Player1> <Player2> (-w <Player1|Player2>)`

The first two arguments declare the names of the players.
The `-w W` argument is optional and is only appened if either one of the players won.
If the game ended in a draw, the argument if removed and a draw is added to the list of games.

### Help

Enter `python3 schuh.py -h` to show a list of available options.
