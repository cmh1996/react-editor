import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state = {
      operateList:{
        "bold":false,
        "underline":false,
        "italic":false,
        "undo":false,
        "redo":false
      }
    };
    this.needToSwitchBtn = ["bold","underline","italic"];
    this.rangePos = null;
    this.editorContent = React.createRef();
    this.editorBox = React.createRef();
  }

  componentDidMount(){
    //文本框自动聚焦
    this.editorContent.current.focus();
    
    document.addEventListener("selectionchange",this.debounce(this.selectionChangeHandle,500,true),false);
    this.editorContent.current.addEventListener("mouseup",this.checkIfMultiSelect,false);
  }

  //检查是否是框选，是的话mouseup时触发selectionChangeHandle
  checkIfMultiSelect = ()=>{
    const selection = window.getSelection();
    if(!selection.isCollapsed){
      this.selectionChangeHandle();
    }
  }

  //当光标变化时，按钮选中状态也要相应改变
  selectionChangeHandle = ()=>{
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    //如果是点击按钮的，就跳过判断
    if(range.commonAncestorContainer.parentElement.className.indexOf("editor-header-btn")!==-1){
      return;
    }
    
    const oList = Object.assign({},this.state.operateList);
    oList["bold"] = document.queryCommandState("bold") ? true : false;
    oList["italic"] = document.queryCommandState("italic") ? true : false;
    oList["underline"] = document.queryCommandState("underline") ? true : false;
    this.setState({
      operateList:oList
    });
  }

  //失去焦点时保存光标信息
  saveRange = (e)=>{
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    this.rangePos = selection.getRangeAt(0);
  }

  //设置光标位置
  setRangePos = ()=>{
    const selection = window.getSelection();
    if (this.rangePos!=null) {
      try {   
        selection.removeAllRanges();
      } catch (ex) {   
        document.body.createTextRange().select();   
        document.selection.empty();   
      }  
      selection.addRange(this.rangePos);
    }
  }

  //切换模式
  switchMode = (e)=>{
    console.log(document.queryCommandEnabled("undo"))
    //用execCommand必须先focus，不然不生效
    this.setRangePos();

    const curMode = e.target.innerText;
    if(this.needToSwitchBtn.includes(curMode)){
      const oList = Object.assign({},this.state.operateList);
      oList[curMode] = !oList[curMode];
      this.setState({
        operateList:oList
      });
    }
    switch(curMode){
      case "bold":
        document.execCommand('bold', false, null);
        break;
      case "italic":
        document.execCommand('italic', false, null);
        break;
      case "underline":
        document.execCommand('underline', false, null);
        break;
      case "undo":
        document.execCommand('undo', false, null);
        break;
      case "redo":
        document.execCommand('redo', false, null);
        break;
      default:
        console.log("sth wrong");
    }
  }

  //防抖
  debounce = (func, wait, immediate)=>{
    var timeout, result;
    var debounced = function () {
        var context = this;
        var args = arguments;
        if (timeout) clearTimeout(timeout);
        if (immediate) {
            // 如果已经执行过，不再执行
            var callNow = !timeout;
            timeout = setTimeout(function(){
                timeout = null;
            }, wait)
            if (callNow){
              result = func.apply(context, args);
            }
        }
        else {
            timeout = setTimeout(function(){
                func.apply(context, args)
            }, wait);
        }
        return result;
    };
    debounced.cancel = function() {
        clearTimeout(timeout);
        timeout = null;
    };
    return debounced;
  }


  render() {
    return (
      <div className="App">
        <div className="editor-box" ref={this.editorBox}>
          <ul className="editor-header">
            {
              Object.keys(this.state.operateList).map((item,index)=>{
                return (
                  <li className={this.state.operateList[item]?"editor-header-btn selected":"editor-header-btn"} 
                      key={index}
                      onClick={this.switchMode}
                  >
                    {item}
                  </li>
                )
              })
            }
          </ul>
          <div 
            ref={this.editorContent} 
            className="editor-content" 
            contentEditable
            onBlur={this.saveRange}
          >
          </div>
        </div>
      </div>
    );
  }
}

export default App;
