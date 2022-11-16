import { listVotants } from './index';
import { v4 as uuidv4} from 'uuid';

function AddVotant(props) {

    function createDoc(newDataObj) {		
        //Refresh number of whitelisted	
        props.getCountVotant();
        console.log(newDataObj.id);

        //The Ethereum address is valid	
        if(newDataObj.address.match(/^0x[a-fA-F0-9]{40}$/)) {	
            //Whitelist limit exceeded ?
            if(props.countVotant < 5) {
                //Does this address already exists in the DB ?
                let i = 0;
                listVotants.where("address", "==", newDataObj.address)
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
                                props.setSuccess('You have been added to the whitelist !')
                                props.setError('');
                            })
                            .catch((err) => {
                                props.setSuccess('');
                                props.setError('Error, we are sorry.');
                            })
                        }
                        else {
                            props.setSuccess('');
                            props.setError('Not enought funds on your wallet (0.3 minimum).');
                        }
                    }
                    else {
                            props.setSuccess('');
                            props.setError('this address is already on the whitelist !');
                    }
                })
                .catch(function(error) {
                    props.setSuccess('');
                    props.setError('Error we are sorry.');
                })
            }
            else {
                props.setSuccess('');
                props.setError('Whitelist max limit exceeded.');
            }
            setTimeout(props.getCountVotant, 500);
            //props.getCountVotant();
        }
        else {
            props.setSuccess('');
            props.setError('Invalid address.');
        }
    }
    return (
        <div>
            {//props.balance >= 0.3 &&
                <button className="btn" onClick={() => {
                    createDoc({address: props.accounts[0], id: uuidv4(), balance: props.balance})
                }}>Add Votant</button>
            }
        </div>
    )
}

export default AddVotant;