import "./App.css";
import { Route, Switch } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import ChatPage from "./Pages/ChatPage";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/" component={HomePage} exact />
        <Route path="/chats" component={ChatPage} />
      </Switch>
    </div>
  );
}

export default App;
