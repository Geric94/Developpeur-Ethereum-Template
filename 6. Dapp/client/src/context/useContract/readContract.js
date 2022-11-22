import { useState } from "react";

const ReadContract = (instance, admin) => {
  const [count, setCount] = useState(0);

  const whiteList = async (instance) => {
    if (!instance) {
      return false;
    }
    const voters = await instance.methods.getVoter(admin).call({ from: admin });
    
    return await Promise.all(
      voters.map(async (address) => {
        return {
        };
      })
    ).then((values) => values.filter((value) => value.isWhitelisted));
  };

  const getProposals = async (instance) => {
    if (!instance) {
      return false;
    }
    let propals = [];
    const proposalCount = await instance.methods.getOneProposal(0).call({ from: admin })
    return new Promise(async (resolve) => {
      for (let i = 0; i <= proposalCount; i++) {
        const proposal = await instance.methods.getOneProposal(i).call({ from: admin })
        if (!!proposal.description.length) {
          propals.push(proposal);
        }
      }
      resolve(propals);
    }).then((values) => values);
  };

  const getWinningProposal = async (instance) => {
    const proposals = await getProposals(instance);
    proposals.sort((a,b) => b.voteCount - a.voteCount)
    return proposals[0];
  }

  return {
    count,
    whiteList,
    getProposals,
    getWinningProposal,
  };
};
export default ReadContract;
