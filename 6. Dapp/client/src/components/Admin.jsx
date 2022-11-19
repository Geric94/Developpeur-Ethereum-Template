import { useState, useEffect } from "react";
import { listVotants/*, currentState*/ } from './Vote/index';
import firebaseApp from './FireBase';

function Admin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [logged, setLogged] = useState(false);
    const [data, setData] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [address, setAddress] = useState('');
    const [lastName, setLastName] = useState('');
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
        let _balance = 0;
        let _id = address;
        let _lastName = lastName;
        let obj = {
            id: _id,  //address eth
            lastName: _lastName,
            balance: _balance
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

    /*function nextState() {
        let _currentState = currentState++;
        setState(_currentState);
    }*/
    
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
                Liste des votants
                {loaded &&
                    data.map(element => {
                        return <li key={element.lastName}>{element.id} - {element.balance}
                        - <button value={element.id} onClick={deleteAddress}>Delete</button></li>
                    })
                }
                Ajout d\'une addresse dans la liste des votants
                <div>
                    Name:<input type="text" onChange={e => setLastName(e.target.value)} />
                    Adresse:<input type="text" onChange={e => setAddress(e.target.value)} />
                </div>
                <button onClick={addOnWhitelist}>Ajouter à la liste des votants</button>
            </div>
            }
        </div>
    )
}
//Change d\'état
//<button onClick={nextState}>Etape suivante</button>

export default Admin;