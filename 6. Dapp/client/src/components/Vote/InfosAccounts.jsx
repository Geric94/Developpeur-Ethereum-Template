function InfosAccount(props) {
    return (
        <div>
            {   !props.loader &&
                props.accounts.length > 0 ?
                <div>
                    <p>Vous êtes connecté avec cette adresse : {props.accounts[0]}</p>
                    {props.balance && <p>Vous avez {props.balance} Eth sur votre compte.</p>}
                    {props.balance < 0.3 && <p className="infos">Vous n'avez pas assez d'ETH sur votre compte pour participer au vote.</p>}
                </div>
                :
                <p>Vous n'êtes pas connecté avec votre wallet à ce site.</p>
            }
        </div>
    )
}

export default InfosAccount;