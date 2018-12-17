import React, { Component } from 'react';
import "./style.css";


class SearchBar extends Component {
  state={search:''}

  handleChange = (event) =>{
    this.setState({search: event.target.value});
  }
  render() {
    return (
      <div className="searchBar">
        <input type="text" name="search" className="search" placeholder="Search for some cool photos ..." onChange={this.handleChange}/>
        <input type="submit" value="Search" className="submit" onClick={() => this.props.search(this.state.search)}/>
      </div>
    );
  }
}

export default SearchBar;
