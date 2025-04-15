/* global Excel console */
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI( { apiKey: YOUR_GEMINI_KEY } );

export async function getRowValues(row) {
  let res = [];
  try {
    await Excel.run(async (context) => {
      let sheet = context.workbook.worksheets.getActiveWorksheet();
      let usedRange = sheet.getUsedRange();
      usedRange.load(["columnIndex", "columnCount"]);
      await context.sync();
      let columnCount = usedRange.columnCount;
      let columnIndex = usedRange.columnIndex;
      let rowRange = sheet.getRangeByIndexes(row-1, columnIndex, 1, columnCount);
      rowRange.load("text");
      await context.sync();
      res = rowRange.text[0].map((value, i) => ({
        column: getColumnLetter(columnIndex + i),
        value,
      })).filter(item => item.value !== "");;
    });
  } catch (error) {
    console.log("Error: " + error);
  }
  return res;
}

function getColumnLetter(colIndex) {
  let letter = '';
  while (colIndex >= 0) {
    letter = String.fromCharCode((colIndex % 26) + 65) + letter;
    colIndex = Math.floor(colIndex / 26) - 1;
  }
  return letter;
}

// promptTemplate is "text text {{header.value}} text text"
// headerList format is [{column, value}]
// resultRowlist is the rows to compute [int]
// resultColumn is a char for the result column
export async function promptAndWrite(promptTemplate, resultColumn, resultRowList, model, headerList, temp) {
  const filteredList = filterUnusedCols(promptTemplate, headerList);
  try {
    await Excel.run(async (context) => {
      const sheet = context.workbook.worksheets.getActiveWorksheet();

      for(let i in resultRowList) {
        const row = resultRowList[i]
        const rowData = {};
        for (let idx in filteredList){
          // load the data first
          let address = `${filteredList[idx]["column"]}${row}`;
          let cell = sheet.getRange(address);
          cell.load("text");
          await context.sync();

          // create a map of { headerValue: cellText }
          rowData[filteredList[idx]["value"]] = cell.text[0][0]
        }

        // replace by mapping
        let prompt = promptTemplate;
        for (const key in rowData) {
          const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
          prompt = prompt.replace(regex, rowData[key]);
        }

        // call Gemini model
        const promptResult = await callModel(prompt, model, temp);
        
        // and finally write it down :D yay!
        const cell = sheet.getRange(`${resultColumn}${row}`);
        cell.values = promptResult;
        await context.sync();
      }
      
    });
  } catch (error) {
    console.error("Error in promptAndWrite:", error);
  }
}

function filterUnusedCols(promptTemplate, headerList) {
  // find the header value in template
  const regex = /{{(.*?)}}/g;
  let matches = [];
  let match;
  while ((match = regex.exec(promptTemplate)) !== null) {
    matches.push(match[1]);
  }
  // filter out column not in the prompt
  return headerList.filter(({value}) => matches.includes(value));
}

async function callModel(prompt, model, temp) {
  const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        temperature: temp,
      }
  });
  return response.text;
}