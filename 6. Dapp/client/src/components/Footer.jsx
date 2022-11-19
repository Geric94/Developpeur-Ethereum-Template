import React from "react";
import useEth from "../contexts/EthContext/useEth";

function Link({ uri, text }) {
  return <a href={uri} target="_blank" rel="noreferrer">{text}</a>;
}

function Footer() {
  const { stateEth: { artifact, contract } } = useEth();
  
  return (
    <footer>
      <h2>Firebase: 
      <Link uri={"https://console.firebase.google.com/project/voting-ca632/firestore/data/~2Flistvotants~2F0x2108EAb3Ad8bfE50962FA4d1e107b573C0432A66"} 
        text={"Listes des votants"} /></h2>
        <nav className="navbar navbar-light bg-light fixed-bottom">
          <div className="container-fluid float-end">
            <p></p>
            <p>
            <strong>contract's address : </strong>
            {
              !artifact ? 'Pas d\'artifact' :
              !contract ? 'Pas de contrat' :
                contract._address
            }
            </p>
          </div>
        </nav>
    </footer >
  );
}

export default Footer;
