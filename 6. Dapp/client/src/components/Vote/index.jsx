import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import InfosAccount from './InfosAccounts';
import AddVotant from './AddVotant';
import firebaseApp from '../FireBase';
//import './Voter.css';

const listVotants = firebaseApp.firestore().collection('listvotants');

function Voter() {
    const [loader, setLoader] = useState(true);
    const [accounts, setAccounts] = useState([]);
    const [balance, setBalance] = useState();
    const [countVotant, setCountVotant] = useState(0);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');


    useEffect(() => {
        getAccounts();
        setLoader(false);
        getCountVotant();
    }, [])

    window.ethereum.addListener('connect', async(reponse) => {
        getAccounts();
        //console.log('Ok');
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
            let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setAccounts(accounts);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const balance = await provider.getBalance(accounts[0]);
            const balancelnEth = ethers.utils.formatEther(balance);
            setBalance(balancelnEth);
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
            <AddVotant accounts={accounts} countVotant={countVotant} setCountVotant={setCountVotant} getCountVotant={getCountVotant} balance={balance}
                setBalance={setBalance} setError={setError} setSuccess={setSuccess} />
        </div>
    );
}

export  {listVotants}
export default Voter;