import { useState } from 'react';
import NoteContext from './noteContext';

const Notes=[
    {
        "_id": "64b0de8024d5a95cdead5731",
        "user": "64af9bf1c29862aea930d166",
        "title": "first note",
        "description": "this is the first note i am trying to enter.",
        "tag": "Intro",
        "date": "2023-07-14T05:34:56.429Z",
        "__v": 0
    },
    {
        "_id": "64b16cfe2a12a8ba05e79e58",
        "user": "64af9bf1c29862aea930d166",
        "title": "second note",
        "description": "this is the second note i am trying to enter.",
        "tag": "Intro",
        "date": "2023-07-14T15:42:54.412Z",
        "__v": 0
    },
    {
        "_id": "64b16cfe2a12a8ba05e79e58",
        "user": "64af9bf1c29862aea930d166",
        "title": "second note",
        "description": "this is the second note i am trying to enter.",
        "tag": "Intro",
        "date": "2023-07-14T15:42:54.412Z",
        "__v": 0
    },
    {
        "_id": "64b16cfe2a12a8ba05e79e58",
        "user": "64af9bf1c29862aea930d166",
        "title": "second note",
        "description": "this is the second note i am trying to enter.",
        "tag": "Intro",
        "date": "2023-07-14T15:42:54.412Z",
        "__v": 0
    },
    {
        "_id": "64b16cfe2a12a8ba05e79e58",
        "user": "64af9bf1c29862aea930d166",
        "title": "second note",
        "description": "this is the second note i am trying to enter.",
        "tag": "Intro",
        "date": "2023-07-14T15:42:54.412Z",
        "__v": 0
    }
];

const NoteState=(props) => {
    const [notes,setState]=useState(Notes);
    return (
        <NoteContext.Provider value={{ notes,setState }}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;