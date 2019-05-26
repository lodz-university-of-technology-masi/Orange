import React from 'react';
import {Menu, Item, contextMenu} from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';
import {synonymService} from '@/_services';

const onClick = ({props}) => {
    if (props.selection !== "") {
        synonymService.findSynonyms(props.selection).then(result => {
            let synonyms = "";
            result.response.forEach(function (meaning, idx) {
                synonyms += idx + 1 + ". " + meaning.list.synonyms + "\n\n";
            });
            alert(synonyms);
        });
    }
};

export const ContextMenu = () => (

    <Menu id='menu_id'>
        <Item onClick={onClick}>Search synonym to selected word </Item>
    </Menu>
);

export function handleContextMenu(e) {
    e.preventDefault();

    console.log(window.getSelection().toString());
    contextMenu.show({
        id: 'menu_id',
        event: e,
        props: {
            selection: window.getSelection().toString()
        }
    });
};