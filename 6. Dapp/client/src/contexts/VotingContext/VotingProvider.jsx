import React, { useState, useReducer, useCallback, useEffect } from "react";
import VotingContext from "./VotingContext";
import { reducer, actions, initialState } from "./stateVoting";

function VotingProvider({ children }) {
  const [stateVoiting, dispatch] = useReducer(reducer, initialState);
  const [isOwner/*, setIsOwner*/] = useState(false);
  const [currentSession/*, setCurrentSession*/] = useState(null);

  const init = useCallback(
    async artifact => {
      if (artifact) {
        //const { abi } = artifact;
        try {
        } catch (err) {
          console.error(err);
        }
        dispatch({
          type: actions.init,
          data: { artifact }
        });
      }
    }, []);

  useEffect(() => {
    const tryInit = async () => {
      try {
        const _artifact = require("../../contracts/Voting.json");
        init(_artifact);
      } catch (err) {
        console.error(err);
      }
    };

    tryInit();
  }, [init]);

  /*useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = () => {
      init(stateVoiting.artifact);
    };

    events.forEach(e => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach(e => window.ethereum.removeListener(e, handleChange));
    };
  }, [init, stateVoiting.artifact]);*/

  const userSettings = {
    isOwner,
    //isRegistered,
    currentSession,
    /*fetchCurrentSession,
    hasVoted,
    setHasVoted,
    wrapperHasVoted*/
};

return (
    <VotingContext.Provider value={{
      stateVoiting,
      dispatch,
      userSettings
    }}>
      {children}
    </VotingContext.Provider>
  );
}

export default VotingProvider;
