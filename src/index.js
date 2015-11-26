import React from 'react';

var BurnerSpeech = React.createClass({
    propTypes: {
        start: React.PropTypes.bool,
        stop: React.PropTypes.bool,
        abort: React.PropTypes.bool,
        locale: React.PropTypes.string,
        activated: React.PropTypes.bool,
        debug: React.PropTypes.bool,
        onResult: React.PropTypes.func.isRequired,
        onTestResult: React.PropTypes.func.isRequired,
    },
    getDefaultProps(){
        return {
            locale: 'en-GB',
            // user choice here
            activated: true,
            debug : false,
        }
    },
    getInitialState(){
        return {
            available: false,
            running: false,
            debug: this.props.debug,
            activated: this.props.activated,
            locale: this.props.locale,
            valueTab: [],
            expectedValue: '',
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
    componentWillReceiveProps(nextProps){
        let {start, stop, abort, isComponentOnTest, expectedValue} = nextProps;

        if(isComponentOnTest && expectedValue){
            this.setState({isComponentOnTest: true, expectedValue: expectedValue, running: true})
        }else if(start && !stop && !abort){
            this.setState({running: true, abort: false});
        }else if(start && !stop && abort){
            this.setState({abort: true})
        }else if(start && stop && !abort){
            this.setState({running: false})
        }

    },
    shouldComponentUpdate(nextProps, nextState){
        return this.state.running !== nextState.running || this.state.abort !== nextState.abort;
    },
    componentWillUpdate(nextProps,nextState){
        let {running, abort, activated, isComponentOnTest, valueTab, expectedValue} = nextState;
        let value = valueTab[0];


        if(isComponentOnTest && value){
            this.props.onTestResult(isComponentOnTest && value == expectedValue);
        }

        if (activated) {
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
        let flag = !!window.SpeechRecognition
        this.setState({available: flag });
        this.props.featureDetector(flag);
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
            if(that.props.debug){
                console.log('---');
                console.log('speech: has been activated');
            }
        };
        this.recognition.onresult = function (event){
            for (let i = event.resultIndex; i < event.results.length; ++i){
                if (event.results[i].isFinal){
                    that.tempValue.push(event.results[i][0].transcript);
                }
            }
        };
        this.recognition.onerror = function (event){
            if(that.props.debug) {
                console.log('speech: error');
                console.log(event);
            }
        };
        /**  onend is always called (after voice, after stop, after abort, after timeout) */
        this.recognition.onend = function (){

            let {isComponentOnTest, expectedValue} = that.state;
            let value = that.tempValue[0];

            if(isComponentOnTest){
                that.props.onTestResult(isComponentOnTest && value == expectedValue);
            }else{
                that.props.onResult(value);
                if(that.props.debug) {
                    console.log('speech: final results: ' + that.tempValue);
                    console.log('---');
                }
            }
            that.setState({
                running: false, abort: false, valueTab: [], isComponentOnTest: false, expectedValue: ''
            });

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
                <button onClick={() => this.setState({isComponentOnTest: true, expectedValue: 1 + Math.round(Math.random()* 29)})}>isComponentOnTest Feature</button>
            </div>
        </div>;

        return (
            <div>
                {
                    this.props.debug ?
                    <div>
                        <div>Speech Recognition API</div>
                        {availabilityUI}
                        {available ? activationUI : null}
                        {activated ? controlsUI : null}

                    </div> : null

                }

            </div>

        );
    }
});

export default BurnerSpeech;
