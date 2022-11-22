import { useState } from "react";

const WriteContract = (instance, admin) => {
  const [currentVoter, setCurrentVoter] = useState(null);

  const addVoter = async (address) => {
    setCurrentVoter(address);
    await instance.methods.addVoter(address).send({ from: admin });
  };
  const addProposal = async (content) => {
    await instance.methods.addProposal(content).send({ from: admin });
  };
  const vote = async (id) => {
    await instance.methods.vote(id).send({ from: admin });
  };
  const startProposalSession = async () => {
    await instance.methods.startProposalsRegistering().send({ from: admin });
  };
  const endProposalSession = async () => {
    await instance.methods.endProposalsRegistering().send({ from: admin });
  };
  const startVotingSession = async () => {
    await instance.methods.startVotingSession().send({ from: admin });
  };
  const endVotingSession = async () => {
    await instance.methods.endVotingSession().send({ from: admin });
  };
  const resetVotingSession = async () => {
    await instance.methods.VotesTallied().send({ from: admin });
  };

  return {
    currentVoter,
    addVoter,
    startProposalSession,
    endProposalSession,
    startVotingSession,
    endVotingSession,
    resetVotingSession,
    addProposal,
    vote,
  };
};
export default WriteContract;
