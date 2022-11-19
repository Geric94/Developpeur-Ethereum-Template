import { EthProvider } from "./contexts/EthContext";
import { VotingProvider} from "./contexts/VotingContext";
import Intro from "./components/Intro/";
import Setup from "./components/Setup";
import Vote from "./components/Vote";
import Demo from "./components/Demo";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
      <div id="App" >
        <div className="container">
          <Intro />
          <hr />
          <EthProvider>
            <VotingProvider>
              <Setup />
              <hr />
              <Vote />
              <hr />
              <Demo />
              <hr />
              <Footer />
            </VotingProvider>
          </EthProvider>
        </div>
      </div>
  );
}

export default App;
