Donc, ce que J'ai eu le temps de faire :
une interface rapide, toutes les fonctionnalité ont pratiquement été developpé,mais l'application plante, voir vidéo.
IL y a le code dans le dossier 6. dapp.
Le Voting.sol a été mofifié pour prendre en compte la sécurité, passage du tableau avec une limite à 50 propositions, donc dans le réportoire Truffle/contract
Echec du deploiement sur versel, surement parce que pas fonctionnel ?

![alt text](https://github.com/Geric94/Developpeur-Ethereum-Template/blob/master/6.%20Dapp/Capture%20d%E2%80%99%C3%A9cran%202022-11-23%20000220.png?raw=true)

Voila. 

# React Truffle Box

This box comes with everything you need to start using Truffle to write, compile, test, and deploy smart contracts, and interact with them from a React app.

## Installation

First ensure you are in an empty directory.

Run the `unbox` command using 1 of 2 ways.

```sh
# Install Truffle globally and run `truffle unbox`
$ npm install -g truffle
$ truffle unbox react
```

```sh
# Alternatively, run `truffle unbox` via npx
$ npx truffle unbox react
```

Start the react dev server.

```sh
$ cd client
$ npm start
  Starting the development server...
```

From there, follow the instructions on the hosted React app. It will walk you through using Truffle and Ganache to deploy the `SimpleStorage` contract, making calls to it, and sending transactions to change the contract's state.

## FAQ

- __How do I use this with Ganache (or any other network)?__

  The Truffle project is set to deploy to Ganache by default. If you'd like to change this, it's as easy as modifying the Truffle config file! Check out [our documentation on adding network configurations](https://trufflesuite.com/docs/truffle/reference/configuration/#networks). From there, you can run `truffle migrate` pointed to another network, restart the React dev server, and see the change take place.

- __Where can I find more resources?__

  This Box is a sweet combo of [Truffle](https://trufflesuite.com) and [Create React App](https://create-react-app.dev). Either one would be a great place to start!
