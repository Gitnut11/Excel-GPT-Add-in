import * as React from "react";
import Select from "react-select";


const Selector = (props) => {
    const handleChange = (selection) => {
        props.setter(selection);
    }
    return (
        <div>
            <Select styles={{
                container: (provided) => ({
                    ...provided,
                    marginLeft: '2px',
                    marginRight: '10px',
                }),
            }} options={props.options} value={props.value} onChange={handleChange} defaultValue={props.default} />
        </div>
    );
};

export default Selector;
