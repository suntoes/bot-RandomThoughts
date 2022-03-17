
require('dotenv').config();
import { scrape } from './scrapper';

//_____DATABASE_____///
const mongoose = require('mongoose');
const { Schema } = mongoose;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const  dataSchema = new Schema({
    name: String,
    data: Array
})

const dataModel = mongoose.model('bot-data', dataSchema);

async function getData() {
    const result = await dataModel.findOne({name: "random-thoughts"}).exec()
    return result.data;
}

async function updateData(data:object) {
    dataModel.findOneAndUpdate( {name: "random-thoughts"}, {data: data}, {new: true}, (err, d) => {
        if (err) return console.error(err);
    });
}

// function that tells if thescrapped data is new or not from the database
async function generateData():Promise<any> {

    // initial thingy
    console.log('scrapping data...')
    let storedData:Promise<Array<any>> = await getData();
    let generatedData = false;

    await scrape().then(async(data) => {
        // tells if unfamiliar data, then if true, unshift the data to Db
        if(!(await storedData).includes(data[0])) {
            (await storedData).unshift(data[0]);
            updateData(storedData);
            generatedData = data[0];

            return console.log('new data scrapped...');
        }
        console.log('nothing new...');
    });
    // returns false if no new data, otherwise a string
    return generatedData;
}

export { generateData }