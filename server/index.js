const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json())

const { MongoClient, ServerApiVersion } = require('mongodb');

// const username="trifa"
// const password = "CshdInB0ogePrwkw"
const uri = "mongodb+srv://trifa:CshdInB0ogePrwkw@cluster0.f1sgxgc.mongodb.net/?retryWrites=true&w=majority";


// ENCRYPTION DECRYPTION 
// ENCRYPTION ALGORITHM

const encryptText = (text) => {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    let charCode = text.charCodeAt(i);
    if (charCode >= 65 && charCode <= 90) {
      result += String.fromCharCode(((charCode - 65 + 5) % 26) + 65);
    } else if (charCode >= 97 && charCode <= 122) {
      result += String.fromCharCode(((charCode - 97 + 5) % 26) + 97);
    } else {
      result += text.charAt(i);
    }
  }
  return result;
}

function decryptText(text, shift) {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    let charCode = text.charCodeAt(i);
    if (charCode >= 65 && charCode <= 90) {
      result += String.fromCharCode(((charCode - 65 + 21) % 26) + 65);
    } else if (charCode >= 97 && charCode <= 122) {
      result += String.fromCharCode(((charCode - 97 + 21) % 26) + 97);
    } else {
      result += text.charAt(i);
    }
  }
  return result;
}

// **** ENCRYPTION FUNCTION (IMPORTANT)
const encryptionFunction = (data) => {
  const encryptedData = {}
  const keys = Object.keys(data);
  const values = Object.values(data);
  console.log("all keys", keys)
  console.log("all values", values);
  for (let index = 0; index < keys.length; index++) {
    console.log(`${index}`,keys[index], values[index]);
    const key = encryptText(keys[index]);
    const value = encryptText(values[index]);
    encryptedData[`${key}`] = value;
    console.log("encrypted data", encryptedData)
  }
  return encryptedData;
}

// *** DECRYPTION FUNCTION (IMPORTANT)
//DECRYPTION FUNCTION
const decryptionFunction = (data) => {
  const finalDecryptedData = [];
  for (let index = 0; index < data.length; index++) {
    
    console.log("Answering data", data[index]);
    const keys = Object.keys(data[index]);
    const values = Object.values(data[index]);
    const entries = Object.entries(data[index]);
    console.log("entries", entries)
    console.log("keys", keys);
    console.log("values", values);  
    const decryptedData = {}
    for (let index = 0; index < keys.length; index++) {
      const key = decryptText(keys[index]);
      const value = decryptText(values[index]);
      decryptedData[`${key}`] = value;
    } 
    finalDecryptedData[index]=decryptedData;
  }
  return finalDecryptedData;
}


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    //await client.connect();
    
    // PATIENT
    const patientCollection = client.db('doctor-patient').collection('patient');
    
    
    // app.get("/patient", async(req,res) => {
    //   const query = {};
    //   const patient = await patientCollection.findOne(query);
    //   console.log(patient);
    //   res.send(patient);
    // })

    app.post("/addpatient", async(req,res) => {
      const pat = req.body;
      const encryptedPat = encryptionFunction(pat)
      const result = await patientCollection.insertOne(encryptedPat);
      console.log("doneeeeeeee", result);
      res.send(result);
    })



    
    // DOCTOR AND PATIENT COMBINE TABLE
    const doctorAndPatientCollection = client.db('doctor-patient').collection('doctor-and-patient');

    app.post("/doctorviewrecord", async(req,res) => {
      const {name} = req.body;
      const dname = name;
      const searchDoctor = {dname};
      const encryptedSearchDoctor = encryptionFunction(searchDoctor);
      console.log("currentdoctor", req.body)
      const viewDoctorRecord = await doctorAndPatientCollection.find(encryptedSearchDoctor).toArray();
      const decryptedViewDoctorRecord = decryptionFunction(viewDoctorRecord);
      res.send(decryptedViewDoctorRecord);
      console.log(decryptedViewDoctorRecord)
      
    })

    app.post("/patientviewrecord", async(req,res)=> {
      const {name} = req.body;
      const pname = name;
      const searchPatient = {pname};
      const encryptedSearchPatient = encryptionFunction(searchPatient);
      const viewPatientRecord =await doctorAndPatientCollection.find(encryptedSearchPatient).toArray();
      const decryptedViewPatientRecord = decryptionFunction(viewPatientRecord);
      res.send(decryptedViewPatientRecord);
      console.log(decryptedViewPatientRecord);
    })

    app.post("/addrecord", async(req,res) => {
      const addRecord = req.body;
      const encryptedAddRecord = encryptionFunction(addRecord)
      const result = await doctorAndPatientCollection.insertOne(encryptedAddRecord);
      console.log("doneeeeeeee", result);
      res.send(result);
    })

    // DOCTOR AND PATIENT COMBINE APPOINTMENT
    const appointmentCollection = client.db('doctor-patient').collection('appointment');

    app.post("/bookdoctor", async(req,res) => {
      const bookingDoc = req.body;
      const encryptedBookingDoc = encryptionFunction(bookingDoc);
      const cursor = await appointmentCollection.insertOne(encryptedBookingDoc);
      res.send(cursor);
      console.log(bookingDoc);
    })

    
    app.post("/currentdoctor", async(req,res) => {
      const {name} = req.body;
      const dname = name;
      const searchCurrentDoctor = {dname};
      const encrypptedSearchCurrentDoctor = encryptionFunction(searchCurrentDoctor);
      const cursor = await appointmentCollection.find(encrypptedSearchCurrentDoctor).toArray();
      console.log("currentdoctor", cursor)
      const decryptedAppointmnets = decryptionFunction(cursor);
      res.send(decryptedAppointmnets);
    })

    // DOCTOR LIST
    const doctorListCollection = client.db('doctor-patient').collection('doctor-list');

    app.post("/doctorlist", async(req,res) => {
      const searchInfo = req.body;
      const encryptedSearchInfo = encryptionFunction(searchInfo);
      console.log("valueeee", searchInfo)
      const result = await doctorListCollection.find(encryptedSearchInfo).toArray();
      console.log("find doctor", result);

      const decryptedResult = decryptionFunction(result)
      res.send(decryptedResult);
      console.log("sending decrypted data",decryptedResult)
    })
    app.post("/doctor", async(req,res) => {
      const doc = req.body;
      const encryptedDoc = encryptionFunction(doc)
      const result = await doctorListCollection.insertOne(encryptedDoc);
      console.log("new doc", encryptedDoc);
      console.log("doneeeeeeee", result);
      res.send(result);
    })


    






    
    // await client.db("doctor-patient").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get("/pat", async(req,res) => {
    console.log("hellloooooooooooo")
    res.send("checkkkkkkkkkkkkkkk")
  })
  app.listen(2800, () => {
      console.log(`Server is running on http://localhost:2800`);
  });
