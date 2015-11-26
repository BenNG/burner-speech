import React from 'react';
import {render} from 'react-dom';
import Speech from '../../dist/index.js';

let initialState = {
    start: false,
    stop: false,
    abort: false,
    triggerTest: false,
    expectedValue: '',
};

const App = React.createClass({
    getInitialState(){
        return initialState;
    },
    speechFeatureDetector(isAvailable){
        console.log(isAvailable ? "Speech Recognition API is available. Test the feature anyway because on old chrome there are some bugs" : "Speech Recognition API is not available");
    },
    start(){
        console.log("say something ...");
        this.setState({start: true});
    },
    handleTestStart(){
        // start popup here with the expected value for example
        let expectedValue = 10 + Math.round(Math.random()* 29);
        console.log("say: " + expectedValue);
        this.setState({triggerTest: true, start: true, expectedValue });
    },
    handleTestResult(isSuccess){
        // close the popup if true
        console.log(isSuccess ? "SUCCEED !! Speech Recognition API is ready to use." : "FAILED !! You can not use the Speech Recognition API.");
        this.setState(initialState);
    },
    handleResult(value){
        console.log(value);
        this.setState(initialState);
    },
    render(){
        return (
            <div>

                <Speech start={this.state.start} stop={this.state.stop} abort={this.state.abort}
                        isComponentOnTest={this.state.triggerTest} expectedValue={this.state.expectedValue}
                        featureDetector={this.speechFeatureDetector}
                    activated={true} locale="fr-FR"
                    onResult={this.handleResult}
                    onTestResult={this.handleTestResult}
                    debug={false}
                />

                <div>Open your dev tools</div>

                {/* controls */}

                <button onClick={this.start}>start</button>
                <button onClick={ () => this.setState({stop: true}) }>stop</button>
                <button onClick={ () => this.setState({abort: true}) }>abort</button>
                <button onClick={this.handleTestStart}>triggerTest</button>

            </div>
        );
    },
});

render(<App />, document.getElementById('burner-speech'));

