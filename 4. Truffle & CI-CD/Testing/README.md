<h1 align="center">Projet Testing système de vote (Hardhat) 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <img src="https://img.shields.io/badge/npm-%3E%3D5.5.0-blue.svg" />
  <img src="https://img.shields.io/badge/node-%3E%3D9.3.0-blue.svg" />
  <a href="https://github.com/kefranabg/readme-md-generator#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/kefranabg/readme-md-generator/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/kefranabg/readme-md-generator/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/geric94/Voting" />
  </a>
</p>

> CLI that generates beautiful README.md files.

## Prerequisites

- npm >=5.5.0
- node >=9.3.0

## Install
```sh
npm install
```

## Dependencies
```sh
npm install @nomicfoundation/hardhat-toolbox @nomiclabs/hardhat-ethers @openzeppelin/test-helpers chai ethers hardhat @openzeppelin/contracts solidity-coverage
```

## Usage
```sh
npm run start
```
## Run tests
```sh
npx hardhat test
```

## Result tests
```text
  TEST: Voting
    TEST: Owner right
      ✓ Eric is the owner ?
      ✓ Trudy must not be the owner
      ✓ Trudy can't add a voter
      ✓ Eric can add a voter
    TEST: Registering Voters
      ✓ Checking that 'dan' is not a voter
      ✓ Alice checks if she is a voter
      ✓ Alice checks if 'dan' is a voter
      ✓ Alice is already a voter
      ✓ Too late for 'dan', registrations are closed
    TEST: Proposal Registered
      ✓ Charlie tries to make a proposal but the session is not started
      ✓ Trudy tries to make a proposal but she is not a registered voter
      ✓ Charlie tries to start the proposal session but is not allowed to
      ✓ Eric opens the proposal session
    TEST: Proposal Registered suite
      ✓ Check the change to the proposal session is canceled, when called twice
      ✓ Check the ProposalRegistered event is emitted when a proposal is added
      ✓ Check the addProposal function is canceled if the proposal is empty
      ✓ Check the getOneProposal function will be canceled if the sender is not a voter
      ✓ Check the initial proposal
      ✓ Alice add proposals
      ✓ Check the endProposalsRegistering function can only be called by the owner
      ✓ Check the session has gone from ProposalsRegistrationStarted to ProposalsRegistrationEnded
    TEST: Voting Session Started
      ✓ Check the change to end proposal session is canceled, when called twice
      ✓ Check the voting session has not started yet
      ✓ Check the setVote function will cancel if the sender is not a voter
      ✓ Check the startVotingSession() function will be canceled if the caller is not the owner
      ✓ Check the session has gone from ProposalsRegistrationEnded to VotingSessionStarted
      ✓ Check the startVotingSession function will be reestablished if the voting session is already started
      ✓ Must be reinstated because an invalid vote ID was submitted
      ✓ Test the setVote function
      ✓ Test that a voter can only vote once
      ✓ Test that the changing session can only be called by the contract owner
      ✓ End of the Voting session
      ✓ Test that the function will abort if the voting session hasn't started yet
    TEST: Votes Tallied
      ✓ Test that the tallyVotes function can only be called by the contract owner
      ✓ Switching to the vote analysis session
      ✓ Fin du vote
```      

## Run Coverages
```sh
npx hardhat coverage
```

```txt
-------------|----------|----------|----------|----------|----------------|
File         |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
-------------|----------|----------|----------|----------|----------------|
 contracts/  |      100 |      100 |      100 |      100 |                |
  Voting.sol |      100 |      100 |      100 |      100 |                |
-------------|----------|----------|----------|----------|----------------|
All files    |      100 |      100 |      100 |      100 |                |
-------------|----------|----------|----------|----------|----------------|
```
For result, see the [here](https://github.com/Geric94/Developpeur-Ethereum-Template/blob/master/4.%20Truffle%20%26%20CI-CD/Testing/coverage/index.html).

## Author

👤 **Geric**

* GitHub: [@geric94](https://github.com/geric94)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/kefranabg/readme-md-generator/issues). You can also take a look at the [contributing guide](https://github.com/kefranabg/readme-md-generator/blob/master/CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2022 [Geric](https://github.com/geric94).<br />
This project is [MIT](https://github.com/kefranabg/readme-md-generator/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
