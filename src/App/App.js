import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import NotefulContext from '../NotefulContext';
import dummyStore from '../dummy-store';
import './App.css';

class App extends Component {
    state = {
        notes: [],
        folders: []
    };

    componentDidMount() {
            Promise.all([
                fetch('http://localhost:9090/notes'),
                fetch('http://localhost:9090/folders'),
            ])
            .then( ([resNotes,resFolders]) => {
                if(!resNotes.ok){
                    return resNotes.json().then(err => Promise.reject(err))
                }
                if(!resFolders.ok){
                    return resFolders.json().then(err => Promise.reject(err))
                }
                return Promise.all([
                    resNotes.json(),
                    resFolders.json()
                ])
            })
            .then(([notes,folders]) => {
                this.setState({
                    notes,
                    folders,
                })
            })
            .catch(err => {
                console.error({err})
            })
    }

    handleDeleteNote = (noteId) => {
      this.setState({
        notes: this.state.notes.filter(note => note.id !== noteId)
      });
    }

    renderNavRoutes() {
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListNav}
                    />
                ))}
                <Route
                    path="/note/:noteId"
                    component={NotePageNav}
                />
                <Route path="/add-folder" component={NotePageNav} />
                <Route path="/add-note" component={NotePageNav} />
            </>
        );
    }

    renderMainRoutes() {
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        component={NoteListMain}
                    />
                ))}
                <Route
                    path="/note/:noteId"
                    component={NotePageMain}
                />
            </>
        );
    }

    render() {
      const contextValue = {
        notes: this.state.notes,
        folders: this.state.folders,
        deleteNote: this.handleDeleteNote,
      }
        return (
          <NotefulContext.Provider value={contextValue}>
            <div className="App">
                <nav className="App__nav">{this.renderNavRoutes()}</nav>
                <header className="App__header">
                    <h1>
                        <Link to="/">Noteful</Link>{' '}
                        <FontAwesomeIcon icon="check-double" />
                    </h1>
                </header>
                <main className="App__main">{this.renderMainRoutes()}</main>
            </div>
            </NotefulContext.Provider>
        );
    }
}

export default App;
