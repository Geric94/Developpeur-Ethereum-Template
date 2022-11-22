import React, { useEffect, useMemo, useContext/*, useState*/ } from "react";
import withContext, { Web3Context } from "./context";
import useContract from "./context/useContract";
import Header from "./ui/components/Header";
import Footer from "./ui/components/Footer";
import Winner from "./ui/components/Winner";
import VotersList from "./ui/VotersList";
import ProposalList from "./ui/ProposalList";
import Spinner from "./ui/components/Spinner";
import "./App.css";

const Session = () => {
  const { instance, admin } = useContext(Web3Context);
  const {
    toast: { visible, message },
  } = useContract(instance, admin);
  const visibility = useMemo(() => (visible ? "show" : "hide"), [visible]);

  return (
    <div className="position-fixed bottom-5 end-0 p-3" style={{ zIndex: 5 }}>
      <div
        id="liveToast"
        className={`toast ${visibility}`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="toast-header d-flex justify-content-between">
        </div>
        <div className="toast-body">{message}</div>
      </div>
    </div>
  );
};

function App({ connectWeb3, instance, admin, endVoting }) {
  const { transaction, etatCurrent } =
    useContract(instance, admin);

  useEffect(() => {
    connectWeb3();
  }, [instance, connectWeb3]);

  const isPending = useMemo(() => {
    return (
      transaction.status === etatCurrent.pending &&
      transaction.event === "WorkflowStatusChange"
    );
  }, [transaction, etatCurrent.pending]);

  return (
    <>
      <Session/>
      <Header />
      <Spinner isLoading={isPending}>
        Please wait while we are processing your transaction ...
      </Spinner>
      {endVoting ? <Winner /> : null}
      <div className="container">
        <div className="row">
          <VotersList />
          <ProposalList />
        </div>
      </div>
      <Footer />
    </>
  );
}
export default withContext(App);
