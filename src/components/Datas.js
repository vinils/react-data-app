import React, { Component } from 'react';
import {TreeTable} from '@vinils/react-table'
import {LoadPrototype as LoadArrayPrototype} from './Array';
import {LoadPrototype as LoadDatePrototype} from './Date';

export default class Datas extends Component {
    constructor (props) {
        super(props)
        
        this.state = {
            search: (line) => true,
            data: null,
            keys: null
        }

        LoadDatePrototype();
        LoadArrayPrototype();

        if(this.props.groupFilterId) {
            this.getData(this.props.groupFilterId)
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.groupFilterId) {
            if(nextProps.groupFilterId !== this.props.groupFilterId) {
                this.getData(nextProps.groupFilterId)
            }
        }
    }

    //dataGroupId = '98B34F14-6DAA-3EE4-4EB1-E6D4F691960E'
    getData = (dataGroupId) =>{
        let castTree = (treeNode, childName, callBackFn) => {
            if(!treeNode) {
                return null;
            }
        
            return {
                ...callBackFn(treeNode),
                [childName]: treeNode[childName].map(child => castTree(child, childName, callBackFn))
            }
        }
      
        const odataUrl = 'http://192.168.15.35:8002/odata/v4'
        const oataGroupsUrl = odataUrl + '/groups'
        const datasUrl = oataGroupsUrl + `?$filter=Id eq ${dataGroupId}&$expand=Childs($levels=max;$expand=Datas($expand=Data.Models.DataDecimal/LimitDenormalized,Data.Models.DataString/LimitDenormalized))`
        fetch(datasUrl)
          .then(res => res.json())
          .then(json => {
            let groupDatas = json.value[0];
            groupDatas.cast = (callBackFn) => castTree(groupDatas, 'Childs', callBackFn);
            let keys = []
            let datas = groupDatas.cast(group => {
                let ret = {
                    Id: group.Id,
                    Name: group.Name,
                    Initials: group.Initials,
                    MeasureUnit: group.MeasureUnit,
                    ParentId: group.ParentId
                }
    
                if(group.Datas) {
                    let groupedDatasByDate = group.Datas
                      .GroupBy(e => new Date(e.CollectionDate).formatToYYYY_MM_DD() + "T00:00:00");
        
                    keys = keys.concat(groupedDatasByDate.keys())
        
                    let groupedDatasByDateCasted = groupedDatasByDate
                      .cast((eg, key) => ({[key]: this.valueCol(eg[0])}))
        
                    ret = {
                        ...ret, 
                        ...groupedDatasByDateCasted
                    }
        
                    let limits = group.Datas
                      .map(e=> this.getLimitDescription(e))
                      .filter(l => l != null || l !== '');
        
                    if(!ret.LimitDescription) {
                        ret.LimitDescription = limits[0];
                    }
                }
    
                return ret;
            })
    
            this.setState({data: datas, keys: keys.Distinct()})
        })
    }

    getLimitDescription(data) {
      let limitDescription = '';
  
      switch(data["@odata.type"]) {
        case "#Data.Models.DataDecimal":
          let limitDecimal = data.LimitDenormalized;
          if(limitDecimal) {
            if(limitDecimal.Name) {
              limitDescription += limitDecimal.Name + ":"
            }
  
            if(limitDecimal.MinType === "BiggerThan") {
              limitDescription += " > " + limitDecimal.Min;
            } else if(limitDecimal.MinType === "EqualsOrBiggerThan") {
              limitDescription += " >= " + limitDecimal.Min;
            }
  
            if(limitDecimal.MinType && limitDecimal.MaxType) {
              limitDescription += " e"
            }
  
            if(limitDecimal.MaxType === "SmallThan") {
              limitDescription += " < " + limitDecimal.Max;
            } else if(limitDecimal.MaxType === "SmallOrEqualsThan") {
              limitDescription += " <= " + limitDecimal.Max;
            }
          }
          break;
        case "#Data.Models.DataString":
          let limitString = data.LimitDenormalized;
          limitDescription = limitString ? limitString.Expected : null
          break;
        default:
      }
  
      return limitDescription;
    }
    
    valueCol(data) {
        let value = null;
        let color = null;
    
        switch(data["@odata.type"]){
          case "#Data.Models.DataDecimal":
            value = data.DecimalValue;
            color = data.LimitDenormalized ? data.LimitDenormalized.Color : null;
            break;
          case "#Data.Models.DataString":
            value = data.StringValue;
            color = data.LimitDenormalized ? data.LimitDenormalized.Color : null;
            break;
          default:
            throw new Error("data type not identified")
        }
    
        return <div style={color ? {backgroundColor: '#' + color.toString(16)} : null}><center>{value}</center></div> 
    }
    
    handleFilterChange = (value) => {
        if(!value) {
          this.setState({search: (line) => true})
        } else {
          this.setState({search: (line) => line.Name.toLowerCase().indexOf(value.toLowerCase()) >= 0})
        }
    }
    
    headColumns() {
        const searchHead = (<div>Nome<br/><input size={10} onChange={(e) => this.handleFilterChange(e.target.value)}/></div>)
        let dates = this.state.keys
        let datesSorted = dates.sort((str1, str2) => new Date(str2) - new Date(str1))
        let mappedDates = datesSorted.map((date) => {return {description: <center><b>{new Date(date).formatToDD_MM_YY()}</b></center>, name: date}})
        return [
            {description: <b>{searchHead}</b>, name: 'Name'},
            ...mappedDates,
            {description: <center><b>Un</b></center>, name: 'MeasureUnit'}, 
            {description: <b>Referência</b>, name: 'LimitDescription'}, 
        ]
    }
    
    getChilds(line) {
        return line.Childs
    }

    render() {
        if(!this.state.data || !this.props.groupFilterId) {
            return <label>Loading...</label>;
        } else {
            return (
                <TreeTable
                  style={{borderCollapse: 'collapse',
                    borderSpacing: 0,
                    width: '100%',
                    border: '1px solid #ddd',
                    row: {nthChild: '#f2f2f2'}}}
                    head={this.headColumns()}
                  getChilds={this.getChilds}
                  filter={this.state.search}>
                    {this.state.data.Childs}
                </TreeTable>
            );
        }
    }
}
