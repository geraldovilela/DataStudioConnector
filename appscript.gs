var dataS = DataStudioApp.createCommunityConnector();

function getConfig(){
  var config = dataS.getConfig();
  
  return config.build();
}

function getFields(){
  var fields = dataS.getFields();
  var types = dataS.FieldType;
  var aggregations = dataS.AggregationType;
  
  fields
        .newDimension()
        .setId('analytics_campaign_name')
        .setName('Nome Campanha')
        .setType(types.TEXT);
  
  
  return fields;
}

function getSchema(request){
  var schema = {schema : getFields().build()};
  console.log(schema);
  return schema;
}

function getData(request){
 // request.configParams = validateConfig(request.configParams);
  console.log(request)
  var requestedFields = getFields()
  .forIds(request.fields.map(function(field)
   {
      return field.name;
   })
  )

try{
  console.log('Fetch Data Start');
  var apiResponse = fetchDataFromApi(request);
  var data = formatData(apiResponse, requestedFields);
}
catch(e){
   dataS.newUserError()
  .setDebugText('Error Fetching data from API. err: ' + e)
  .setText('Connector has ended whithout gettig the data.')
  .throwException();
}
return {
  schema: requestedFields.build(),
  rows: data,
};
}

function validateConfig(configParams) {
  configParams = configParams || {};
  configParams.userId = ConfigParams.userId || DEFAULT_USER;
  
  configParams.userId = configParams.userId
   .split(',')
   .map(function(x){
    return x.trim();
  })
  .join(',');
 
   return configParams;
}

function fetchDataFromApi(request){
  var url = '*******************************'
  var options = {
    headers:{
      'Api-token' : '*****************'
    }
  }
  var response = JSON.parse(UrlFetchApp.fetch(url, options));
  
//function formatData(response, requestedFields){
  console.log(typeof(response));
   var item = response.items.shift();
  var row = requestedFields.asArray().map(function(field){
    switch (field.getId()){
      case 'analytics_campaign_name':
        return item.analytics_campaign_name;
        
      default:
        return '';
    }
  });
  return [{values: row}];
}

























