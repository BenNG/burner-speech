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
            recognition: null,
            available: false,
            activated: this.props.activated,
            locale: this.props.locale,
            final_transcript: [],
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
                this.stop();
            } else if (!running && abort){
                this.abort();
            } else if (running && !abort){
                this.start();
            } else if (running && abort){
                this.abort();
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

        let that = this;
        // already initialized ?
        if (that.state.recognition){
            return;
        }

        let recognition = new window.SpeechRecognition();
        recognition.lang = this.state.locale;
        //_recognition.continuous = true;
        //recognition.interimResults = true;
        recognition.onstart = function (){
            console.log('---');
            console.log('speech: has been activated');
        };
        recognition.onresult = function (event){

            for (let i = event.resultIndex; i < event.results.length; ++i){
                if (event.results[i].isFinal){
                    that.state.final_transcript.push(event.results[i][0].transcript);
                    // temporary results
                    //if (process.env.NODE_ENV !== ENVIRONMENT.PRODUCTION && storage.getItem(LOCAL_STORAGE.DEBUG)){
                    //    console.log('speech: raw results ' + that.state.final_transcript);
                    //}
                }
            }
        };
        recognition.onerror = function (event){
            that.setState({running: false});
            console.log('speech: error');
            console.log(event);
        };
        recognition.onend = function (){
            that.setState({running: false});
            let value = that.state.final_transcript[0];
            console.log('speech: final results: ' + value);
            console.log('---');
            that.props.onResult(value);
            that.setState({
                final_transcript: [],
            });
        };

        this.setState({recognition});

    },
    start(){
        let recognition = this.state.recognition;
        if (recognition){
            recognition.start();
        }

    },
    stop(){
        let recognition = this.state.recognition;
        if (recognition){
            recognition.stop();
        }
    },
    abort(){
        let recognition = this.state.recognition;
        if (recognition){
            recognition.abort();
        }
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
                <button onClick={() => this.setState({start: true, abort: false, running: true})}>start</button>
                <button onClick={() => this.setState({running: false})}>stop</button>
                <button onClick={() => this.setState({start: false, abort: true, running: false})}>abort</button>
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
