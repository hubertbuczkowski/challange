import React, { Component } from 'react';
import './stylePic.css';

function hashtags(tags){
  var tagsRet = [];
  for(var tag of tags){
    tagsRet.push((<a href={'https://www.flickr.com/search/?text='+tag._content}>{" #"+tag._content}</a>));
  }
  return tagsRet;
}

class Picture extends Component {

  render() {
    if(this.props.element!= null)
    {
      return (
        <div className="out">
          <div className="date">{this.props.element.date}</div>
          <div className="box">
            <a href={this.props.element.link} target="_blank"><img src={this.props.element.picture} alt="" /></a>
            <div className="title">{this.props.element.title}</div>
            <div className="tags">{hashtags(this.props.element.tags)}</div>
            <div className="link"><a href={this.props.element.link}>{this.props.element.link}</a></div>
          </div>
          <div className="owner">Author: <b>{this.props.element.owner}</b></div>
        </div>
      );
    }
    else {
      return (<div className="box"/>)
    }
  }
}

export default Picture;
