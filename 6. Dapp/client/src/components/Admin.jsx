import { useState, useEffect } from "react";
import { listVotants } from './Vote/index';
import { v4 as uuidv4} from 'uuid';
import firebaseApp from './FireBase';
//import AddVotant from './Vote/AddVotant';

function Admin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [logged, setLogged] = useState(false);
    const [data, setData] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [address, setAddress] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        setLoaded(true);
    }, [data])

    function loggin() {
        firebaseApp.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            setLogged(true);
            setSuccess('Vous êtes logged');
            setError('');
            getData();
        })
        .catch((error) => {
            setLogged(false);
            setSuccess('');
            setError('Mauvaise authentification');
        })
    }

    function getData() {	
        listVotants.onSnapshot((querySnapshot) => {
            const items = [];
            querySnapshot.forEach((doc) => {
                items.push(doc.data());
            })
            setData(items);
        })
    }	

    function deleteAddress(e) {
        listVotants.doc(e.target.value).delete();
    }

    function addOnWhitelist() {
        let balance = 0;
        let id = uuidv4();
        let obj = {
            address: address,
            id: id,
            balance: balance
        }
        listVotants.doc(obj.id).set(obj)
        .then(result => {
            setSuccess('Vous avez été ajouter au vote, Demande d\'acceptation en cours');
            setError('');
        })
        .catch((err) => {
            setSuccess('');
            setError(err);
        })
    }

    return (
        <div>
            {error && <p className="alert error">{error}</p>}
            {success && <p className="alert success">{success}</p>}
            {!logged
            ?
            <div>
                Se logger à l'interface d'administration
                <input type="email" onChange={e => setEmail(e.target.value)} />
                <input type="password" onChange={e => setPassword(e.target.value)} />
                <button onClick={loggin}>Connexion</button>
            </div>
            :
            <div>
                Listing of accounts on the whitelist
                {loaded &&
                    data.map(element => {
                        return <li key={element.id}>{element.address} - {element.balance}
                        - <button value={element.id} onClick={deleteAddress}>Delete</button></li>
                    })
                }
                Add an address on the whitelist
                <input type="text" onChange={e => setAddress(e.target.value)} />
                <button onClick={addOnWhitelist}>Vous avez été ajouté à la liste des votants</button>
            </div>
            }
        </div>
    )
}

export default Admin;