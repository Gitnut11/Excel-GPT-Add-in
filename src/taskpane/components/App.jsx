import * as React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@fluentui/react-components";
import { getRowValues } from "../taskpane";
import NumberSelector from "./NumberSelector";
import Selector from "./Selector";
import TextArea from "./TextArea";
import RadioSelector from "./RadioSelector";
import RunButton from "./RunButton";
import SimpleSlider from "./SimpleSlider";

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
    gap: "0px",
  },
  config: {
    display: "flex",
    columnGap: "12px",
    alignItems: "center",
    backgroundColor: "#4aa864",
    height: "50px",
    paddingLeft: "10px",
    marginBottom: "5px",
  },
  container: {
    marginLeft: '10px',
    marginTop: "5px",
    marginBottom: "5px",
  },
  label: {
    marginBottom: '5px',
    marginTop: "5px"
  },
  output_container: {
    display: "flex",
    justifyContent: "space-between",
    gap: "0px",
  }
});

const modelOpt = [
  { value: "gemini-2.0-flash-lite", label: "Gemini 2.0 Flash Lite" },
  { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
  { value: "gemma-3-27b-it", label: "Gemma 3 27B" },
  { value: "gemma-2-27b-it", label: "Gemma 2 27B" }
]

const App = (props) => {
  const styles = useStyles();
  const [model, setModel] = React.useState(modelOpt[0]);
  const [headerRow, setHeaderRow] = React.useState(1);
  const [headerList, setHeaderList] = React.useState([]);
  const [columnOptions, setColumnOptions] = React.useState([]);
  const [resultCol, setResultCol] = React.useState({});
  const [resultRows, setResultRows] = React.useState([]);
  const [prompt, setPrompt] = React.useState("");
  const [temp, setTemp] = React.useState(1);

  // update header list using header row
  React.useEffect(() => {
    const updateHeaders = async () => {
      const values = await getRowValues(headerRow);
      setHeaderList(values);
    };
    updateHeaders();
  }, [headerRow])

  // detect current header row is edited
  React.useEffect(() => {
    const handleSheetChange = async (eventArgs) => {
      const address = eventArgs.address;
      const row = parseInt(address.replace(/[^\d]/g, ''));
      if (headerRow == row) {
        const values = await getRowValues(row);
        setHeaderList(values);
      }
    };
    // make sure excel is not in edit mode
    const tryAttachListener = async () => {
      let success = false;
      while (!success) {
        try {
          await Excel.run(async (context) => {
            const sheet = context.workbook.worksheets.getActiveWorksheet();
            sheet.onChanged.add(handleSheetChange);
            await context.sync();
          });
          success = true;
        } catch (err) {
          if (err.code === "InvalidOperation") {
            // Excel is likely in edit mode
            await new Promise(resolve => setTimeout(resolve, 500)); // retry after 500ms
          } else {
            console.error("Unexpected error in Excel.run:", err);
            break;
          }
        }
      }
    };
  
    tryAttachListener();
  
    return () => {
      Excel.run(async (context) => {
        const cleanupSheet = context.workbook.worksheets.getActiveWorksheet();
        cleanupSheet.onChanged.remove(handleSheetChange);
        await context.sync();
      });
    };
  }, [headerRow]);

  // modify header list to be compatible with react-select for Selector
  React.useEffect(() => {
    function makeColumnOptions(list) {
      return list.map((value) => ({
        value: value['column'],
        label: `${value['column']}: ${value['value']}`,
      }));
    }
    let result = makeColumnOptions(headerList);
    setColumnOptions(result);
    if (result.length > 0) {
      setResultCol(result[0]);
    } else {
      setResultCol(null);
    }
  }, [headerList]);

  return (
    <div className={styles.root}>
      {/*select model and header row*/}
      <div className={styles.config}>
        <h3 className={styles.label}>Model: </h3>
        <Selector setter={setModel} options={modelOpt} default={modelOpt[0]} />
        <h3 className={styles.label}>Header Row: </h3>
        <NumberSelector setter={setHeaderRow} value={headerRow} min={1} />
      </div>

      <div className={styles.container}>
        {/*prompt*/}
        <h3 className={styles.label}>Prompt to run for each row: </h3>
        <TextArea text={prompt} setText={setPrompt} />

        {/*result column selector*/}
        <h3 className={styles.label}>Put results in column: </h3>
        <Selector setter={setResultCol} options={columnOptions} value={resultCol} />

        <div className={styles.output_container}>
          {/*apply options*/}
          <div style={{ padding: '5px' }}>
            <h3 className={styles.label}>Apply options: </h3>
            <RadioSelector headerRow={headerRow} setter={setResultRows} />
          </div>
          <div style={{ padding: '5px' }}>
            <h3 className={styles.label}>Temperature: {temp} </h3>
            <SimpleSlider setter={setTemp} value={temp} />
            {/*run model*/}
            <RunButton prompt={prompt} resultCol={resultCol} resultRows={resultRows} model={model} headerList={headerList} temp={temp}/>
          </div>
        </div>
      </div>
    </div>
  );
};

App.propTypes = {
  title: PropTypes.string,
};

export default App;
