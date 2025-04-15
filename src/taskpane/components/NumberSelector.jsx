import * as React from "react";
import { makeStyles } from "@fluentui/react-components";
import { Input } from '@fluentui/react-components';

const useStyles = makeStyles({
    input: {
        border: '1px solid #ccc',
        transition: 'border-color 0.3s, box-shadow 0.3s',
        width: '50px',
        height: '100%',
    },
});


const NumberSelector = (props) => {
    const styles = useStyles();
    const handleChange = (num) => {
        props.setter(Number(num.target.value));
    }
    return (
        <div>
            <Input type="number" className={styles.input} min={props.min} value={props.value} onChange={handleChange} />
        </div>
    );
};

export default NumberSelector;
