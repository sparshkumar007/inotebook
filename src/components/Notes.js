import React,{ useContext } from 'react'
import noteContext from '../context/noteContext'
import Noteitem from './Noteitem';

const Notes=() => {
    const context=useContext(noteContext);
    const { notes,setState }=context;
    return (
        <div className='row my-3'>
            {notes.map((note) => {
                return <Noteitem note={note} />;
            })}
        </div>
    )
}

export default Notes
