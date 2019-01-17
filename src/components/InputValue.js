import React, { Component } from 'react';

export const Types = {
    empty: 'empty',
    string: 'string',
    number: 'number',
}

export const InputValueCons = props => {
    return (
        <React.Fragment>
            <input 
              type="text" 
              name="value" 
              onChange={props.onChange} 
              value={props.value}/>
        </React.Fragment>
    ); 
};

export default class InputValue extends Component {
    constructor (props) {
        super(props)
        this.state = Types.empty
    }
    
    render() {
        const getType = (value) => {
            if(!value || !value.trim()){
                return Types.empty;
            }
            else if(isNaN(value)){
                return Types.string;
            }
            else{
                return Types.number;
            }
        };
    
        const onTypeChange = (type) =>{
            this.props.onTypeChange(type);
        }

        const onChange = (e) => {
            var value = e.target.value;
            this.setState({value: value})
    
            this.props.onChange(e);

            var valueType = getType(value);
    
            if(this.state !== valueType) {
                this.setState({valueType}, onTypeChange(valueType))
            }
        }
    
        return (
            <InputValueCons
                value={this.props.value}
                onChange={onChange}
            />
        );
    }
}

// export default Value;