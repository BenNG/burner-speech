import React from 'react';
import {render} from 'react-dom';
import Speech from '../dist/index.js';

const App = React.createClass({
    handleOnResult(value){
        console.log({value});
    },
    render(){
        return (
            <div>
                <Speech onResult={this.handleOnResult} activated={true} noUI={false} locale="fr-FR"/>
            </div>
        );
    }
});

render(<App />, document.getElementById('burner-speech'));
