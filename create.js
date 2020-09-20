import * as uuid from "uuid";
import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export function main(event, context, callback) {
    // Request body is passed in as a JSON encoded string in 'event.body'
    const data = JSON.parse(event.body); // parse the content of request from request body

    const params = {
        TableName: process.env.tableName,  // from serverless.yml
        Item: {
            userId: event.requestContext.identity.cognitoIdentityId, // get the user identity from the request
            noteId: uuid.v1(), // generage a uniq uuid
            content: data.content, //  content of note
            attachment: data.attachment, // URL of attachment object
            createdAt: Date.now() // current timestamp
        }
    };

    // Creates a new item, or replaces an old item with a new item by delegating to AWS.DynamoDB.putItem().
    // takes two argument, params is the input, callback is the handler for result
    dynamoDb.put(params, (error, _) => {
        // Set response headers to enable CORS (Cross-Origin Resource Sharing)
        const headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
        };

        // Return status code 500 on error
        if (error) {
            const response = {
                statusCode: 500,
                headers: headers,
                body: JSON.stringify({ status: false })
            };
            callback(null, response);
            return;
        }

        // Return status code 200 and the newly created item
        const response = {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify(params.Item)
        };
        callback(null, response);
    });
}