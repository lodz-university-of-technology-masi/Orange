import React from 'react';
import { Router, Route, Link } from 'react-router-dom';

import { history, Role } from '@/_helpers';
import { authenticationService } from '@/_services';
import { PrivateRoute } from '@/_components';
import { HomePage } from '@/HomePage';
import { AdminPage } from '@/AdminPage';
import { LoginPage } from '@/LoginPage';
import { RegistrationPage } from '@/RegistrationPage';
import { PositionEditorPage } from '@/PositionEditorPage';
import { TestManagerPage } from '@/TestManagerPage';
import { TestEditorPage } from '@/TestEditorPage';
import {EditorManagerPage} from "@/EditorManagerPage";
import {EditorFormPage} from "@/EditorsFormPage";
import {QuestionManagerPage} from "@/QuestionManagerPage";
import {QuestionEditorPage} from "@/QuestionEditorPage";
import {LanguageManagerPage} from "@/LanguageManagerPage";
import {AccountEditorPage} from "@/AccountEditorPage";
import { ContextMenu, handleContextMenu } from "@/ContextMenu";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: null,
            isAdmin: false,
            isEditor: false,
            isUser: false,
        };
        this.handleContextMenu = handleContextMenu.bind(this);
    }

    componentDidMount() {
        authenticationService.currentUser.subscribe(x => this.setState({
            currentUser: x,
            isAdmin: x && x.permissionName === Role.Admin,
            isEditor: x && x.permissionName === Role.Editor,
            isUser: x && x.permissionName === Role.User,
        }));
    }

    logout() {
        authenticationService.logout().then(response => console.log(response));
        history.push('/login');
    }

    render(){
        const { currentUser, isAdmin, isEditor, isUser } = this.state;
        return (
            <Router history={history}>
                <div onContextMenu={isEditor ? this.handleContextMenu : null}>
                    {isEditor && <ContextMenu/>}
                    {currentUser &&
                        <nav className="navbar navbar-expand navbar-dark bg-dark">
                            <div className="navbar-nav">
                                <Link to="/" className="nav-item nav-link">Home</Link>
                                {isAdmin && <Link to="/admin" className="nav-item nav-link">Admin</Link>}
                                {isAdmin && <Link to="/positionEditor" className="nav-item nav-link">Positions Manager</Link>}
                                {(isAdmin || isEditor) && <Link to="/testManager" className="nav-item nav-link">Test Manager</Link>}
                                {(isAdmin || isEditor) && <Link to="/questionManager" className="nav-item nav-link">Question Manager</Link>}
                                {(isAdmin || isEditor) && <Link to="/languageManager" className="nav-item nav-link">Language Manager</Link>}
                                {isAdmin && <Link to="/editorManager" className="nav-item nav-link">Editor Manager</Link>}
                                {isAdmin && <Link to="/editorForm" className="nav-item nav-link">Create Editor</Link>}
                                {isUser && <Link to="/accountEditor" className="nav-item nav-link">Account Editor</Link>}
                                <a onClick={this.logout} className="nav-item nav-link">Logout</a>
                            </div>
                        </nav>
                    }
                    <div className="jumbotron">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-8 offset-md-2">
                                    <PrivateRoute exact path="/" component={HomePage} />
                                    <PrivateRoute path="/admin" roles={[Role.Admin]} component={AdminPage} />
                                    <PrivateRoute path="/positionEditor" roles={[Role.Admin]} component={PositionEditorPage}/>
                                    <PrivateRoute path="/questionManager" roles={[Role.Admin, Role.Editor]} component={QuestionManagerPage}/>
                                    <PrivateRoute path="/questionEditor/:questionName" roles={[Role.Admin, Role.Editor]} component={QuestionEditorPage}/>
                                    <PrivateRoute path="/languageManager" roles={[Role.Admin, Role.Editor]} component={LanguageManagerPage}/>
                                    <PrivateRoute path="/testManager" roles={[Role.Admin, Role.Editor]} component={TestManagerPage}/>
                                    <PrivateRoute path="/testEditor/:testName" roles={[Role.Admin, Role.Editor]} component={TestEditorPage}/>
                                    <PrivateRoute path="/editorManager" roles={[Role.Admin]} component={EditorManagerPage}/>
                                    <PrivateRoute exact path="/editorForm" roles={[Role.Admin]} component={EditorFormPage}/>
                                    <PrivateRoute path="/editorForm/:username" roles={[Role.Admin]} component={EditorFormPage}/>
                                    <PrivateRoute path="/accountEditor" roles={[Role.User]} component={AccountEditorPage}/>
                                    <Route path="/login" component={LoginPage} />
                                    <Route path="/registerAccount" component={RegistrationPage} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Router>
        );
    }
}

export { App }; 
