import React, { Component } from 'react';
import './App.css';
import Exam from './components/Exam'
import Exams from './components/Exams'
import { loadArrayOfTreeFunctions } from './components/Tree';

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      groups: null,
      selectedGroupId: '',
    }

    const odataUrl = 'http://192.168.15.250/data/odata/v4'
    const oataGroupsUrl = odataUrl + '/groups'
    const groupsUrl = oataGroupsUrl + '?$filter=ParentId eq null&$expand=Childs($levels=max)'
    fetch(groupsUrl)
      .then(res => res.json())
      .then(json => {
        loadArrayOfTreeFunctions(json.value, 'Id', 'Childs', 'Parent', 'ParentId')
        return json.value;
      })
      .then((response) => this.setState({groups: response}))
  }

  handleClick(idx1, idx2) {
    console.log(idx1, idx2)
  }

  handleChange = (e) => 
    this.setState({[e.target.name]: e.target.value})


  render() {
    if(!this.state.groups) {
        return <label>Loading...</label>;
    } else {
      const groupsData = this.state.groups.toArray().map(group => {
        return {
            object: group,
            id: group.Id,
            name: group.parentReducer(group=> group.Initials ? group.Name + ' (' + group.Initials + ')' : group.Name, (accumulator, currentValue) => accumulator ? currentValue + '\\' + accumulator : currentValue )
          }
      })

      const groupOptions = groupsData.sort((a, b) => ('' + a.name).localeCompare(b.name)).map(group => {
        return <option key={group.id} value={group.id}>{group.name}</option>
      })

      return (
        <div className="App">
          {/* <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header> */}
          <label>Filter</label>
          <br/>
          <select name='selectedGroupId' onChange={this.handleChange} className="form-control">
            <option value={''}>{'Selecionar filtro'}</option>
            {groupOptions}
          </select>

          <br/>
          <Exam group={this.state.selectedGroupId ? groupsData.find(g => g.id === this.state.selectedGroupId).object : this.state.groups}/>
          {this.state.selectedGroupId ? <Exams groupFilterId={this.state.selectedGroupId}/> : null }
        </div>
      );
    }
  }
}

export default App;
