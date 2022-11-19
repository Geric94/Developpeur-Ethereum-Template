import { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import InfosAccount from './InfosAccounts';
import AddVotant from './AddVotant';
import firebaseApp from '../FireBase';
import EthContext from '../../contexts/EthContext/EthContext'
//import VotingContext from '../../contexts/VotingContext/VotingContext'
//import './Voter.css';

/* evenement à prendre en compte
event VoterRegistered(address voterAddress); 
event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
event ProposalRegistered(uint proposalId);
event Voted (address voter, uint proposalId);
*/

/*const WorkflowStatus = {
    RegisteringVoters: 0,
    ProposalsRegistrationStarted: 1,
    ProposalsRegistrationEnded: 2,
    VotingSessionStarted: 3,
    VotingSessionEnded: 4,
    VotesTallied: 5,
}*/

const listVotants = firebaseApp.firestore().collection('listvotants');
const currentState = 0;

function Voter() {
    //const { stateEth: { accounts } } = useContext(EthContext);
    //const { stateEth: { contract, accounts } } = useContext(EthContext);
    //const { userSettings: { isOwner, currentSession } } = useContext(VotingContext);

    const [loader, setLoader] = useState(true);
    const [lastName, setLastName] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [balance, setBalance] = useState();
    const [countVotant, setCountVotant] = useState(0);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [state, setState] = useState(0); //int à RegisteringVoters


    useEffect(() => {
        getAccounts();
        setLoader(false);
        getCountVotant();
        setState(currentState);
    }, [])

    window.ethereum.addListener('connect', async(reponse) => {
        getAccounts();
    })

    window.ethereum.on('accountsChanged', () => {
        window.location.reload();
    })
    
    window.ethereum.on('chainChanged', () => {
        window.location.reload();
    })
    
    window.ethereum.on('disconnect', () => {
        window.location.reload();
    })
    
    async function getAccounts() {
        if (typeof window.ethereum !== 'undefined') {
            setLastName('Non Votant');
            let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setAccounts(accounts);
            const _web3Provider = new ethers.providers.Web3Provider(window.ethereum);
            const _balance = await _web3Provider.getBalance(accounts[0]);
            const _balanceInEth = ethers.utils.formatEther(_balance);
            setBalance(_balanceInEth);
        }
    }

    function getCountVotant() {
        listVotants.get().then(function(querySnapshot){
            setCountVotant(querySnapshot.size);
        })
    }

    return (
        <div className="Voter">
            {error && <p className="alert error">{error}</p>}
            {success && <p className="alert success">{success}</p>}
            <InfosAccount accounts={accounts} balance={balance} loader={loader} />
            <div className="RegisteringVoters">{
                state === 0  ?
                <div>Phase: Registering Voters
                    <AddVotant lastName={lastName} accounts={accounts} countVotant={countVotant} setCountVotant={setCountVotant} getCountVotant={getCountVotant} 
                    balance={balance} setBalance={setBalance} setError={setError} setSuccess={setSuccess} />
                </div>
                : <div>RegisteringVoters</div>
            }</div>
            <div className="ProposalsRegistrationStarted"> {
                state === 1 ?
                <div>Phase: Proposals Registration</div>
                : <div>Proposals Registration Not Started</div>
            }</div>
            <div className="VotingSessionStarted"> {
                state === 3 ?
                <div>Phase: Voting Session</div>
                : <div>Voting Session not Started</div>
            }</div>
            <div className="VotesTallied"> {
                state === 5 ?
                <div>Phase: Votes Tallied</div>
                : <div>Votes Tallied not Started</div>
            }</div>
        </div>
    );
}

export {listVotants, currentState}
export default Voter;