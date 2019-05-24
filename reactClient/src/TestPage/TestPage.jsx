import React from 'react';
import {testService} from "@/_services";

class TestPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            test: null,
        };
    }

    componentDidMount() {
        testService.get(this.props.match.params.testName).then(test => this.setState({test}))
    }

    handleSubmit = () => {
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
                            <input name={q.name} className='form-control' />
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
