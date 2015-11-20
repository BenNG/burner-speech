import React from 'react';

var BurnerSpeech = React.createClass({
    propTypes: {
        locale: React.PropTypes.string,
        activated: React.PropTypes.bool,
        noUI: React.PropTypes.bool,
        onResult: React.PropTypes.func.isRequired,
    },
    getDefaultProps(){
        return {
            locale: 'en-GB',
            // user choice here
            activated: true,
        }
    },
    getInitialState(){
        return {
            available: false,
            activated: this.props.activated,
            locale: this.props.locale,
            valueTab: [],
        };
    },
    componentWillMount(){
        this.detector();
    },
    componentDidMount(){
        let {available, activated} = this.state;
        if(available && activated){
            this._setup();
        }
    },
    componentWillUpdate(nextProps,nextState){
        let {running, abort, activated} = nextState;

        if (activated){

            if (!running && !abort){
                this.recognition.stop();
            } else if (running && !abort){
                this.recognition.start();
            } else if (running && abort){
                this.recognition.abort();
            }

        }
    },
    detector(){
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
        this.setState({available: !!window.SpeechRecognition })
    },
    toggleFeature(){
        this.setState({activated: !this.state.activated})
    },
    _setup(){

        this.tempValue = [];
        // already initialized ?
        if (this.recognition){
            return;
        }
        let that = this;

        this.recognition = new window.SpeechRecognition();
        this.recognition.lang = this.state.locale;
        //_this.recognition.continuous = true;
        //this.recognition.interimResults = true;
        this.recognition.onstart = function (){
            console.log('---');
            console.log('speech: has been activated');
        };
        this.recognition.onresult = function (event){
            for (let i = event.resultIndex; i < event.results.length; ++i){
                if (event.results[i].isFinal){
                    that.tempValue.push(event.results[i][0].transcript);
                }
            }
        };
        this.recognition.onerror = function (event){
            console.log('speech: error');
            console.log(event);
        };
        /**  onend is always called (after voice, after stop, after abort, after timeout) */
        this.recognition.onend = function (){
            that.setState({running: false, valueTab: that.tempValue});
            that.props.onResult(that.tempValue[0]);
            console.log('speech: final results: ' + that.tempValue);
            console.log('---');
            that.tempValue = [];
        };

    },
    render: function(){

        let {available, activated} = this.state;

        let availabilityUI = <div>
            <div>Feature available</div>
            {available ? <div style={{color: 'green'}}>YES</div> : <div style={{color: 'red'}}>NO</div>}
        </div>;

        let activationUI = <div>
            <div>
                <div>Feature activated</div>
                <button onClick={this.toggleFeature}>Toggle feature</button>
                { activated ? <div style={{color: 'green'}}>YES</div> : <div style={{color: 'red'}}>NO</div>}
            </div>
        </div>;

        let controlsUI = <div>
            <div>
                <div>Controls:</div>
                <button onClick={() => this.setState({running: true, abort: false})}>start</button>
                <button onClick={() => this.setState({running: false})}>stop</button>
                <button onClick={() => this.setState({abort: true})}>abort</button>
            </div>
        </div>;


        return (
            <div>
                {
                    this.props.noUI ? null :

                    <div>
                        <div>Speech Recognition API</div>
                        {availabilityUI}
                        {available ? activationUI : null}
                        {activated ? controlsUI : null}
                    </div>

                }

            </div>



        );
    }
});

export default BurnerSpeech;
