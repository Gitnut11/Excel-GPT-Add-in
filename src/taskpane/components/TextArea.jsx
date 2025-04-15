import React, { useState } from "react";
import { makeStyles } from "@fluentui/react-components";

const useStyles = makeStyles({
    container: {
        paddingRight: "15px",
    },
    textarea: {
        width: "100%",
        fontSize: "16px",
        resize: "vertical",
        minHeight: "200px",
    },
});


const TextArea = (props) => {
    const styles = useStyles();
    return (
        <div className={styles.container}>
            <textarea
                className={styles.textarea}
                value={props.text}
                onChange={(e) => props.setText(e.target.value)}
                placeholder="Enter your prompt here..."
            />
        </div>
    );
};

export default TextArea;
