import React from 'react';

import { userService, authenticationService, editorService } from '@/_services';
import { Table, TableRow, TableHead, TableBody, TableCell } from "@material-ui/core";
import {Link} from "react-router-dom";

class EditorManagerPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: authenticationService.currentUserValue,
            userFromApi: null,
            editorsFromApi: null
        };
    }

    componentDidMount() {
        const { currentUser } = this.state;
        userService.getById(currentUser.id).then(userFromApi => this.setState({ userFromApi }));
        this.refresh()
    }

    refresh() {
        editorService.getAll().then( editorsFromApi => this.setState({ editorsFromApi }));
    }

    render() {
        const { editorsFromApi } = this.state;

            if (editorsFromApi !== null) {
                return (
                   <Table>
                       <TableHead>
                           <TableRow>
                               <TableCell>Username</TableCell>
                               <TableCell align="right">First Name</TableCell>
                               <TableCell align="right">Last Name</TableCell>
                               <TableCell/>
                               <TableCell/>
                           </TableRow>
                       </TableHead>
                       <TableBody>
                           {editorsFromApi.map((row, index) => (
                               <TableRow key={ "editorTableCell" + index }>
                                   <TableCell>{row.username}</TableCell>
                                   <TableCell align="right">{row.firstName}</TableCell>
                                   <TableCell align="right">{row.lastName}</TableCell>
                                   <TableCell align="right">
                                       <Link to={`/editorForm/${row.username}`} className="nav-item nav-link">Edit</Link>
                                   </TableCell>
                                   <TableCell align="right">
                                       <button onClick={() => editorService.remove(row.username).then(() => { this.refresh() })} >
                                           Delete
                                       </button>
                                   </TableCell>
                               </TableRow>
                           ))}
                       </TableBody>
                   </Table>
                )
            } else {
               return null
            }
    }
}

export { EditorManagerPage };