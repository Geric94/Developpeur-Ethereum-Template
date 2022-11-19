const actions = {
  init: "INIT",
};

const initialState = {
  artifact: null,
  balance: null,
};

const reducer = (stateVoting, action) => {
  const { type, data } = action;
  switch (type) {
    case actions.init:
      return { ...stateVoting, ...data };
    default:
      throw new Error("Undefined reducer action type");
  }
};

export {
  actions,
  initialState,
  reducer
};
