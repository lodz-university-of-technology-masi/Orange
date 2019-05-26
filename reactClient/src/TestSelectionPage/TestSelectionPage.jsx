import React from 'react';
import {positionService, testService, userService} from "@/_services";

class TestSelectionPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            preferredLanguageName: '',
            positions: [],
            selectedPositionName: '',
            tests: [],
            selectedTestName: '',
        };
    }

    componentDidMount() {
        positionService.getAll().then( positions => {
            if (positions.length > 1) {
                this.setState({positions} )
            }
        });

        const user = JSON.parse(localStorage.getItem('currentUser'));
        userService.getByUsername(user.username).then(u => {
            this.setState({preferredLanguageName: user.preferredLanguageName})
        })
    }

    handlePositionSelectChange = (event) => {
        const selectedPositionName = event.target.value;
        testService.getAll(event.target.value).then( tests => {
            this.setState({tests, selectedPositionName, selectedTestName: ''})
        });
    };

    handleTestSelectChange = (event) => {
        const { preferredLanguageName } = this.state;
        const selectedTestName = event.target.value;
        testService.getTranslated(selectedTestName, preferredLanguageName).then(test => {
            console.log(test);
        });
        this.setState({selectedTestName})
    };

    handleTestFillClick = () => {
        const { selectedTestName } = this.state;
        this.props.history.push({pathname: `/test/${selectedTestName}`})
    };

    render() {
        const { positions, selectedPositionName, tests, selectedTestName } = this.state;
        return (
            <div>
                <h2>Apply and Fill Test!</h2>
                {
                    positions && positions.length > 0 &&
                    <div>
                        <div className="form-group" style={{marginTop: '2rem'}}>
                            <label>Select Position</label>
                            <select
                                value={selectedPositionName}
                                onChange={this.handlePositionSelectChange}
                                style={{width: '100%'}}
                                className='form-control'
                            >
                                <option value="" disabled>
                                    Select Position
                                </option>
                                { positions.map(pos =>
                                    <option key={`Position ${pos.name}`} value={pos.name}>{pos.name}</option>
                                )}
                            </select>
                        </div>

                        <div hidden={ !(selectedPositionName !== '' && tests && tests.length === 0) }>
                            Given position has no tests assigned to it.
                        </div>

                        <div className="form-group" style={{marginTop: '1rem'}} >
                            <label>Select Test</label>
                            <select
                                value={selectedTestName}
                                onChange={this.handleTestSelectChange}
                                style={{width: '100%'}}
                                className='form-control'
                                disabled={tests && tests.length === 0}
                            >
                                <option value="" disabled>
                                    Select Test
                                </option>
                                { tests.map(test =>
                                    <option key={`Test ${test.name}`} value={test.name}>{test.name}</option>
                                )}
                            </select>
                        </div>

                        <div className="form-group">
                            <button className="btn btn-primary" disabled={selectedTestName === ''}
                                    onClick={this.handleTestFillClick}>
                                {'Fill Test!'}
                            </button>
                        </div>

                    </div>
                }
            </div>
        );
    }
}

export { TestSelectionPage };
