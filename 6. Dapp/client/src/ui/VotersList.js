import React, { useContext, useState, useEffect, useMemo } from "react";
import { Web3Context } from "../context";
import useContract from "../context/useContract";
import Table from "./components/Table";
import Row from "./components/Row";
import Spinner from "./components/Spinner";

const VotersList = ({ width = "6" }) => {
  const [voters, setVoters] = useState([]);
  const [voterAddress, setVoterAddress] = useState(null);
  const { instance, admin } = useContext(Web3Context);
  const {
    transaction,
    etatCurrent,
    eventTxHash,
    status,
    whiteList,
    addVoter,
    removeVoter,
  } = useContract(instance, admin);

  const handleOnChange = (e) => setVoterAddress(e.target.value);
  const handleOnSubmit = (e) => { e.preventDefault(); addVoter(voterAddress); setVoterAddress(null); };

  useEffect(() => {
    whiteList(instance).then(setVoters);
  }, [instance, eventTxHash, voters, whiteList]);

  const isVoterRegistrationOpen = useMemo(
    () => !Boolean(!!voterAddress && parseInt(status) === 0),
    [voterAddress, status]
  );

  const isPending = useMemo(() => {
      console.log(transaction);
      if (transaction.status === etatCurrent.pending && 
          transaction.event === "VoterRegistered") { return true}
      return false;
    },
    [transaction, etatCurrent.pending]
  );
  
  const hasErrors = useMemo(() => !!voterAddress && parseInt(status) !== 0, [voterAddress, status ]);

  return (
    <div className={`col-md-${width}`}>
      <form onSubmit={handleOnSubmit} className="d-flex justify-content-between mt-5" >
        <div className="col-sm-8">
          <input type="text" className="form-control" aria-describedby="voterErrorText" value={voterAddress} onChange={handleOnChange} />
          {hasErrors && (
            <div id="voterErrorText" className="form-text" style={{ color: "crimson", height: "auto" }} >
              Voters registration is closed now
            </div>
          )}
        </div>
        <button type="submit" className="btn btn-secondary col-sm-3" disabled={isVoterRegistrationOpen} >
          Add Voter
        </button>
      </form>
      <Spinner isLoading={isPending} />
      <Table header="Voters" isLoading={isPending}>
        {!!voters &&
          voters.map(({ address }, index) => {
            return (
              <Row
                content={address}
                index={index}
                key={address}
              />
            );
          })}
      </Table>
    </div>
  );
};


export default VotersList;
