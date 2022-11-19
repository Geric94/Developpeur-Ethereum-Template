import { listVotants } from './index';

function AddVotant(props) {

    function createDoc(newDataObj) {
        //Refresh number of whitelisted	
        props.getCountVotant();
        //console.log(newDataObj.id);

        //The Ethereum address is valid	
        if(newDataObj.id.match(/^0x[a-fA-F0-9]{40}$/)) {	
            //Whitelist limit exceeded ?
            if(props.countVotant < 5) {
                //Does this address already exists in the DB ?
                let i = 0;
                listVotants.where("id", "==", newDataObj.id)
                .get()
                .then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        i++;
                    })
                    //If this address does not already exist in the DB, we add it
                    if(i < 1) {
                        if(props.balance >= 0.3) {
                            listVotants.doc(newDataObj.id).set(newDataObj)
                            .then(result => {
                                props.setSuccess('Vous avez été ajouté sur la liste des votants !')
                                props.setError('');
                            })
                            .catch((err) => {
                                props.setSuccess('');
                                props.setError('Désolé, il y a eu une erreur(1).');
                            })
                        }
                        else {
                            props.setSuccess('');
                            props.setError('Vous n\'avez pas asser d\'ETH pour participé au vote (0.3 minimum).');
                        }
                    }
                    else {
                            props.setSuccess('');
                            props.setError('Vous étes déjà sur la liste des votants !');
                    }
                })
                .catch(function(error) {
                    props.setSuccess('');
                    props.setError('Désolé, il y a eu une erreur(2).');
                })
            }
            else {
                props.setSuccess('');
                props.setError('La limite du nombre de votants a été atteintes. A une prochaine fois');
            }
            setTimeout(props.getCountVotant, 500);
            //props.getCountVotant();
        }
        else {
            props.setSuccess('');
            props.setError('Adresse invalide.');
        }
    }
    return (
        <div>
            {props.balance >= 0.3 &&
                <button className="btn" onClick={() => {
                    createDoc({id: props.accounts[0], lastName: props.lastName, balance: props.balance})
                }}>Demande de participation au vote</button>
            }
        </div>
    )
}

export default AddVotant;