import React from 'react';
import { testResolutionService } from '@/_services';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Button from '@material-ui/core/Button';


class TestResolutionManagerPage extends React.Component {
    constructor(props) {
        super(props);
        console.log(this.props);
        this.state = {
            testResolutions:null,
        };
    }

    componentDidMount() {
        //if page is reloaded we lose passed object so we have to call api again.
        if (!this.props.location.query) {
            testResolutionService.getAllResolvedTestsByTestName(this.props.match.params.testName).then(resolutions => this.setState({testResolutions: resolutions}));
        } else {
            this.setState({testResolutions: this.props.location.query.testResolutions})
        }
    }

    handleCheckParticularTest(testResolution) {
        this.props.history.push({pathname: `/testCheck/${testResolution.id}`, query: {testResolution}})
    }

    render() {
        const { testResolutions } = this.state;
        console.log(testResolutions);
        if (testResolutions !== null) {
            return (
                <div>
                    <List subheader={<ListSubheader disableSticky><h3>Test resolutions for {testResolutions[0].test.name} </h3></ListSubheader>}>
                        {testResolutions.map(tr => (
                            <ListItem key={`Test resolution from ${tr.date}`}>
                                <ListItemText primary={tr.account.username}
                                              secondary={`Test made at ${tr.date}`} />
                                <ListItemSecondaryAction>
                                    <Button
                                        onClick={() => {this.handleCheckParticularTest(tr)}}
                                        size="small"
                                        variant="contained"
                                        color="default">
                                        Check the test
                                    </Button>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </div>
            )
        } else {
            return null
        }
    }
}

export {TestResolutionManagerPage};