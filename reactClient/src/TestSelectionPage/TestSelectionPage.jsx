import React from 'react';
import {positionService} from "@/_services";
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
        };
    }

    componentDidMount() {
        positionService.getAll().then( positions => {
            if (positions.length > 1) {
                this.setState({positions, selectedPositionName: positions[0].name} )
            }
        })
    }

    handlePositionSelectChange = (event) => {
        this.setState({selectedPositionName: event.target.value})
    };

    render() {
        const { positions, selectedPositionName } = this.state;
        return (
            <div>
                <h2>Apply and Fill Test!</h2>
                {
                    positions && positions.length > 0 &&
                    <div>
                        <FormControl style={{marginTop: '1rem', width: '100%'}}>
                            <InputLabel htmlFor="age-native-simple">Select Position</InputLabel>
                            <Select
                                native
                                value={selectedPositionName}
                                onChange={this.handlePositionSelectChange}
                                input={<OutlinedInput labelWidth={0} style={{width: '100%'}}/>}
                                displayEmpty
                            >
                                <option value="" disabled>
                                    Select Question Type
                                </option>
                                { positions.map(pos =>
                                    <option key={`Position ${pos.name}`} value={pos.name}>{pos.name}</option>
                                )}
                            </Select>
                        </FormControl>
                    </div>
                }
            </div>
        );
    }
}

export { TestSelectionPage };
