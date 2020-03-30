import React, { Component } from 'react';
import InputAutoSugest from 'react-input-autosugest'
import { Group } from '../classes/Data';

class InputGroups extends Component {
    constructor(props){
        super(props)
        this.state = {
            value: this.inputDisplay(this.props.value),
            originalGroup: this.props.value
        }
    }

    componentWillReceiveProps(nextProps) {
        const value = nextProps.value
        if(this.state.originalGroup !== value) {
            this.setState({
                value: this.inputDisplay(value), 
                originalGroup: value
            })
        }
    }

    handleChange = e =>  {
        const value = e.target.value;
        const isGroupType = value && value.Name
        if(isGroupType) {
            const text = this.inputDisplay(value)
            this.setState({value: text})
            const newE = {
                target:{
                    name: this.props.name,
                    value: value
                }
            }
            this.props.onChange(newE)
        } else {
            this.setState({value: e.target.value})
        }
    }

    getData(value) {
        const backslashIndex = value.lastIndexOf('\\')
        const slashIndex = value.lastIndexOf('/')

        if(!value) {
            return null;
        }

        if(backslashIndex === 0 || slashIndex === 0) {
            throw new Error('first group can´t be null');
        }

        if(backslashIndex >= 0 && slashIndex >= 0) {
            throw new Error('slash and backslash can be used together');
        }
        
        let groupsString = value.split(/\/|\\/);
        const isReverse = slashIndex >= 0;

        if(isReverse) {
            groupsString = groupsString.reverse()
        }

        let group = null;

        for(let i = 0; i <= groupsString.length -1; i++ ){
            if(!group){
                group = new Group(groupsString[i]);
            } else {
                group = group.newChild(groupsString[i]);
            }

            group.isNew = true
        }

        return group;
 
        // return {
        //     "All": [],
        //     "Datas": [],
        //     "Parent": {
        //         "All": [],
        //         "Datas": [],
        //         "Parent": null,
        //         "Synonymous": null,
        //         "Synonyms": [],
        //         "Id": "33ccb123-3f1c-8d09-63e4-9c7e32ebae76",
        //         "Name": "Urina Tipo I",
        //         "Initials": null,
        //         "ParentId": null
        //     },
        //     "Synonymous": null,
        //     "Synonyms": [],
        //     "Id": "38928e69-0432-c3f9-2540-79301fdd27fc",
        //     "Name": "Dado Físico",
        //     "Initials": null,
        //     "ParentId": "33ccb123-3f1c-8d09-63e4-9c7e32ebae76"
        // }
    }

    searchDisplay(value) {
        const isGroupObject = value && value.Id 

        if(!value) {
            return '';
        } else if(typeof value === 'string') {
            return value;
        } else if (isGroupObject) {
            return value.parentReducer(group=> group.Initials ? group.Name + ' (' + group.Initials + ')' : group.Name, (accumulator, currentValue) => accumulator ? accumulator + currentValue + '/' : currentValue + '/' );
        } else {
            throw new Error('object type not null, empty, string or a group')
        }
    }

    inputDisplay(value) {
        const isGroupObject = value && value.Name

        if(!value) {
            return '';
        } else if(typeof value === 'string') {
            return value;
        } else if (isGroupObject) {
            let reduceItem = group => group.Initials ? group.Name + ' (' + group.Initials + ')' : group.Name 
            let accumulator = (accumulator, currentValue) => accumulator ? currentValue + '\\' + accumulator : currentValue
            return value.parentReducer(reduceItem, accumulator);
        } else {
            throw new Error('object type not null, empty, string or a group')
        }
    }

    handleBlur = () => {

        const hasInitialValueChanged = 
            this.state.value !== this.inputDisplay(this.state.originalGroup)

        if(hasInitialValueChanged) {
            try {
                let group = this.getData(this.state.value);

                const e = {
                    target: {
                        name:this.props.name,
                        value:group
                    }
                }

                this.props.onChange(e)
            } catch (error) {
                const e = {
                    target: {
                        name:this.props.name,
                        value:null
                    }
                }

                this.setState({value: ''})
                this.props.onChange(e)
            }
        }
    }

    // displayGroupName(group){
    //     return group.Name;
    // }
  
    filter = (group) => {
        return group.Name.toLowerCase().indexOf(this.state.value.toLocaleLowerCase()) >= 0;
    }

    render() {
        const {size, placeholder, data} = this.props

        return (
            <InputAutoSugest 
              size={size}
              name='value'
              value={this.state.value}
              placeholder={placeholder}
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              display={this.searchDisplay}
              filter={this.filter}
              data={data}/>
        );
    }
}

export default InputGroups;

