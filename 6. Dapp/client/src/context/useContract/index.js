import { useState, useEffect, useMemo } from "react";
import Web3 from "web3";
import WriteContract from "./writeContract";
import ReadContract from "./readContract";

const useContract = (instance, admin) => {
  const etatCurrent = {
    initial: "initial",
    pending: "pending",
    completed: "completed",
  };
  const {
    currentVoter,
    addVoter,
    startProposalSession,
    endProposalSession,
    startVotingSession,
    endVotingSession,
    resetVotingSession,
    addProposal,
    vote,
  } = WriteContract(instance, admin);

  const { count, whiteList, getProposals, getWinningProposal } = ReadContract(
    instance, admin
  );
  const [transaction, setTransactionStatus] = useState({
    status: etatCurrent.initial,
    event: null,
  });

  const [event, setEvent] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: "" });
  const [status, setStatus] = useState(0);
  const [eventTxHash, setTxHash] = useState("");

  const getStatus = async () => {
    if (!instance) {
      return false;
    }
    instance.methods.workflowStatus().call().then(([index]) => setStatus(index))
  };

  const updateStatus = (data) => setStatus(data.returnValues.newStatus);
  
  const registerEvent = (data) => {
    setTxHash(data.transactionHash);
    setEvent(data.event);
  };

  const displayToast = (message) => {
    setToast({ visible: true, message: message });
    setTimeout(() => setToast({ visible: false, message: "" }), 2000);
  };

  const handleTransaction = async (data, message) => {
    return new Promise((resolve) => {
      setTransactionStatus({
        status: etatCurrent.pending,
        event: data.event,
      });
      const web3 = new Web3(window.ethereum);
      web3.eth.getTransactionReceipt(data.transactionHash).then((result) => {
        setTimeout(() => {
          setTransactionStatus({
            status: result.status
              ? etatCurrent.completed
              : etatCurrent.initial,
            event: data.event,
          });
          if (data.event !== "WorkflowStatusChange") {
            displayToast(message);
          }
        }, 5000);
        resolve(data);
      });
    });
  };

  const subscribeEvents = () => {
    if (!instance) {
      return false;
    }
    instance.events.allEvents( {
      },(error,event)=> {
        if(error) {
          throw error
        }
        handleTransaction(event, `${event.event} !`)
        if(event.event === "WorkflowStatusChange"){
          updateStatus(event);
        } else if(event.event === "VotingSessionEnded"){
          document.location.reload()
        } else {
          registerEvent(event);
        }
      })
  };

  useEffect(() => {
    subscribeEvents();
    getStatus();
  }, [instance, getStatus, subscribeEvents]);

  return useMemo(() => {
    return {
      etatCurrent,
      transaction,
      status,
      count,
      event,
      eventTxHash,
      toast,
      whiteList,
      getProposals,
      getWinningProposal,
      addVoter,
      startProposalSession,
      endProposalSession,
      startVotingSession,
      endVotingSession,
      resetVotingSession,
      addProposal,
      vote,
    };
  }, [
    etatCurrent,
    transaction,
    status,
    count,
    event,
    eventTxHash,
    toast,
    whiteList,
    getProposals,
    getWinningProposal,
    addVoter,
    startProposalSession,
    endProposalSession,
    startVotingSession,
    endVotingSession,
    resetVotingSession,
    addProposal,
    vote,    
  ]);
};
export default useContract;
