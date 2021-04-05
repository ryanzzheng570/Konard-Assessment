import React, {Component} from "react";
import "./app.css";
import LabelsPanel from "../labelsPanel/labelsPanel";
import Messages from "../messages/messages";
import Header from "../header/header";
import SignIn from "../signIn/signIn";
import googleApi from "../../util/googleApi";
import setUtil from "../../util/setUtil";

class App extends Component {
    DEFAULT_STATE = {
        //undefined - login status is loading
        //true - user is logged in
        //false - user is logged out
        loggedIn: undefined,
        labels: undefined,
        selectedLabelIdSet: new Set()
    };

    state = this.DEFAULT_STATE;

    componentDidMount() {
        googleApi.init();
        googleApi.loaded.then(() => {
            googleApi.registerLoginStatusListener(this.handleLoginStatusChange);
        });
    }

    handleLoginStatusChange = (loggedIn) => {
        if (loggedIn) {
            this.reloadLabels();
        } else {
            this.setState(this.DEFAULT_STATE);
        }

        this.setState({loggedIn});
    };

    reloadLabels = () => {
        return googleApi.getLabels().then((labels) => {
            labels = labels.filter(l => l.messageListVisibility !== 'hide' && l.id !== 'CATEGORY_PERSONAL');
            this.setState({labels});
        })
    };

    toggleLabel = (label) => {
        this.setState({
            selectedLabelIdSet: setUtil.immutableToggle(this.state.selectedLabelIdSet, label.id)
        })
    };

    render() {
        const {loggedIn, labels, selectedLabelIdSet} = this.state;

        return (
            <div className="app">
                <Header loggedIn={loggedIn}/>
                <div className="app__content">
                    {loggedIn === false && (
                        <SignIn/>
                    )}
                    {loggedIn === true && labels && (
                        <React.Fragment>
                            <LabelsPanel
                                labels={labels}
                                selectedLabelIdSet={selectedLabelIdSet}
                                toggleLabel={this.toggleLabel}
                                onLabelChanged={this.reloadLabels}
                            />
                            <Messages selectedLabelIdSet={selectedLabelIdSet} labels={labels}/>
                        </React.Fragment>
                    )}
                </div>
            </div>
        );
    }
}

export default App;
