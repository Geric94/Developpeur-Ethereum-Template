import { createContext } from "react";

const EthContext = createContext();

export default EthContext;

/*const withEthContext = Component => props => {
    return <EthContext.Consumer>{value => <Component {...value} {...props} />}</EthContext.Consumer>
}

export default withEthContext;*/
