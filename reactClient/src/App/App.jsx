import React from 'react';
import { Router, Route, Link } from 'react-router-dom';

import { history, Role } from '@/_helpers';
import { authenticationService } from '@/_services';
import { PrivateRoute } from '@/_components';
import { HomePage } from '@/HomePage';
import { AdminPage } from '@/AdminPage';
import { LoginPage } from '@/LoginPage';
import { PositionEditorPage } from '@/PositionEditorPage';
import { TestManagerPage } from '@/TestManagerPage';
import { TestEditorPage } from '@/TestEditorPage';
import {EditorManagerPage} from "@/EditorManagerPage";
import {EditorFormPage} from "@/EditorsFormPage";
import {QuestionManagerPage} from "@/QuestionManagerPage";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: null,
            isAdmin: false
        };
    }

    componentDidMount() {
        authenticationService.currentUser.subscribe(x => this.setState({
            currentUser: x,
            isAdmin: x && x.permissionName === Role.Admin
        }));
    }

    logout() {
        authenticationService.logout().then(response => console.log(response));
        history.push('/login');
    }

    render() {
        const { currentUser, isAdmin } = this.state;
        return (
            <Router history={history}>
                <div>
                    {currentUser &&
                        <nav className="navbar navbar-expand navbar-dark bg-dark">
                            <div className="navbar-nav">
                                <Link to="/" className="nav-item nav-link">Home</Link>
                                {isAdmin && <Link to="/admin" className="nav-item nav-link">Admin</Link>}
                                {isAdmin && <Link to="/positionEditor" className="nav-item nav-link">Positions Manager</Link>}
                                {isAdmin && <Link to="/testManager" className="nav-item nav-link">Test Manager</Link>}
                                {isAdmin && <Link to="/questionManager" className="nav-item nav-link">Question Manager</Link>}
                                {isAdmin && <Link to="/editorManager" className="nav-item nav-link">Editor Manager</Link>}
                                {isAdmin && <Link to="/editorForm" className="nav-item nav-link">Create Editor</Link>}
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
                                    <PrivateRoute path="/questionManager" roles={[Role.Admin]} component={QuestionManagerPage}/>
                                    <PrivateRoute path="/testManager" roles={[Role.Admin]} component={TestManagerPage}/>
                                    <PrivateRoute path="/testEditor/:testName" roles={[Role.Admin]} component={TestEditorPage}/>
                                    <PrivateRoute path="/editorManager" roles={[Role.Admin]} component={EditorManagerPage}/>
                                    <PrivateRoute exact path="/editorForm" roles={[Role.Admin]} component={EditorFormPage}/>
                                    <PrivateRoute path="/editorForm/:username" roles={[Role.Admin]} component={EditorFormPage}/>
                                    <Route path="/login" component={LoginPage} />
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