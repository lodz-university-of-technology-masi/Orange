import React from 'react';
import {positionService, testService} from "@/_services";
import Select from "@material-ui/core/Select";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import MenuItem from "@material-ui/core/MenuItem";
import {Form} from "formik";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";

class TestSelectionPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
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
    }

    handlePositionSelectChange = (event) => {
        const selectedPositionName = event.target.value;
        testService.getAll(event.target.value).then( tests => {
            this.setState({tests, selectedPositionName, selectedTestName: ''})
        });
    };

    handleTestSelectChange = (event) => {
        this.setState({selectedTestName: event.target.value})
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
                            <button className="btn btn-primary" disabled={selectedTestName === ''}>{'Fill Test!'}</button>
                        </div>

                    </div>
                }
            </div>
        );
    }
}

export { TestSelectionPage };
