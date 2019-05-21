import React from 'react';

import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from "@material-ui/core/ListItem";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from '@material-ui/icons/Add';
import {languageService} from "@/_services/language.service";


class LanguageManagerPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            languages: [],
            languageNameText: '',
            languageNameTextError: false,
            languageAddPending: false,
        };
    }

    componentDidMount() {
        languageService.getAll().then( ls => {
            const languages = [];
            ls.forEach(l => languages.push({ name: l.name }))
            this.setState({languages})
        } )
    }

    handleTextChange = (event) => {
        this.setState({
            languageNameText: event.target.value,
            languageNameTextError: false,
        });
    };

    handleAdd = () => {
        const { languages, languageNameText, languageNameTextError } = this.state;

        if (languageNameText.length < 3){
            this.setState({languageNameTextError: true});
            return;
        }

        this.setState({languageAddPending: true});
        languageService.create(languageNameText).then(
            lang => {
                languages.push(lang);
                this.setState({
                    languages: languages,
                    languageNameText: '',
                    languageAddPending: false,
                })
            }
        )
    };

    render() {
        const { languageNameText, languageNameTextError, languageAddPending, languages } = this.state;
        return (
            <div>
                <List subheader={<ListSubheader disableSticky><h3>Languages</h3></ListSubheader>}>
                    <ListItem key="default">
                        <ListItemText primary={'English'}
                                      secondary={'This language is always used as default and therefore cannot be removed.'} />
                    </ListItem>

                    { languages.map(language =>
                        <ListItem key={`custom-lang-${language.name}`}>
                            <ListItemText primary={language.name}/>
                        </ListItem>
                    )}

                    {!languageAddPending &&
                    <ListItem>
                        <div style={{display: 'flex',justifyContent: 'space-between', flexWrap: 'wrap'}}>
                            <TextField
                                id="standard-dense"
                                label="Language Name"
                                value={languageNameText}
                                onChange={this.handleTextChange}
                                error={languageNameTextError}
                                style={{marginRight: 18}}
                                variant="outlined"
                            />
                        </div>
                        <ListItemSecondaryAction>
                            <IconButton onClick={() =>this.handleAdd()}>
                                <AddIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>}
                    {languageAddPending &&
                    <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                    }

                </List>
            </div>
        );
    }
}

export { LanguageManagerPage };
