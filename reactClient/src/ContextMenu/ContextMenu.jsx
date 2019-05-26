import React from 'react';
import {Menu, Item, contextMenu} from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';
import {menuService} from '@/_services';

const onClick = ({props}) => {
    if (props.selection !== "") {
        menuService.findSynonyms(props.selection)
            .then(result => {
                let synonyms = "The synonyms to " + props.selection + ":\n" ;
                result.response.forEach(function (meaning, idx) {
                    synonyms += idx + 1 + ". " + meaning.list.synonyms + "\n\n";
                });
                alert(synonyms);
            })
            .catch(function(err) {
                alert("The dictionary can't find synonyms to " + props.selection);
            });
    }
};

const handleWikiSearch = ({props}) => {
    const word = props.selection.split(' ').join('_');
    if(word !== "" && word !== undefined && word !== null) {
        menuService.wikiSearch(word)
    }
};

export const ContextMenu = () => (

    <Menu id='menu_id'>
        <Item onClick={onClick}>Search synonym to selected word </Item>
        <Item onClick={handleWikiSearch}>Wiki Search</Item>
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