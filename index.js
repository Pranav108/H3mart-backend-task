const express = require("express");
const { google } = require("googleapis");
const getPrice = require("./utilities/GetPrice");

const app = express();

app.get("/", async (req, res) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  //Create client instance for auth
  const client = await auth.getClient();

  //Instance for Google-Sheet API
  const googleSheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = "1XkfAqpgaW7iuBYepjxMKGOTRdlzqSqtOnUuV_1U_FCc";

  //Get metadata about SpreadSheet
  const metadata = await googleSheets.spreadsheets.get({ auth, spreadsheetId });

  //Read rows from spraedSheet
  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Sheet1!A2:A",
  });

  //get an Array of new prices
  const priceList = await getPrice(getRows.data.values);

  //Write rows to spreadSheet
  await googleSheets.spreadsheets.values.update({
    auth,
    spreadsheetId,
    range: "Sheet1!B2:B",
    valueInputOption: "USER_ENTERED",
    requestBody: { values: priceList },
  });
  res.send(getRows.data);
});

app.listen(1024, (req, res) => console.log("running on 1024...."));
