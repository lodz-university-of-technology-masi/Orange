import React from 'react';
import keydown from 'react-keydown';
import { Router, Route, Link } from 'react-router-dom';

import { history, Role } from '@/_helpers';
import { authenticationService, metricService } from '@/_services';
import { PrivateRoute } from '@/_components';
import { HomePage } from '@/HomePage';
import { AdminPage } from '@/AdminPage';
import { LoginPage } from '@/LoginPage';
import { RegistrationPage } from '@/RegistrationPage';
import { PositionEditorPage } from '@/PositionEditorPage';
import { TestManagerPage } from '@/TestManagerPage';
import { TestEditorPage } from '@/TestEditorPage';
import { EditorManagerPage } from "@/EditorManagerPage";
import { EditorFormPage } from "@/EditorsFormPage";
import { QuestionManagerPage } from "@/QuestionManagerPage";
import { QuestionEditorPage } from "@/QuestionEditorPage";
import { LanguageManagerPage } from "@/LanguageManagerPage";
import { AccountEditorPage } from "@/AccountEditorPage";
import { TestSelectionPage } from "@/TestSelectionPage";
import { TestPage } from "@/TestPage";
import { ContextMenu, handleContextMenu } from "@/ContextMenu";
import { TestResolutionManagerPage } from "@/TestResolutionManagerPage";
import { TestResolutionCheckPage } from "@/TestResolutionCheckPage";
import  html2canvas from 'html2canvas';

import { detect } from 'detect-browser'
const browser = detect();
const publicIp = require('public-ip');


class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: null,
            isAdmin: false,
            isEditor: false,
            isUser: false,
            isMetricActive: false,
            USABILITY_DATA: { ip: null, browser: null, username: null, m_id: 0, savetime: null, res_w: null, res_h: null, mc: 0, time: 0, dist: 0, fail: false, error: null, screenShot:null },
            mouseX: 0,
            mouseY: 0,
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
        onmouseup = (e) => this.handleMouseClick(e);
    }

    logout() {
        authenticationService.logout().then(response => console.log(response));
        history.push('/login');
    }

    handleMouseClick(e) {
        if (!this.state.isMetricActive) return;

        var usabilityData = this.state.USABILITY_DATA;
        var calculatedDistance = Math.sqrt(Math.pow((this.state.mouseX - e.clientX), 2) + Math.pow((this.state.mouseY - e.clientY), 2))
        usabilityData.mc = usabilityData.mc + 1;
        usabilityData.dist = usabilityData.dist + calculatedDistance;
        this.setState({ USABILITY_DATA: usabilityData, mouseX: e.clientX, mouseY: e.clientY });
        console.log('Mouse Clicked '+ this.printUsabilityData(usabilityData))
        
    }


    

    @keydown('shift+d')
    changeMetricActivity(event) {
        var usabilityData = this.state.USABILITY_DATA;
        if (this.state.isMetricActive) {
            usabilityData.time = event.timeStamp - usabilityData.savetime;
            metricService.add(usabilityData).then(this.resetMetricsData());
        } else {
            publicIp.v4().then(myIp => {
                usabilityData.ip = myIp;
                usabilityData.browser = browser.name[0].toUpperCase()
                if(this.state.currentUser != null){
                    usabilityData.username = this.state.currentUser.username;
                }else{
                    usabilityData.username = 'guest';
                }
                usabilityData.savetime = event.timeStamp;
                usabilityData.res_w = window.screen.width //window.screen.availWidth
                usabilityData.res_h = window.screen.height //window.screen.availHeight
            });
            html2canvas(document.getElementById("app")).then(canvas => {
                usabilityData.screenShot = canvas.toDataURL("image/png");
            });

            this.setState({ isMetricActive: true, USABILITY_DATA: usabilityData });
        }
        console.log('shift+d,  '+ this.printUsabilityData(usabilityData))
    }

    @keydown('shift+w')
    failMetric(event) {
        if (!this.state.isMetricActive) return;

        var usabilityData = this.state.USABILITY_DATA;
        usabilityData.time = event.timeStamp - usabilityData.savetime;
        //don't save to DB
        console.log('shift+w, '+ this.printUsabilityData(usabilityData))
        this.resetMetricsData()
    }

    @keydown('shift+r')
    failMetricSave(event) {
        if (!this.state.isMetricActive) return;

        var usabilityData = this.state.USABILITY_DATA;
        usabilityData.time = event.timeStamp - usabilityData.savetime;
        usabilityData.fail = true;
        console.log('shift+r, '+ this.printUsabilityData(usabilityData))
        metricService.add(usabilityData);
        this.resetMetricsData()
    }

    printUsabilityData(usabilityData) {
        return `USABILITY_DATA: {IP:${usabilityData.ip}, BROWSER:${usabilityData.browser}, USERNAME:${usabilityData.username}, M_ID:${usabilityData.m_id}, 
        SAVETIME:${usabilityData.savetime}, RES_W:${usabilityData.res_w}, RES_H:${usabilityData.res_h}, MC:${usabilityData.mc}, TIME:${usabilityData.time}, 
        DIST:${usabilityData.dist}, FAIL:${usabilityData.fail}, ERROR: ${usabilityData.error} }`
    }

    resetMetricsData(){
        var usabilityData = { ip: null, browser: null, username: null, m_id: 0, savetime: null, res_w: null, res_h: null, mc: 0, time: 0, dist: 0, fail: false, error: null }
        this.setState({ isMetricActive: false, USABILITY_DATA: usabilityData, mouseX: 0, mouseY: 0 });
    }


    render() {
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
                                {isUser && <Link to="/testSelection" className="nav-item nav-link">Apply and Fill Test!</Link>}
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
                                    <PrivateRoute path="/testSelection" roles={[Role.User]} component={TestSelectionPage}/>
                                    <PrivateRoute path="/test/:testName" roles={[Role.User]} component={TestPage}/>
                                    <PrivateRoute path="/testResolutions/:testName" roles={[Role.Editor]} component={TestResolutionManagerPage}/>
                                    <PrivateRoute path="/testCheck/:testResolutionId" roles={[Role.Editor]} component={TestResolutionCheckPage}/>
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
