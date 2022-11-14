import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import InfosAccount from './InfosAccounts'
//import './Voter.css';

function Voter() {
    const [loader, setLoader] = useState(true);
    const [accounts, setAccounts] = useState([]);
    const [balance, setBalance] = useState();
    //const [succes, setSucces] = useState('');
    //const [error, setError] = useState('');

    useEffect(() => {
        getAccounts();
        setLoader(false);
    }, [])

    window.ethereum.addListener('connect', async(reponse) => {
        getAccounts();
        console.log('Ok');
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

    return (
        <div className="Voter">
            <InfosAccount accounts={accounts} balance={balance} loader={loader} />
        </div>
    );
}

export default Voter;