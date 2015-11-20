import React from 'react';
import {render} from 'react-dom';
import Speech from '../dist/index.js';

const App = React.createClass({
    handleOnResult(value){
        console.log({value});
    },
    handleOnTestResult(value){
        console.log("result of test: " + value);
    },
    render(){
        return (
            <div>
                <Speech activated={true} noUI={false} locale="fr-FR"
                    onResult={this.handleOnResult}
                    onTestResult={this.handleOnTestResult}/>
            </div>
        );
    }
});

render(<App />, document.getElementById('burner-speech'));
