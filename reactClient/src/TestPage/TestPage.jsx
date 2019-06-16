import React from 'react';
import {testService} from "@/_services";
import {testResolutionService} from "@/_services/testResolution.service";
import DialogTitle from "@material-ui/core/es/DialogTitle/DialogTitle";
import Button from "@material-ui/core/es/Button/Button";
import Dialog from "@material-ui/core/es/Dialog/Dialog";

class TestPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            success: false,
            test: null,
            testResolution: null,
            preferredLanguageName: null,
        };
    }

    componentDidMount() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if(this.props.location.query){
            this.initialSetup(this.props.location.query.test, user);
        } else {
            testService.getTranslated(this.props.match.params.testName, user.preferredLanguageName).then(test =>
                this.initialSetup(test, user)
            );
        }
    }

    initialSetup(test, user) {
        const questionAnswers = [];
        test.translatedQuestions.map(q => {
            questionAnswers.push({questionName: q.name, content: ''})
        });
        console.log(test)
        const testResolution = {
            testName: test.testName,
            username: user.username,
            questionAnswers
        };
        this.setState({test, testResolution, preferredLanguageName: user.preferredLanguageName})
    }

    getCurrentAnswer = (questionName) => {
        let { testResolution } = this.state;
        for(let i = 0; i < testResolution.questionAnswers.length; i++) {
            if (testResolution.questionAnswers[i].questionName === questionName) {
                return testResolution.questionAnswers[i].content;
            }
        }
    };

    handleQuestionAnswerChanged = (questionName, value) => {
        let { testResolution } = this.state;
        for(let i = 0; i < testResolution.questionAnswers.length; i++) {
            if (testResolution.questionAnswers[i].questionName === questionName) {
                testResolution.questionAnswers[i].content = value;
            }
        }
        this.setState({testResolution})
    };

    handleSubmit = (evt) => {
        evt.preventDefault();
        const { testResolution } = this.state;
        testResolutionService.add(testResolution).then(res => {
            this.setState({success: true});
        })
    };

    handleCloseSuccessModal = () => {
        this.setState({success: false});
        this.props.history.push('/');
    };

    getTranslation = (originalText, translation) => {
        const {preferredLanguageName} = this.state;
        if (preferredLanguageName && translation) {
            return translation;
        }
        return originalText;
    };

    render() {
        const { test, success, preferredLanguageName} = this.state;
        return (
            <div>
                <h2>{this.props.match.params.testName}</h2>
                <form style={{marginTop: '2rem'}}>
                    { test && test.translatedQuestions.map(q =>
                        <div className="form-group" key={q.name}>
                            <label htmlFor={q.name}>{this.getTranslation(q.original, q.translation)}</label>
                            {
                                q.questionType === 'NUMERICAL' &&
                                <input name={q.name} onChange={(evt) => this.handleQuestionAnswerChanged(q.name, evt.target.value)}
                                       className='form-control' type="number" />
                            }
                            {
                                (q.questionType === 'OPEN') &&
                                <input name={q.name}  onChange={(evt) => this.handleQuestionAnswerChanged(q.name, evt.target.value)}
                                       className='form-control' />
                            }
                            {
                                (q.questionType === 'SCALE') &&
                                <input name={q.name}  onChange={(evt) => this.handleQuestionAnswerChanged(q.name, evt.target.value)}
                                       className='form-control' />
                            }
                            {
                                (q.questionType === 'CHOICE') &&
                                <select
                                    value={this.getCurrentAnswer(q.name)}
                                    onChange={(evt) => this.handleQuestionAnswerChanged(q.name, evt.target.value)}
                                    style={{width: '100%'}}
                                    className='form-control'
                                >
                                <option value="" disabled>
                                    Select Answer
                                </option>
                                    { !preferredLanguageName && q.choices.map(t =>
                                        <option key={`Choice ${t}`} value={t}>{t}</option>
                                    )}
                                    { preferredLanguageName && q.translatedChoices.map(t =>
                                        <option key={`Choice ${t}`} value={t}>{t}</option>
                                    )}
                                </select>
                            }
                        </div>)
                    }
                    <button type="submit" className="btn btn-primary" onClick={this.handleSubmit}>
                        {'Submit!'}
                    </button>
                </form>
                <Dialog open={success} onClose={this.handleCloseSuccessModal} aria-labelledby="success-dialog">
                    <DialogTitle>Success!</DialogTitle>
                    <Button onClick={this.handleCloseSuccessModal}>OK!</Button>
                </Dialog>
            </div>
        );
    }
}

export { TestPage };
