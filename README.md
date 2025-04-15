## Prerequisites

- Node.js (the latest LTS version). Visit the [Node.js site](https://nodejs.org/) to download and install the right version for your operating system. To verify that you've already installed these tools, run the commands `node -v` and `npm -v` in your terminal.
- Office connected to a Microsoft 365 subscription. You might qualify for a Microsoft 365 E5 developer subscription through the [Microsoft 365 Developer Program](https://developer.microsoft.com/microsoft-365/dev-program), see [FAQ](https://learn.microsoft.com/office/developer-program/microsoft-365-developer-program-faq#who-qualifies-for-a-microsoft-365-e5-developer-subscription-) for details. Alternatively, you can [sign up for a 1-month free trial](https://www.microsoft.com/microsoft-365/try?rtc=1) or [purchase a Microsoft 365 plan](https://www.microsoft.com/microsoft-365/buy/compare-all-microsoft-365-products).
- Get a [Google Gemini API Key](https://ai.google.dev/gemini-api/docs)

## Setting up

- Replace the `YOUR_GEMINI_KEY` with your Google Gemini API Key in `taskpane.js` and `functions.js`.
- Open the project directory and type `npm install` and wait for the dependency to be installed.
- Build the app with `npm run build` (it could have a few warning but it is fine as long as no error).
- Open the app with `npm start`

## How to use
### 1. The taskpane application:
- The taskpane runs row-wise, i.e. it execute the prompt for each row.
- Choose your Gemini model.
- Choose the header row (the program only execute on the row __below__ the header row).
- Write your own prompt (be precise). You can use other column as parameter for the prompt by putting the __column name__ (in the header row) in `{{}}`.
For example: use `{{Description}}` for the `Description` column. Note that if the column name is not on the header row (e.g because of mistype), the whole `{{value}}` will be kept unchanged for the prompt.
- You can select the column to put the final result in (the selection bar with automatically detect the column).
- Choose your option for the execution:
    - _All_: run from the row below the header row to the last used row in the sheet.
    - _Auto_: for some number of row below the header row.
    - _Fixed_: rows from range of choice.
- Use the slider to adjust temperature of the model.
- Press Run to execute.

### 2. Custom function: "GPT_SUMMARIZE"
- The custom function has parameters: **GPT_SUMMARIZE(text, format, temperature, mode)**
    - _text_: the input text.
    - _format_ (optional): is a string describing your format (the default value is `"a single paragraph"`). Describe for the model as you wish.
    - _temperature_ (optional): is a number, indicating the temperature of the model (default value is `0.7`).
    - _model_ (optional): the default is `"gemini-2.0-flash-lite"`, use one of `"gemini-2.0-flash-lite"`,`"gemini-2.0-flash"`, `"gemma-3-27b-it"`, `"gemma-2-27b-it"`. For other input values, the default model is chosen.


## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**