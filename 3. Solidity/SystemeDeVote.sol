// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

//Permet de récupérer les électeurs, cad les accounts Remix
import "remix_accounts.sol";

//Votre smart contract doit importer le smart contract la librairie “Ownable” d’OpenZepplin.
import "https://github.com/OpenZeppelin/openzeppelin-contracts/contracts/access/Ownable.sol";


contract Voting is Ownable {
    //Votre smart contract doit définir les structures de données suivantes:
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId; //Amélioration: mettre en tableau pour voter pour plusieurs propositions
    }

    ////Donnée SessionEnregistrement
    struct Proposal {
        string description;
        uint voteCount;
    }

    //Votre smart contract doit définir une énumération qui gère les différents états d’un vote
    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

     //Votre smart contract doit définir les événements suivants : 
    event VoterRegistered(address voterAddress, string message); 
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus, string etape);
    event ProposalRegistered(uint proposalId, string message);
    event Voted(address voter, uint proposalId, string message);

    // Démarre par l'enregistrement de la liste des électeurs
    WorkflowStatus private g_etape_du_vote = WorkflowStatus.RegisteringVoters;

    //Liste des votants en fonction de leur adresse (WhiteList)
    //✔️ Le vote n'est pas secret pour les utilisateurs ajoutés à la Whitelist
    //✔️ Chaque électeur peut voir les votes des autres
    mapping(address => Voter) public g_Voters;

    //Nombre de votant
    uint private g_nombre_de_votant = 0;

    //Listes des propositions
    Proposal[] public g_proposals;

    //Votre smart contract doit définir un uint winningProposalId qui représente l’id du gagnant
    uint internal g_winningProposalId = 0;

    constructor() {
        //Initialisation à la première étape enregistrement des électeurs
        g_etape_du_vote = WorkflowStatus.RegisteringVoters;

        //Remplissage de la liste des électeurs automatique avec les 5 Accounts des personnes connues
        for (uint l_indexe = 0;l_indexe<5;l_indexe++){
            Voter memory l_electeur;
            l_electeur.isRegistered = true;
            l_electeur.hasVoted = false;
            l_electeur.votedProposalId = 0;

            g_Voters[TestsAccounts.getAccount(l_indexe)] = l_electeur;
            g_nombre_de_votant++;
        }
    }

    //Vérifie que l'action est autorisé à cette étape
	modifier ActionAutorised(WorkflowStatus _workflowStatus) {
        string memory l_information = string.concat(unicode"Action non autorisé à cette étape. Etape courante:", EtapeEnCours());
		require(g_etape_du_vote == _workflowStatus, l_information);
		_;
	}

    // Permet de donner accès aux personnes enregistrées pour le vote seulement
    modifier RegisteredVoters() {
            require(g_Voters[msg.sender].isRegistered == true, unicode"Vous n'êtes pas enregistré en tant qu'électeur.");
            _;
    }

    function NombreElecteur() public view returns (uint) {
        return (g_nombre_de_votant);
    }

    function EtapeEnCours() public view returns (string memory p_etape) {
        if (g_etape_du_vote == WorkflowStatus.RegisteringVoters)
            return ("RegisteringVoters");
        else if (g_etape_du_vote == WorkflowStatus.ProposalsRegistrationStarted)
            return ("ProposalsRegistrationStarted");
        else if (g_etape_du_vote == WorkflowStatus.ProposalsRegistrationEnded)
            return ("ProposalsRegistrationEnded");
        else if (g_etape_du_vote == WorkflowStatus.VotingSessionStarted)
            return ("VotingSessionStarted");
        else if (g_etape_du_vote == WorkflowStatus.VotingSessionEnded)
            return ("VotingSessionEnded");
        else if (g_etape_du_vote == WorkflowStatus.VotesTallied)
            return ("VotesTallied");
    }

    /*Pour débug
    function Sender() public view returns (address) {
        return (msg.sender);
    }*/

    //Voici le déroulement de l'ensemble du processus de vote :
    //A chaque fois que l'administrateur fait ce choix, le processus passe à l'étape suivante.
    //Oblige à respecter l'ordre du vote
    function changeEtape() public onlyOwner {
        //L'administrateur du vote commence la session d'enregistrement de la proposition.
        if (g_etape_du_vote == WorkflowStatus.RegisteringVoters) {
            g_etape_du_vote = WorkflowStatus.ProposalsRegistrationStarted;
            emit WorkflowStatusChange(g_etape_du_vote, WorkflowStatus.ProposalsRegistrationStarted, "ProposalsRegistrationStarted");
        }
        //L'administrateur de vote met fin à la session d'enregistrement des propositions.
        else if (g_etape_du_vote == WorkflowStatus.ProposalsRegistrationStarted) {
            g_etape_du_vote = WorkflowStatus.ProposalsRegistrationEnded;
            emit WorkflowStatusChange(g_etape_du_vote, WorkflowStatus.ProposalsRegistrationEnded, "ProposalsRegistrationEnded");
        }
        //L'administrateur du vote commence la session de vote.
        else if (g_etape_du_vote == WorkflowStatus.ProposalsRegistrationEnded) {
            g_etape_du_vote = WorkflowStatus.VotingSessionStarted;
            emit WorkflowStatusChange(g_etape_du_vote, WorkflowStatus.VotingSessionStarted, "VotingSessionStarted");
        }
        //L'administrateur du vote met fin à la session de vote.
        else if (g_etape_du_vote == WorkflowStatus.VotingSessionStarted) {
            g_etape_du_vote = WorkflowStatus.VotingSessionEnded;
            emit WorkflowStatusChange(g_etape_du_vote, WorkflowStatus.VotingSessionEnded, "VotingSessionEnded");
        }
        //L'administrateur passe à la délibération.
        else if (g_etape_du_vote == WorkflowStatus.VotingSessionEnded) {
            g_etape_du_vote = WorkflowStatus.VotesTallied;
            emit WorkflowStatusChange(g_etape_du_vote, WorkflowStatus.VotesTallied, "VotesTallied");
        }
        //Le systéme reste bloqué sur cette étape
        else if (g_etape_du_vote == WorkflowStatus.VotesTallied) {
            g_etape_du_vote = WorkflowStatus.VotesTallied;
            emit WorkflowStatusChange(g_etape_du_vote, WorkflowStatus.VotesTallied, "Terminated");
        }
    }

    ////Etat:RegisteringVoters

    //L'administrateur du vote enregistre une liste blanche des électeurs identifiés par leur adresse de contrat
    function AjouteElecteur(address p_electeurContractAddress) public ActionAutorised( WorkflowStatus.RegisteringVoters) onlyOwner {
        require(!g_Voters[p_electeurContractAddress].isRegistered, unicode"Cette adresse est déjà dans liste des électeurs.");

        Voter memory l_voter;
        l_voter.isRegistered = true;
        l_voter.hasVoted = false;
        l_voter.votedProposalId = 0;

        g_Voters[p_electeurContractAddress] = l_voter;
        g_nombre_de_votant++;
        emit VoterRegistered(p_electeurContractAddress, "VoterRegistered");
    }

    ////Etat:ProposalsRegistrationStarted

    //Les électeurs inscrits sont autorisés à enregistrer leurs propositions pendant que la session d'enregistrement est active.
    function AjouterUneProposition(string memory p_proposaldescription) public ActionAutorised( WorkflowStatus.ProposalsRegistrationStarted) RegisteredVoters {
        g_proposals.push(Proposal({description: p_proposaldescription, voteCount: 0}));
        emit ProposalRegistered( g_proposals.length, "ProposalRegistered");
    }

    ////Etat:ProposalsRegistrationEnded
    function NombreDeProposition() public view  ActionAutorised( WorkflowStatus.ProposalsRegistrationEnded) returns (uint) {
        return g_proposals.length;
    }

    ////Etat:VotingSessionStarted

    //Les électeurs commencent à voter pour les propositions
    function Vote(uint p_proposalId) public ActionAutorised( WorkflowStatus.VotingSessionStarted) RegisteredVoters {
        Voter storage l_electeur = g_Voters[msg.sender];
        require(l_electeur.isRegistered == true, unicode"Vous ne pouvez pas participer au vote");
        require(!l_electeur.hasVoted, unicode"Vous avez déja voté.");
        l_electeur.hasVoted = true;
        l_electeur.votedProposalId = p_proposalId;

        g_proposals[p_proposalId].voteCount++;
        emit Voted (msg.sender, p_proposalId, "Voted");
     }

    ////Etat:VotingSessionEnded
    //L'administrateur du vote comptabilise les votes.
    // Recherche de la meilleur proposition
    //✔️ Le gagnant est déterminé à la majorité simple
    //✔️ La proposition qui obtient le plus de voix l'emporte.
    function chercheIndexPropositionGagnant() public ActionAutorised( WorkflowStatus.VotingSessionEnded) onlyOwner{
        uint l_meilleurCount = 0;
        for (uint l_indexe = 0; l_indexe < g_proposals.length; l_indexe++) {
            if (g_proposals[l_indexe].voteCount > l_meilleurCount) {
                l_meilleurCount = g_proposals[l_indexe].voteCount;
                g_winningProposalId = l_indexe;
            }
        }
    } //Problème :si des propositions ont le même nombre de vote on renvoie la dernière. Mais, ce sera pour une version.

    ////Etat:VotesTallied

    //ou Votre smart contract doit définir une fonction getWinner qui retourne le gagnant.
    // en fait la proposition gagnante
    //Tout le monde peut vérifier les derniers détails de la proposition gagnante.
    function getWinner() external view ActionAutorised( WorkflowStatus.VotesTallied) returns (string memory)
    {
        return g_proposals[g_winningProposalId].description;
    }
}