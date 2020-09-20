import AWS from "aws-sdk";

// reuse this client instead of having to create a new client within each handler.
const client = new AWS.DynamoDB.DocumentClient();

// We want to make our Lambda function async, and simply return the results. Without having to call the callback method.
export default {
    get   : (params) => client.get(params).promise(),
    put   : (params) => client.put(params).promise(),
    query : (params) => client.query(params).promise(),
    update: (params) => client.update(params).promise(),
    delete: (params) => client.delete(params).promise(),
};