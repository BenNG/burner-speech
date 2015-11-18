import React from 'react';
import {render} from 'react-dom';
import Component from '../dist/index.js';

const App = React.createClass({
    render(){
        return (
            <div>
                <Component />
            </div>
        );
    }
});

render(<App />, document.getElementById('burner-speech'));
