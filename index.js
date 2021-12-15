const express = require('express');
const app = express();
const path = require('path');
var FastText = require('fasttext');

app.use(express.static('public'));
app.use(express.json({limit: '1000mb'}));
app.listen(8000, () => {
  console.log('Listening on port 8000!')
});

let data = path.resolve(path.join(__dirname, 'train.txt'));
let model = path.resolve(path.join(__dirname, 'model'))
let options  = { 
  input: data,
  output: model,
  loss: "softmax",
  dim: 200,
  bucket: 2000000
}
let classifier = new FastText.Classifier();
classifier.train('supervised', options , function (success, error) {

  if(error) {
    console.log(error)
    return;
  }
  
  console.log(success)
  
})

app.post('/api', async (req, res) => {
  const statement = req.body.Getvalue;
  const name = await getFastTextResults(statement);
  var values = "";
  name.forEach(resault => {
                    values += resault.label.replace('__label__','') + "\n";
                   
            })
    
    res.json({values});
  

 
});



function getFastTextResults(statement) {
	//predict returns an array with the input and predictions for best cateogires
  return classifier.predict(statement, 5)
  
}


