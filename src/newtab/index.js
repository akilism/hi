import {default as React, Component} from "react";
import {default as ReactDOM} from "react-dom";
import "shared/reset.css";
import "shared/page.css";

//https://api.flickr.com/services/feeds/groups_pool.gne?id=69806216@N00&format=json  flickr group

class Notes extends Component {
  render() {
    const noteWrapperStyle = {
      position: 'absolute',
      bottom: 0,
      left: 0,
      padding: 10,
      display: 'flex',
      alignItems: 'flex-start',
      flexDirection: 'column-reverse',
      width: '100%'
    };

    const noteStyle = {
      // border: '1px solid black',
      padding: '7px 15px',
      fontSize: '1.5vw',
      position: 'relative',
      margin: '2px 0',
      width: '100%',
      zIndex: 3,
      borderRadius: 2,
      backgroundColor: 'rgba(255, 255, 255, 0.42)',
      color: '#000',
      transition: 'all 250ms'
    };

    const xStyle = {
      position: 'absolute',
      right: 10,
      top: 5,
      cursor: 'pointer',
      fontSize: '1.5rem'
    }

    const notes = this.props.notes.map((note, i) => {
      return (
        <div key={ i } className="note" style={ noteStyle }>
          { note }
          <span onClick={ () => { this.props.closeFn(i); } } style={ xStyle }>X</span>
        </div>
      );
    });


    return (
      <div style={noteWrapperStyle}>
        {notes}
      </div>
    );
  }
}

class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: []
    };
  }

  initClick(evt) {
    evt.preventDefault();

  }

  inputHandler(v, evt) {
    if(evt.keyCode === 13) {
      evt.preventDefault();
      //https://developer.mozilla.org/en-US/search?q=array.prototype.splice
      //https://github.com/<username>/<repo>/tree/<branch>
    }
  }

  editKey(evt) {
    if(evt.keyCode === 13) {
      evt.preventDefault();
      let notes = this.state.notes;
      notes.push(evt.target.textContent);
      evt.target.innerText = "";
      this.save('notes', notes);
      this.setState({ notes: notes });
    }
  };

  componentWillUpdate(oldState, newState) {

  }

  componentWillMount() {
    let notes = this.load('notes') || [];
    this.setState({ notes: notes });
  }

  editClick(evt) {
    this.refs.editable.contentEditable = true;
  }

  removeNote(note, evt) {
    const newNotes = this.state.notes.filter((n, i) => {
      return note !== i;
    });
    this.save('notes', newNotes);
    this.setState({ notes: newNotes });
  }

  save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    }
    catch(e)
    {
      localStorage.setItem(key, value);
    }
  }

  load(key) {
    let value = localStorage.getItem(key);
    try {
      return JSON.parse(value);
    } catch(e) {
      return value;
    }
  }

  render() {
    const wrapperStyle = {
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 16,
      backgroundColor: '#FDFDF',
      backgroundImage: 'url("https://c2.staticflickr.com/2/1520/24581832900_c8394c1fd6_k.jpg")',
      backgroundPosition: 'center bottom',
      fontFamily: 'Input Mono Compressed',
      fontWeight: 200,
      fontStyle: 'italic'
    };

    const editableStyle = {
      position: 'absolute',
      top: 0,
      left: 0,
      paddingTop: 10,
      paddingLeft: 10,
      height: '100vh',
      width: '100vw',
      zIndex: 1,
      fontSize: '2.5rem'
    };

    const inputStyle = {
      position: 'relative',
      zIndex: 20,
      fontSize: '1.25rem',
      padding: 10,
      width: '50vw',
      border: 0,
      backgroundColor: 'rgba(255,255,255,0.55)'
    };

    return (
      <div style={ wrapperStyle } ref="bg">
        <div style={ editableStyle } ref="editable" onClick={ this.editClick.bind(this) } onKeyUp={ this.editKey.bind(this) }></div>
        <input style={ inputStyle } ref="question-box" onKeyUp={ this.inputHandler.bind(this, 1) } />
        <Notes closeFn={ this.removeNote.bind(this) } notes={ this.state.notes } />
      </div>
    );
  }
}


ReactDOM.render(<Root />, document.getElementById("reactContainer"));
