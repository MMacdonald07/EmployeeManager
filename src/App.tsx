import React from "react";
import Amplify from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import config from "./aws-exports";
import "@aws-amplify\\ui\\dist\\styles.css";
import "./App.css";

Amplify.configure(config);

function App() {
    return (
        <div className="App">
            <header className="App-header">Hello World</header>
        </div>
    );
}

export default withAuthenticator(App);
