import React from 'react';

import {Role} from '@/_helpers';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Select from '@material-ui/core/Select';
import {Redirect, hashHistory, Link} from 'react-router-dom';
import {positionService, testService, testResolutionService, authenticationService} from '@/_services';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Button from '@material-ui/core/Button';
import Input from "@material-ui/core/Input";
import {ErrorMessage} from "formik";

class TestManagerPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tests: [],
            positions: null,
            testNameText: "",
            testNameTextError: false,
            selectedPosition: "",
            resolvedTests: [],
            resolvedTestNames: [],
            isEditor: false,
            selectedImportPosition: '',
            importTestName: '',
            importFile: null,
            importError: null,
            importTestNameTextError: false,
        };
    }

    componentDidMount() {
        testService.exportTest('import', 'Polski').then(res => console.log(res) );
        testService.getAll().then(tests => {
            this.setState({tests})
        });
        positionService.getAll().then(positions => this.setState({positions}));
        testResolutionService.getAllResolvedTests().then(resolvedTests => {
            this.setState({resolvedTestNames: resolvedTests.map(t => t.test.name)});
            this.setState({resolvedTests: resolvedTests})
        })
        authenticationService.currentUser.subscribe(x => this.setState({
            isEditor: x && x.permissionName === Role.Editor,
        }));
    }

    handleSelectChange = (event) => {
        this.setState({
            selectedPosition: event.target.value,
        });
    }

    handleTextChange = (event) => {
        this.setState({
            testNameText: event.target.value,
        });
    };

    handleRemove(testName) {
        var newTests = this.state.tests;
        var index = newTests.findIndex(x => x.name == testName)
        newTests.splice(index, 1)
        this.setState({tests: newTests})
        testService.remove(testName)
    }

    handleEdit(test) {
        this.props.history.push({pathname: `/testEditor/${test.name}`, query: {test}})
    }

    handleAdd = () => {
        if (this.state.testNameText.length < 5) {
            this.setState({testNameTextError: true})
            return
        }
        if (this.state.selectedPosition.length < 1) {
            return
        }
        this.setState({testNameTextError: false})
        var test = {
            testName: this.state.testNameText,
            positionName: this.state.selectedPosition,
            creatorUsername: JSON.parse(localStorage.getItem("currentUser")).username
        }

        testService.add(test)


        var newTests = this.state.tests
        var testToAdd = {name: this.state.testNameText, position: {name: this.state.selectedPosition}}
        newTests.push(testToAdd)
        this.setState({tests: newTests})
    }

    handleCheckTest = (testResolutions, testName) => {
        this.props.history.push({pathname: `/testResolutions/${testName}`, query: {testResolutions}})
    };

    handleSelectFileToImport = (evt) => {
        this.setState({
            importFile: evt.target.files[0],
            importError: null,
        })

    };

    handleSelectImportPositionChange = (evt) => {
        this.setState({
            selectedImportPosition: evt.target.value,
            importError: null,
        })
    };

    handleImportTestNameChange = (evt) => {
        this.setState({
            importTestNameTextError: false, importTestName: evt.target.value,
        })
    };

    handleImport = () => {
        const { selectedImportPosition, importTestName, importFile } = this.state;
        if (this.state.importTestName.length < 5) {
            this.setState({importTestNameTextError: true});
            return
        }
        testService.importTest(importTestName, importFile, selectedImportPosition).then(
            res => {
                testService.getAll().then(tests => {
                    this.setState({ tests, selectedImportPosition: '', importTestName: '',
                        importError: null, importTestNameTextError: false })
                });
            },
            error => {
                this.setState({importError: error, importTestNameTextError: false });
            }
        )
    };


    render() {
        const { selectedImportPosition, importTestName, importFile, importError, importTestNameTextError } = this.state;
        return (
            <div>
                <List subheader={<ListSubheader disableSticky><h3>Tests</h3></ListSubheader>}>
                    {this.state.tests && this.state.tests.map(test =>
                        <ListItem key={test.name}>
                            <ListItemText primary={test.name} secondary={test.position && test.position.name}/>
                            <ListItemSecondaryAction>
                                <IconButton onClick={() => this.handleRemove(test.name)} aria-label="Delete">
                                    <DeleteIcon/>
                                </IconButton>
                                <IconButton onClick={() => this.handleEdit(test)}>
                                    <EditIcon/>
                                </IconButton>
                                {this.state.isEditor &&
                                (
                                    (this.state.resolvedTestNames.indexOf(test.name) !== -1) ?
                                        <Button
                                            onClick={() => this.handleCheckTest(this.state.resolvedTests.filter(function (testResolution) {
                                                return test.name === testResolution.test.name
                                            }), test.name)}
                                            size="small"
                                            variant="contained"
                                            color="default">
                                            New answers
                                        </Button>
                                        :
                                        <Button
                                            size="small"
                                            variant="text"
                                            color="default"
                                            disabled={true}>
                                            No answers
                                        </Button>
                                )
                                }
                            </ListItemSecondaryAction>
                        </ListItem>
                    )}
                    <Divider component="li"/>
                    <li>
                    </li>
                    <ListItem>
                        <div style={{display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap'}}>
                            <TextField
                                id="standard-dense"
                                label="Test Name"
                                value={this.state.testNameText}
                                onChange={this.handleTextChange}
                                error={this.state.testNameTextError}
                                style={{marginRight: 18}}
                                variant="outlined"
                            />
                            {this.state.positions &&
                            <Select
                                value={this.state.selectedPosition}
                                onChange={this.handleSelectChange}
                                input={<OutlinedInput labelWidth={0}/>}
                                displayEmpty
                            >
                                <MenuItem value="" disabled>
                                    Select Position
                                </MenuItem>
                                {this.state.positions.map(position =>
                                    <MenuItem key={position.id} value={position.name}>{position.name}</MenuItem>
                                )
                                }
                            </Select>
                            }
                        </div>
                        <ListItemSecondaryAction>
                            <IconButton onClick={() => this.handleAdd()}>
                                <AddIcon/>
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                    {this.state.positions &&
                        <div>
                            <ListItem>
                                <h5>Import Test</h5>
                            </ListItem>
                            <TextField
                                id="standard-dense"
                                label="Imported Test Name"
                                value={importTestName}
                                onChange={this.handleImportTestNameChange}
                                error={importTestNameTextError}
                                style={{marginRight: 18}}
                                variant="outlined"
                            />
                            <Select
                                value={selectedImportPosition}
                                onChange={this.handleSelectImportPositionChange}
                                input={<OutlinedInput labelWidth={0}/>}
                                displayEmpty
                            >
                                <MenuItem value="" disabled>
                                    Select Position
                                </MenuItem>
                                {this.state.positions.map(position =>
                                    <MenuItem key={position.id} value={position.name}>{position.name}</MenuItem>
                                )
                                }
                            </Select>
                            <ListItem>
                                <Input
                                    accept=".csv"
                                    id="raised-button-file"
                                    multiple
                                    type="file"
                                    onChange={this.handleSelectFileToImport}
                                />
                            </ListItem>
                            { importFile && selectedImportPosition && selectedImportPosition.length > 0 &&
                                importTestName && importTestName.length > 0 &&
                            <ListItem>
                                <Button onClick={this.handleImport}>
                                    Import!
                                </Button>
                            </ListItem>
                            }
                            { importError &&
                            <ListItem>
                                <div className={'alert alert-danger'}>{importError}</div>
                            </ListItem>
                            }
                        </div>
                    }
                </List>
            </div>
        );
    }
}

export {TestManagerPage};
