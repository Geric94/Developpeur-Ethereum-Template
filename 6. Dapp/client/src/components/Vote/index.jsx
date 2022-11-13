import { useState, useEffect } from 'react';
//import { ethers } from 'ethers';
//import './Voter.css';

function Voter() {
    const [loader, setLoader] = useState(true);
    const [accounts, setAccounts] = useState([]);
    /*const [balance, setBalance] = useState();
    const [succes, setSucces] = useState('');
    const [error, setError] = useState('');*/

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
        }
    }

    return (
        <div className="Voter">
            {!loader &&
            accounts.length > 0 ?
            <p>You are connect with this account : {accounts[0]} </p>
            :
            <p>You have not conneted your Metamask account</p>
            }
        </div>
    );
}

export default Voter;