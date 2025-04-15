import { makeStyles } from "@fluentui/react-components";
import { promptAndWrite } from "../taskpane";
import * as React from "react";

const useStyles = makeStyles({
    buttonStyle: {
        backgroundColor: '#4aa864',
        color: 'white',
        fontSize: '16px',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        margin: '10px',
        fontWeight: 'bold',
        width: '200px'
    },
    disableButton: {
        backgroundColor: 'gray',
        cursor: 'not-allowed',
        fontSize: '16px',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        margin: '10px',
        fontWeight: 'bold',
        width: '200px',
        opacity: '10%'
    },

});


const RunButton = (props) => {
    const styles = useStyles();
    const [disableButton, setDisableButton] = React.useState(false);

    React.useEffect(() => {
        if(props.prompt == "" || props.resultCol == {} || props.resultRows.length == 0 || props.headerList.length == 0) {
            setDisableButton(true);
        }
        else {
            setDisableButton(false);
        }
    }, [props.prompt, props.resultCol, props.resultRows, props.headerList])
    const onClickHandler = async () => {
        setDisableButton(true);
        await promptAndWrite(props.prompt, props.resultCol["value"], props.resultRows, props.model["value"], props.headerList, props.temp);
        setDisableButton(false);
    }
    return (
        <div>
            <button className={(disableButton) ? styles.disableButton : styles.buttonStyle} disabled={disableButton} onClick={onClickHandler}>
                Run
            </button>
        </div>
    );
};

export default RunButton;