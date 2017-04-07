import React, { Component } from 'react';
import './App.css';
import TableContainer from './TableContainer';

let currentCount = 1;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      containers: [<TableContainer key={currentCount} />]
    };
  }

  onAdd = () => {
    currentCount++;

    this.setState({
      containers: [...this.state.containers, <TableContainer key={currentCount} />]
    });
  };

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to Table generators!</h2>
        </div>
        {this.state.containers}
        <button onClick={this.onAdd}>Add new</button>
      </div>
    );
  }
}

export default App;
