import React from 'react';
import {testService} from "@/_services";
import {testResolutionService} from "@/_services/testResolution.service";

class TestPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            test: null,
            testResolution: null,
        };
    }

    componentDidMount() {
        testService.get(this.props.match.params.testName).then(test => {
            const user = JSON.parse(localStorage.getItem('currentUser'));
            const questionAnswers = [];
            test.questions.map(q => {
                questionAnswers.push({questionName: q.name, content: ''})
            });
            const testResolution = {
                testName: test.name,
                username: user.username,
                questionAnswers
            };
            this.setState({test, testResolution})
        })
    }

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
            console.log('added!')
        })
    };

    render() {
        const { test } = this.state;
        return (
            <div>
                <h2>{this.props.match.params.testName}</h2>
                <form style={{marginTop: '2rem'}}>
                    { test && test.questions.map(q =>
                        <div className="form-group" key={q.name}>
                            <label htmlFor={q.name}>{q.content}</label>
                            {
                                q.questionType === 'NUMERICAL' &&
                                <input name={q.name} onChange={(evt) => this.handleQuestionAnswerChanged(q.name, evt.target.value)}
                                       className='form-control' type="number" />
                            }
                            {
                                (q.questionType === 'OPEN' || q.questionType === 'CHOICE') &&
                                <input name={q.name}  onChange={(evt) => this.handleQuestionAnswerChanged(q.name, evt.target.value)}
                                       className='form-control' />
                            }
                        </div>)
                    }
                    <button type="submit" className="btn btn-primary" onClick={this.handleSubmit}>
                        {'Submit!'}
                    </button>
                </form>
            </div>
        );
    }
}

export { TestPage };
