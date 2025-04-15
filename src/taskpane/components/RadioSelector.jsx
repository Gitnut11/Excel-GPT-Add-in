import React, { useState } from "react";
import { makeStyles } from "@fluentui/react-components";
import NumberSelector from "./NumberSelector";

const useStyles = makeStyles({
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "left",
        gap: "10px",
        fontSize: "16px",
        paddingTop: "5px",
    },
    radioGroup: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
});


const RadioSelector = (props) => {
    const styles = useStyles();
    const [option, setOption] = React.useState("all");
    const [autoNum, setAutoNum] = React.useState(1);
    const [start, setStart] = React.useState(2);
    const [end, setEnd] = React.useState(2);

    const [autoRow, setAutoRow] = React.useState([]);
    const [fixedRow, setFixedRow] = React.useState([]);
    const [allRow, setAllRow] = React.useState([]);

    // make sure start end not violating header row
    React.useEffect(() => {
        setStart(props.headerRow + 1);
        setEnd(props.headerRow + 1);
    }, [props.headerRow]);

    // end must be at least start
    React.useEffect(() => {
        if (start > end) {
            setEnd(start);
        }
    }, [start, end]);

    // make a list from headerRow + 1 of end - start + 1 elements
    React.useEffect(() => {
        setFixedRow(Array.from(new Array(end - start + 1), (x, i) => (i + start)))
    }, [start, end])

    // make a list of headerRow + 1, headerRow + 2, ... 
    React.useEffect(() => {
        setAutoRow(Array.from(new Array(autoNum), (x, i) => (i + props.headerRow + 1)))
    }, [autoNum, props.headerRow])

    // event to track if sheet update and all row amount changes
    React.useEffect(() => {
        const updateAllRow = async () => {
          try {
            await Excel.run(async (context) => {
              const sheet = context.workbook.worksheets.getActiveWorksheet();
              const usedRange = sheet.getUsedRange();
              usedRange.load(["rowIndex", "rowCount"]);
              await context.sync();
      
              const rows = Array.from(
                { length: usedRange.rowCount - props.headerRow },
                (_, i) => props.headerRow + 1 + i
              );
              setAllRow(rows);
            });
          } catch (error) {
            console.log(error);
          }
        };
      
        Office.context.document.addHandlerAsync(
          Office.EventType.DocumentSelectionChanged,
          updateAllRow
        );
      
        return () => {
          Office.context.document.removeHandlerAsync(
            Office.EventType.DocumentSelectionChanged,
            { handler: updateAllRow }
          );
        };
      }, []);
      

    // update state base on option
    React.useEffect(() => {
        if (option === "all") {
            props.setter(allRow);
        }
        else if (option === "auto") {
            props.setter(autoRow);
        }
        else {
            props.setter(fixedRow);
        }
    }, [option, fixedRow, autoRow, allRow])





    const handleChange = (opt) => {
        setOption(opt.target.value);
    }
    return (
        <div className={styles.container}>
            <div className={styles.radioGroup}>
                <input type="radio" name="apply" value="all" checked={option === "all"} onChange={handleChange} />
                <label>All</label>
            </div>
            <div className={styles.radioGroup}>
                <input type="radio" name="apply" value="auto" checked={option === "auto"} onChange={handleChange} />
                <label>Auto for</label> <NumberSelector setter={setAutoNum} value={autoNum} min={1} /> <label>rows</label>
            </div>
            <div className={styles.radioGroup}>
                <input type="radio" name="apply" value="fixed" checked={option === "fixed"} onChange={handleChange} />
                <label>From</label> <NumberSelector setter={setStart} value={start} min={props.headerRow + 1} />
                <label>to</label> <NumberSelector setter={setEnd} value={end} min={start + 1} />
            </div>
        </div>
    );
};

export default RadioSelector;
