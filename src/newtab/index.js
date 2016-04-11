import {default as React, Component} from "react";
import {default as ReactDOM} from "react-dom";
import "shared/reset.css";
import "shared/page.css";

// TODOS:
// Figure out focus to input on new tab creation.
// Write a handler for http(s):// in the input.
// Notes with a title and body (google keep style.)
   // Expansion display.

const images = ['https://c1.staticflickr.com/5/4071/4464815432_c3f96b1ea0_o.jpg',
  'https://c1.staticflickr.com/5/4093/4810569917_20b0f562da_o.jpg',
  'https://c2.staticflickr.com/4/3872/14302288760_bccf801826_k.jpg',
  'https://c1.staticflickr.com/9/8675/16037131640_c26ef9777a_k.jpg',
  'https://c2.staticflickr.com/8/7469/16036983998_8718e1ab5d_k.jpg',
  'https://c1.staticflickr.com/9/8595/16198599186_9fa3e4cb01_k.jpg',
  'https://c2.staticflickr.com/8/7466/16038655837_41aa4d8473_k.jpg',
  'https://c2.staticflickr.com/8/7495/16036986748_e62854a9a8_k.jpg'];

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
      notes: [],
      bgImage: ''
    };

    this.commands = {
      gh: {
        type: 'website',
        data: 'https://github.com/<username>/<repo>/tree/<branch>'
      },
      'gh-new':  {
        type: 'website',
        data: 'https://github.com/new'
      },
      mdn: {
        type: 'website',
        data: 'https://developer.mozilla.org/en-US/search?q=<term>'
      }
    }

    this.cmdFns = {
      'website': function(urlFormat, vals) {
        const splitter = /<[a-z0-9]+>/gi;
        const urlFragment = urlFormat.split(splitter);

        //interleave the url format and the values into place.
        //if no vals then use the first value of the url fragment.
        //TODO: could be more robust if i captured the regex match and then
        //used an object to hold the vals. right now the array needs to match
        //the same order.
        const url = vals.reduce((acc, v, i) => {
          return [acc, urlFragment[i], v].join('');
        }, '') || urlFragment[0];

        window.location.href = url;
      }
    }
  }

  initClick(evt) {
    evt.preventDefault();

  }

  runCommand(cmdKey, vals) {
    const cmdDetails = this.commands[cmdKey];
    const command = this.cmdFns[cmdDetails.type];
    command(cmdDetails.data, vals);
  }


  checkCommand(vals) {
    const cmdKey = Object.keys(this.commands).filter((k) => {
      return k === vals[0];
    });

    if (!cmdKey) {
      window.location.href = ['https://duckduckgo.com/?q=', ...vals].join('');
      return;
    }

    this.runCommand(cmdKey, vals.slice(1));
  }

  inputHandler(v, evt) {
    if(evt.keyCode === 13) {
      evt.preventDefault();
      //https://developer.mozilla.org/en-US/search?q=<term>
      //https://github.com/<username>/<repo>/tree/<branch>
      //https://github.com/new
      this.checkCommand(evt.target.value.split(' '));
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
    let bgImage = images[Math.floor(Math.random() * images.length - 1)];
    this.setState({ notes, bgImage });
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
      backgroundImage: `url("${this.state.bgImage}")`,
      backgroundPosition: 'center center',
      backgroundSize: 'cover';
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
