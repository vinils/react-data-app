import React, { Component } from 'react'
import PropTypes from 'prop-types'
import InputValue, { Types as valueTypes } from './InputValue'
import InputAutoSugest from 'react-input-autosugest'
import {groupExtensions, ExamString, ExamDecimal, Group} from './Data'
import InputGroups from './InputGroups'
import { treeExtensions } from './Tree';

const data = [
    'aabaa1',
    'aaaaa2',
    'aaaaa3',
    'aaaaa4'
]

const cell = {
    display: 'inline-block',
    padding: '10px'
};

const styles = {
    cell: cell
};

const StringLimitCons = (props) => {
    return (
        <React.Fragment>
            <div style={styles.cell}>
                <label>Cor: </label>
                <br/>
                <select 
                  name={props.colorName} 
                  value={props.colorValue} 
                  onChange={props.onChange}>
                    <option value=''>Transparente</option>
                    <option value={16776960}>Amarelo</option>
                    <option value={16711680}>Vermelho</option>
                </select>
            </div>
            {!props.colorValue ? null : (
                <div style={styles.cell}>
                    <label>Esperado: </label>
                    <br/>
                    <InputAutoSugest
                      name={props.expectedName}
                      value={props.expectedValue}
                      onChange={props.onChange}
                      data={props.limitData}
                      placeholder="ex.: Positivo"/>
                </div>
            )}
        </React.Fragment>
    )
}

const NumberLimitCons = (props) => {
    return (
        <React.Fragment>
            <div style={{...styles.cell, border: '1px solid black'}}>
                <div style={styles.cell}>
                    <label>Tipo: </label>
                    <br/>
                    <select
                      name={props.minTypeName} 
                      value={props.minTypeValue} 
                      onChange={props.onChange}>
                        <option></option>
                        <option value={2}>>=</option>
                        <option value={1}>></option>
                    </select>
                </div>
                <div style={styles.cell}>
                    <label>Min: </label>
                    <br/>
                    <input
                        name={props.minName}
                        value={props.minValue}
                        onChange={props.onChange}/>
                </div>
                <br/>
                <div style={styles.cell}>
                    <label>Tipo: </label>
                    <br/>
                    <select 
                      name={props.maxTypeName}
                      value={props.maxTypeValue} 
                      onChange={props.onChange}>
                        <option></option>
                        <option value={2}>{'<='}</option>
                        <option value={1}>{'<'}</option>
                    </select>
                </div>
                <div style={styles.cell}>
                    <label>Max: </label>
                    <br/>
                    <input
                        name={props.maxName}
                        value={props.maxValue}
                        onChange={props.onChange}/>
                </div>
                <br/>
                <div style={styles.cell}>
                    <label>Cor: </label>
                    <select 
                      name={props.colorName} 
                      value={props.colorValue} 
                      onChange={props.onChange}>
                        <option value={''}>Transparente</option>
                        <option value={16776960}>Amarelo</option>
                        <option value={16711680}>Vermelho</option>
                    </select>
                </div>
                {!props.colorValue ? null : (
                    <React.Fragment>
                        <br/>
                        <div style={styles.cell}>
                            <label>Descrição: </label>
                            <InputAutoSugest
                              name={props.descriptionName}
                              value={props.descriptionValue}
                              onChange={props.onChange}
                              data={data}/>
                        </div>
                    </React.Fragment>
                ) }
                <br/>
                <div style={styles.cell}>
                    <button
                      onClick={props.onSave}>
                        Salvar
                    </button>
                </div>
            </div>
        </React.Fragment>
    )
}

class Exam extends Component {
  constructor (props) {
    super(props)
    this.state = {
    //   name: '',
    //   initials: '',
      value: '',
      valueType: valueTypes.empty,
      collectionDate: '',
      synonyms: '',
      measureUnit1: '',
      activedIdx: -1,

      stringLimitExpected: '',
      stringLimitColor: '',

      limitNumberDescription: '',
      decimalLimitMinType: undefined,
      decimalLimitMin: '',
      decimalLimitMaxType: undefined,
      decimalLimitMax: '',
      decimalLimitColor: '',

      existentGroup: '',
      newGroup: null,
    }

    groupExtensions(ExamString.prototype);
    groupExtensions(ExamDecimal.prototype);
    treeExtensions(Group.prototype);
    
    // fetch('http://192.168.15.143:57956/odata/v4/groupsv4(98B34F14-6DAA-3EE4-4EB1-E6D4F691960E)/GetAllRecursively')
    // .then((response) => {
    //     if(!response.ok) {
    //         console.log(response)
    //         throw Error(response.statusText)
    //         // return Promise.reject({status: response.status, response});
    //     }

    //     response.json().then(data => {
    //         if(!response.ok) {
    //             console.log(data)
    //             throw Error(data)
    //             // return Promise.reject({status: response.status, data});
    //         }

    //         this.setState({exams: data.value, loadingExams:false})
    //     })
    // })
    // .catch((error) => console.log(error))

    // selectGroups2('98B34F14-6DAA-3EE4-4EB1-E6D4F691960E')
    // .then((response) => {
    //     this.setState({groups: response, loadingGroups:false})
    // })
    // .catch((error) => console.log(error))
  }

  handleChange = e => 
    this.setState({[e.target.name]: e.target.value})

  handleExistentGroupChange = e => {
      const newState = {
          existentGroup: e.target.value,
          measureUnit1: e.target.value && e.target.value.MeasureUnit ? e.target.value.MeasureUnit : '',
      }

    this.setState(newState)
  }

  handleOnTypeValueCahnge = (type) => 
    this.setState({valueType: type});

  showLimitString() {
    return (
        <React.Fragment>
            <br/>
            <StringLimitCons
              expectedName="stringLimitExpected"
              expectedValue={this.state.stringLimitExpected}
              limitData={data}
              colorName="stringLimitColor"
              colorValue={this.state.stringLimitColor}
              onChange={this.handleChange}/> 
        </React.Fragment>
    )
  }

  showLimitNumber() {
    return (
        <div style={styles.cell}>
            <NumberLimitCons
              minTypeName='decimalLimitMinType' 
              minTypeValue={this.state.decimalLimitMinType} 
              minName='decimalLimitMin'
              minValue={this.state.decimalLimitMin}
              maxTypeName='decimalLimitMaxType'
              maxTypeValue={this.state.decimalLimitMaxType} 
              maxName='decimalLimitMax'
              maxValue={this.state.decimalLimitMax}
              colorName='decimalLimitColor'
              colorValue={this.state.decimalLimitColor} 
              descriptionName='limitNumberDescription'
              descriptionValue={this.state.limitNumberDescription}
              onChange={this.handleChange}
              onSave={this.handleSave}/>
        </div>
    )
  }

  showNewGroup() {
    return (
        <React.Fragment>
            <div style={styles.cell}>
                <label>Novo subgrupo: </label>
                <br/>
                <InputGroups
                    size="49"
                    name="newGroup"
                    value={this.state.newGroup}
                    onChange={this.handleChange}
                    placeholder="Grupo D\Grupo E ou Grupo E/Grupo D"
                    data={[]}/>
            </div>
            <br/>
        </React.Fragment>
    )
  }

  showMeasureUnit() {
    return (
        <React.Fragment>
            <br/>
            <div style={styles.cell}>
                <label>Un: </label>
                <br/>
                <InputAutoSugest
                  readOnly={this.state.existentGroup && this.state.existentGroup.isNew !== true && this.state.newGroup === null}
                  size="8"
                  name="measureUnit1"
                  value={this.state.measureUnit1}
                  onChange={this.handleChange}
                  data={data}/>
            </div>
        </React.Fragment>
    )
  }

  handleSave = () => {
    const {collectionDate, value, stringLimitExpected, stringLimitColor, limitNumberDescription, decimalLimitMinType, decimalLimitMin, decimalLimitMaxType, decimalLimitMax, decimalLimitColor, existentGroup, newGroup} = this.state;
    
    switch(this.state.valueType) {
        case valueTypes.string:
            let examString = new ExamString(
                collectionDate,
                value
            );

            examString.addGroup(existentGroup, newGroup, this.state.measureUnit1);

            if(stringLimitExpected || stringLimitColor) {
                examString.addLimit(stringLimitExpected, stringLimitColor)
            }

            console.log(examString)
            
        //     insertExamStringLimit(exam)
        fetch('http://192.168.15.250/data/odata/v4/exams', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(examString)
          })
        .then((response) => 
            response.json().then(data => {
              if (response.ok) {
                  
                  this.setState({name: ''})
                //   this.nameRef.focus()
                  return data;
              } else {
                return Promise.reject({status: response.status, data});
              }
            })
          )
          .then((responseJson) => { 
              // console.log(responseJson)
              // console.log(responseJson.ok)
          })
          .catch((error) => {
            console.error(error); })

        break;
        case valueTypes.number:
            var examDecimal = new ExamDecimal(
                collectionDate,
                value
            );

            examDecimal.addGroup(existentGroup, newGroup, this.state.measureUnit1);

            if(limitNumberDescription || decimalLimitMinType || decimalLimitMin || decimalLimitMaxType || decimalLimitMax || decimalLimitColor) {
                examDecimal.addLimit(limitNumberDescription, decimalLimitMinType, decimalLimitMin, decimalLimitMaxType, decimalLimitMax, decimalLimitColor)
            }

            console.log(examDecimal)

            // insertExamdecimals(exam)
            fetch('http://192.168.15.250/data/odata/v4/exams', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(examDecimal)
              })
            .then((response) => 
              response.json().then(data => {
                if (response.ok) {
                    this.setState({
                        existentGroup: examDecimal.Group ? examDecimal.Group : existentGroup, 
                        newGroup: null
                    })
                    return data;
                } else {
                  return Promise.reject({status: response.status, data});
                }
              })
            )
            .then((responseJson) => { 
                // console.log(responseJson)
                // console.log(responseJson.ok)
            })
            .catch((error) => {
              console.error(error); })
        break;
        default:
    }
  }

  displayExamName(exam){
      return exam.Name;
  }

  displayGroupName = (group) => {
      return group.parentReducer(group=> group.Initials ? group.Name + ' (' + group.Initials + ')' : group.Name, (accumulator, currentValue) => accumulator ? accumulator + currentValue + '/' : currentValue + '/' )
  }

  filterExam = (exam) => {
    return exam.Name.toLowerCase().indexOf(this.state.name.toLocaleLowerCase()) >= 0;
  }

    render () {
        const {value, collectionDate} = this.state
        return (
            <div style={styles.cell}>
                <div style={styles.cell}>
                    <div style={styles.cell}>
                        <label>Nome: </label>
                        <br/>
                        <InputGroups
                            size="50"
                            name="existentGroup"
                            value={this.state.existentGroup}
                            onChange={this.handleExistentGroupChange}
                            placeholder="Exame (Sigla)/Grupo B (B)/Grupo A(A)"
                            data={this.props.group.toArray()}/>
                    </div>
                    <br/>
                    { this.state.existentGroup && this.state.existentGroup.isNew !== true ? this.showNewGroup() : null }
                    <div style={styles.cell}>
                        <label>Valor: </label>
                        <br/>
                        <InputValue
                            value={value}
                            onChange={this.handleChange}
                            onTypeChange={this.handleOnTypeValueCahnge}/>
                    </div>
                    <div style={styles.cell}>
                        <label>Data da coleta: </label>
                        <br/>
                        <InputAutoSugest
                            name="collectionDate"
                            value={collectionDate}
                            placeholder="yyyy-mm-dd"
                            onChange={this.handleChange}
                            data={data}/>
                    </div>
                    { this.state.valueType === valueTypes.number ? this.showMeasureUnit() : null }
                    { this.state.valueType === valueTypes.string ? this.showLimitString() : null }
                    <br/>
                    <div style={styles.cell}>
                        <button
                            onClick={this.handleSave}>
                            Salvar
                        </button>
                    </div>
                </div>
                { this.state.valueType === valueTypes.number ? this.showLimitNumber() : null }
            </div>
        );
    }
}

Exam.propTypes = {
  // createPost: PropTypes.func.isRequired,
  // user: PropTypes.array.isRequired
}

export default Exam
