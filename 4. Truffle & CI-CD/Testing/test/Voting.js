const {
    BN,           // Big Number support
    constants,    // Common constants, like the zero address and largest integers
    expectEvent,  // Assertions for emitted events
    expectRevert, // Assertions for transactions that should fail
} = require("@openzeppelin/test-helpers");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");  //EGA
const { expect } = require("chai");
const { ethers } = require("hardhat");

/* Defining a constant object called for state of Workflow */
const WorkflowStatus = {
    RegisteringVoters: 0,
    ProposalsRegistrationStarted: 1,
    ProposalsRegistrationEnded: 2,
    VotingSessionStarted: 3,
    VotingSessionEnded: 4,
    VotesTallied: 5,
};

describe("TEST: Voting", () => {
    let voting; // reférence au contrat Voting

    let alice;
    let bob;
    let charlie;  //is too much hurry
    let dan; //not a voter
    let eric; //I am the owner
    let trudy; //bad girl

    beforeEach(async () => {
        const contractFactory = (await ethers.getContractFactory('Voting'));
        //liste des votants, le owner est le premier, soit eric.
        [eric, alice, bob, charlie, dan, trudy] = await ethers.getSigners();
        //deploiement du contrat
        voting = await contractFactory.deploy();
        //En attente du deploiement effectif
        await voting.deployed();
    });

    // ::::::::::::: Owner right ::::::::::::: //

    describe('TEST: Owner right', () => {
        it("Eric is the owner ?", async () => {
            const _owner = await voting.owner();
            await expect(eric.address).to.equal(_owner, "Eric should be the Owner");
        });
        it("Trudy must not be the owner", async () => {
            const _owner = await voting.owner();
            //await expectRevert(voting.owner("", {from: eric}), "ce joueur a déjà joué"); Essai
            await expectclea(trudy.address).not.to.equal(_owner, "Trudy should not be the Owner");
        });
        it("Trudy can't add a voter", async () => {
            //On precise que c'est trudy qui fait l'action
            const _addvoter = voting.connect(trudy).addVoter(bob.address);
            await expect(_addvoter).to.be.revertedWith("Ownable: caller is not the owner");
        });
        it("Eric can add a voter", async () => {
            //Pas de précision, donc c'est le owner cad eric
            const _addvoter = voting.addVoter(alice.address);
            await expect(_addvoter).to.emit(voting, "VoterRegistered").withArgs(alice.address);
            //expectEvent(_addvoter, "VoterRegistered", {address: bob.address, owner: bob}); Essai 2
        });
    });

    // ::::::::::::: Registering Voters ::::::::::::: //

    describe('TEST: Registering Voters', () => {
        beforeEach(async () => {
            await voting.addVoter(alice.address);
        });
        /* Vérifier que 'dan' n'est pas un électeur. */
        it("Checking that 'dan' is not a voter", async () => {
            const _getVoter = voting.getVoter(dan.address);
            await expect(_getVoter).to.be.revertedWith("You're not a voter");
        });
        /* Alice vérifie si elle est bien une électrice */
        it("Alice checks if she is a voter", async () => {
            const _getVoter = await voting.connect(alice).getVoter(alice.address);
            await expect(_getVoter.isRegistered).to.equal(true);
        });
        it("Alice checks if 'dan' is a voter", async () => {
            const _getVoter = await voting.connect(alice).getVoter(dan.address);
            await expect(_getVoter.isRegistered).to.equal(false);
        });
        /* Vérifier si Alice est déjà un électeur. */
        it("Alice is already a voter", async () => {
            await expect(voting.addVoter(alice.address)).to.be.revertedWith("Already registered");
        });
        /* Vérifier que l'inscription des électeurs est fermée après le début 
        de la période d'inscription des propositions. */
        it("Too late for 'dan', registrations are closed", async () => {
            //fin de la période d'enregistration des votants
            await voting.startProposalsRegistering();
            //donc, on ne peut pas rajouter 'dan'
            await expect(voting.addVoter(dan.address)).to.be.revertedWith("Voters registration is not open yet");
        });
    });

    // ::::::::::::: Proposal Registered ::::::::::::: //

    describe('TEST: Proposal Registered', () => {
        /* Ajout des votants au contrat de vote. */
        beforeEach(async () => {
            await voting.addVoter(alice.address);
            await voting.addVoter(bob.address);
            await voting.addVoter(charlie.address);
        });
        it("Charlie tries to make a proposal but the session is not started", async () => {
            /* Vérifier que la fonction addProposal n'est pas encore autorisée à être appelée. */
            const _addProposal = voting.connect(charlie).addProposal('Charlie proposal 1');
            await expect(_addProposal).to.be.revertedWith("Proposals are not allowed yet");
        });
        it("Trudy tries to make a proposal but she is not a registered voter", async () => {
            /* Vérifier que la fonction addProposal est annulée lorsque l'appelant n'est pas un électeur. */
            await expect(voting.addProposal(trudy.address)).to.be.revertedWith("You're not a voter");
        });
        it("Charlie tries to start the proposal session but is not allowed to", async () => {
            /* Tester que le changement de session appartient au propriétaire. */
            const _charlieTryChangeState = voting.connect(charlie).startProposalsRegistering();
            await expect(_charlieTryChangeState).to.be.revertedWith('Ownable: caller is not the owner');
        });
        it("Eric opens the proposal session", async () => {
            /* Vérifier que le statut du flux de travail est RegisteringVoters. */
            await expect(await voting.workflowStatus()).to.equal(WorkflowStatus.RegisteringVoters);
            /* Démarrage du processus d'enregistrement des propositions. */
            const startProposalTx = await voting.startProposalsRegistering();
            /* Vérifier que l'événement est émis avec les bons paramètres. */
            await expect(startProposalTx).to.emit(voting, 'WorkflowStatusChange').withArgs(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
            await expect(await voting.workflowStatus()).to.equal(WorkflowStatus.ProposalsRegistrationStarted);
        });
    });

    // ::::::::::::: Proposal Registered ::::::::::::: //

    describe('TEST: Proposal Registered suite', () => {
        /* Ajouter des électeurs au contrat. */
        beforeEach(async () => {
            await voting.addVoter(alice.address);
            await voting.addVoter(bob.address);
            await voting.addVoter(charlie.address);
            await voting.connect(eric).startProposalsRegistering();
        });
        /* Vérifier que le passage à la session de proposition est annulée, lorsqu'elle est appelée deux fois*/
        it("Check the change to the proposal session is canceled, when called twice", async () => {
            /* Début de l'enregistrement des propositions. */
            //await voting.startProposalsRegistering();
            const startProposalTx = voting.startProposalsRegistering();
            /* Vérifier que la transaction startProposalTx est annulée avec le message "L'enregistrement des
            propositions ne peut pas être démarré maintenant" */
            await expect(startProposalTx).to.be.revertedWith('Registering proposals cant be started now');
        });
        /* Tester que l'événement ProposalRegistered est émis lorsqu'une proposition est ajoutée. */
        it("Check the ProposalRegistered event is emitted when a proposal is added", async () => {
            /* Créer une nouvelle proposition appelée "Proposition Alice 1" et l'ajouter au contrat de vote. */
            const _addProposal = voting.connect(alice).addProposal('Alice proposal 1');
            /* Vérifier que l'événement est émis avec les bons arguments. */
            await expect(_addProposal).to.emit(voting, "ProposalRegistered").withArgs(WorkflowStatus.ProposalsRegistrationStarted);
        });
        /* Tester que la fonction addProposal est annulé si la proposition est vide. */
        it("Check the addProposal function is canceled if the proposal is empty", async () => {
            /* Créer une nouvelle proposition vide. */
            const _addProposal = voting.connect(bob).addProposal('');
            /* Tester que la fonction _addProposal() reviendra si la proposition est vide. */
            await expect(_addProposal).to.be.revertedWith('Vous ne pouvez pas ne rien proposer');
        });
        /* Tester que la fonction getOneProposal reviendra si l'expéditeur n'est pas un électeur. */
        it("Check the getOneProposal function will be canceled if the sender is not a voter", async () => {
            const fetchedProposalRevertedTX = voting.connect(trudy).getOneProposal(0);
            await expect(fetchedProposalRevertedTX).to.be.revertedWith("You're not a voter");
        });
        /* Teste la proposition initiale */
        it("Check the initial proposal", async () => {
            fetchedProposal = {
                description: "",
                voteCount: 0
            }
            fetchedProposal = await voting.connect(alice).getOneProposal(0);
            expect(fetchedProposal.description).to.equal('GENESIS');
            expect(fetchedProposal.voteCount).to.equal(0);
            //expect(fetchedProposal.voteCount).to.be.bignumber.equal( new BN(0));
        });
        /* Ajout de deux propositions au contrat. */
        it("Alice add proposals", async () => {
            fetchedProposal = {
                description: "",
                voteCount: 0
            }
            /* Alice ajoute deux propositions au contrat de vote. */
            await voting.connect(alice).addProposal('Alice proposal 1');
            await voting.connect(alice).addProposal('Alice proposal 2');
            /* Récupérer la proposition de la blockchain et vérifier que la description est correcte. */
            fetchedProposal = await voting.connect(alice).getOneProposal(2);
            expect(fetchedProposal.description).to.equal('Alice proposal 2');
            expect(fetchedProposal.voteCount).to.equal(0);
        });
        /* Tester que la fonction endProposalsRegistering ne peut être appelée que par le propriétaire. */
        it("Check the endProposalsRegistering function can only be called by the owner", async () => {
            const endProposalRevertedTx = voting.connect(trudy).endProposalsRegistering();
            await expect(endProposalRevertedTx).to.be.revertedWith('Ownable: caller is not the owner');
        });
        /* Tester que la session est passé de ProposalsRegistrationStarted à ProposalsRegistrationEnded. */
        it("Check the session has gone from ProposalsRegistrationStarted to ProposalsRegistrationEnded", async () => {
            /* Vérifier que le statut du workflow est ProposalsRegistrationStarted. */
            await expect(await voting.workflowStatus()).to.equal(WorkflowStatus.ProposalsRegistrationStarted);
            const endProposalSession = await voting.endProposalsRegistering();
            /* Vérifier que l'événement est émis avec les bons arguments. */
            await expect(endProposalSession).to.emit(voting, 'WorkflowStatusChange').withArgs(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
            /* Vérifier que le statut de la session est ProposalsRegistrationEnded. */
            await expect(await voting.workflowStatus()).to.equal(WorkflowStatus.ProposalsRegistrationEnded);
        });
    });

    // ::::::::::::: Voting Session Started ::::::::::::: //

    /* Le code ci-dessus teste le contrat de vote. C'est un test que la session de vote a commencé. */
    describe('TEST: Voting Session Started', () => {
        beforeEach(async () => {
            voting.addVoter(alice.address);
            voting.addVoter(bob.address);
            voting.addVoter(charlie.address);
            await voting.connect(eric).startProposalsRegistering();
            voting.connect(alice).addProposal('Alice proposal');
            voting.connect(bob).addProposal('Bob proposal');
            await voting.connect(eric).endProposalsRegistering();
        })
        /* Vérifier que la modification pour mettre fin à la session de proposition est annulée, 
        lorsqu'elle est appelée deux fois. */
        it("Check the change to end proposal session is canceled, when called twice", async () => {
            const _endProposalsRegistering = voting.endProposalsRegistering();
            await expect(_endProposalsRegistering).to.be.revertedWith('Registering proposals havent started yet');
        });
        /* Tester que la session de vote n'a pas encore commencé. */
        it("Check the voting session has not started yet", async () => {
            const _setVote = voting.connect(charlie).setVote(1);
            await expect(_setVote).to.be.revertedWith('Voting session havent started yet');
        });
        /* Tester que la fonction setVote s'annulera si l'expéditeur n'est pas un électeur. */
        it("Check the setVote function will cancel if the sender is not a voter", async () => {
            const _setVote = voting.connect(trudy).setVote(1);
            await expect(_setVote).to.be.revertedWith("You're not a voter");
        });
        /* Tester que la fonction startVotingSession() sera annulée si l'appelant n'est pas le propriétaire. */
        it("Check the startVotingSession() function will be canceled if the caller is not the owner", async () => {
            const _startVotingSession = voting.connect(alice).startVotingSession();
            await expect(_startVotingSession).to.be.revertedWith('Ownable: caller is not the owner');
        });
        /* Vérifier que l'état du workflow est correct. */
        it("Check the session has gone from ProposalsRegistrationEnded to VotingSessionStarted", async () => {
            const _startVotingSession = voting.startVotingSession();
            await expect(_startVotingSession).to.emit(voting, 'WorkflowStatusChange').withArgs(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
            await expect(await voting.workflowStatus()).to.equal(WorkflowStatus.VotingSessionStarted);
        });
        /* Tester que la fonction startVotingSession sera rétablie si la session de vote est déjà démarrée. */
        it("Check the startVotingSession function will be reestablished if the voting session is already started", async () => {
            await voting.startVotingSession();
            const _startVotingSessions = voting.startVotingSession();
            await expect(_startVotingSessions).to.be.revertedWith('Registering proposals phase is not finished');
        });
        /* Tester que la fonction setVote sera rétablie si un identifiant de vote invalide est soumis. */
        it("Must be reinstated because an invalid vote ID was submitted", async () => {
            await voting.startVotingSession();
            const _setVote = voting.connect(alice).setVote(42);
            await expect(_setVote).to.be.revertedWith('Proposal not found');
        });
        /* Le code ci-dessus teste la fonction setVote. 
           Il teste que l'électeur a voté et que le voteCount a augmenté de 1. */
        it("Test the setVote function", async () => {
            /* Démarrage d'une session de vote. */
            await voting.startVotingSession();
            /* Alice vote pour la deuxième proposition */
            const _setVote = await voting.connect(alice).setVote(2);
            await expect(_setVote).to.emit(voting, "Voted").withArgs(alice.address, 2);
            /* Alice a bien voté */
            const _getVoter = await voting.connect(alice).getVoter(alice.address);
            await expect(_getVoter.hasVoted).to.be.equal(true);
            /* Récupérer la proposition avec l'identifiant 2 et 
            vérifier que la description est 'bien celle de Bob et que le voteCount est 1. */
            const _getOneProposal = await voting.connect(alice).getOneProposal(2);
            await expect(_getOneProposal.description).to.be.equal('Bob proposal');
            await expect(_getOneProposal.voteCount).to.be.equal(1);
        });
        /* Tester qu'un électeur ne peut voter qu'une seule fois. */
        it("Test that a voter can only vote once", async () => {
            await voting.startVotingSession();
            await voting.connect(alice).setVote(2);
            const _setVote = voting.connect(alice).setVote(1);
            await expect(_setVote).to.be.revertedWith('You have already voted');
        });
        /* Tester que la fonction endVotingSession ne peut être appelée que par le propriétaire du contrat. */
        it("Test that the changing session can only be called by the contract owner", async () => {
            const _endVotingSession = voting.connect(alice).endVotingSession();
            await expect(_endVotingSession).to.be.revertedWith('Ownable: caller is not the owner');
        });
        /* Tester que la fonction endVotingSession fonctionne comme prévu. */
        it("End of the Voting session", async () => {
            await voting.startVotingSession();
            await expect(await voting.workflowStatus()).to.equal(WorkflowStatus.VotingSessionStarted);
            const _endVotingSession = voting.endVotingSession();
            await expect(_endVotingSession).to.emit(voting, 'WorkflowStatusChange').withArgs(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
            await expect(await voting.workflowStatus()).to.equal(WorkflowStatus.VotingSessionEnded);
        });
        /* Tester que la fonction endVotingSession() s'annulera si la session de vote n'a pas encore commencé. */
        it("Test that the function will abort if the voting session hasn't started yet", async () => {
            const _endVotingSession = voting.endVotingSession();
            await expect(_endVotingSession).to.be.revertedWith('Voting session havent started yet');
        });
    });

    // ::::::::::::: Votes Tallied ::::::::::::: //

    /* Le code ci-dessus teste la session tally Votes. */
    describe('TEST: Votes Tallied', () => {
        /* Tester que la fonction tallyVotes ne peut être appelée que par le propriétaire du contrat. */
        it("Test that the tallyVotes function can only be called by the contract owner", async () => {
            const _tallyVotes = voting.connect(alice).tallyVotes();
            await expect(_tallyVotes).to.be.revertedWith('Ownable: caller is not the owner');
        });
        /* Passer à la session d'analyse des votes */
        it("Switching to the vote analysis session", async () => {
            await voting.addVoter(alice.address);
            await voting.addVoter(bob.address);
            await voting.startProposalsRegistering();
            await voting.connect(alice).addProposal('Alice proposal 1');
            await voting.connect(alice).addProposal('Alice proposal 2');
            await voting.endProposalsRegistering();
            await voting.startVotingSession();
            await voting.connect(alice).setVote(2);
            await voting.connect(bob).setVote(2);
            await voting.endVotingSession();
            await expect(await voting.workflowStatus()).to.equal(WorkflowStatus.VotingSessionEnded);
            const _tallyVotes = voting.tallyVotes();
            await expect(_tallyVotes).to.emit(voting, 'WorkflowStatusChange').withArgs(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
            await expect(await voting.workflowStatus()).to.equal(WorkflowStatus.VotesTallied);

            /* Obtenir l'ID de la proposition gagnante. */
            const _winningProposalId = await voting.winningProposalID();
            /* Vérifier que la proposition gagnante est la deuxième proposition. */
            await expect(_winningProposalId).to.be.equal(new BN(2));
        });
        /* Test de la fonction tallyVotes() dans le contrat Voting.sol. */
        it("Fin du vote", async () => {
            const _tallyVotes = voting.tallyVotes();
            await expect(_tallyVotes).to.be.revertedWith('Current status is not voting session ended');
        });
    });
});
