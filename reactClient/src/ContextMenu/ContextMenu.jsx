import React from 'react';
import {Menu, Item, Separator, Submenu, contextMenu} from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';

const onClick = ({ event, props }) => console.log(event,props);

export const ContextMenu = ( props ) => (
    <Menu id='menu_id'>
        <Item onClick={onClick}>Search synonym to {props.selection}</Item>
    </Menu>
);

export function handleContextMenu(e) {
    e.preventDefault();
    contextMenu.show({
        id: 'menu_id',
        event: e,
        props: {
            selection: window.getSelection().toString()
        }
    });
};