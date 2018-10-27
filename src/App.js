import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state = {
      operateList:[{
        text:"加粗"
      },{
        text:"斜体"
      },{
        text:"下划线"
      }],
      curMode:""
    };
  }

  componentDidMount(){
    this.refs.editorContent.focus();
  }

  switchMode = (e)=>{
    //用execCommand必须先focus，不然不生效
    this.refs.editorContent.focus();

    this.setState({
      curMode:e.target.innerText
    },()=>{
      switch(this.state.curMode){
        case "加粗":
          document.execCommand('bold', false, null);
          break;
        case "斜体":
          document.execCommand('italic', false, null);
          break;
        case "下划线":
          document.execCommand('underline', false, null);
          break;
        default:
          console.log("sth wrong");
      }
    })
  }

  render() {
    return (
      <div className="App">
        <div className="editor-box">
          <ul className="editor-header">
            {
              this.state.operateList.map((item,index)=>{
                return (
                  <li className={this.state.curMode===item.text?"editor-header-btn selected":"editor-header-btn"} 
                      key={index}
                      onClick={this.switchMode}
                  >
                    {item.text}
                  </li>
                )
              })
            }
          </ul>
          <div 
            ref="editorContent" 
            className="editor-content" 
            contentEditable
          >
          </div>
        </div>
      </div>
    );
  }
}

export default App;
