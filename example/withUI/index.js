import React from 'react';
import {render} from 'react-dom';
import Speech from '../../dist/index.js';

import Dialog from 'material-ui/lib/dialog.js';

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

        let {start, stop, abort, triggerTest, expectedValue} = this.state;

        return (
            <div>

                <Speech start={start} stop={stop} abort={abort}
                        isComponentOnTest={triggerTest} expectedValue={expectedValue}
                    activated={true} locale="fr-FR"
                    onResult={this.handleResult}
                    onTestResult={this.handleTestResult}
                    debug={false}
                />

                <Dialog
                    title="Speech Recognition Testing"
                    actions={[{text: "Quit" , onClick: () => this.setState({stop: true, triggerTest: false})}]}
                    defaultOpen={triggerTest}
                    open={triggerTest}
                    ref='dialog_speech_test'>
                    {"say _number_".replace("_number_", expectedValue)}
                </Dialog>


                <button onClick={this.start}>start</button>
                <button onClick={ () => this.setState({stop: true}) }>stop</button>
                <button onClick={ () => this.setState({abort: true}) }>abort</button>
                <button onClick={this.handleTestStart}>triggerTest</button>

            </div>
        );
    },
});

render(<App />, document.getElementById('burner-speech'));

