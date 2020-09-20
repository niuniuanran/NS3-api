import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {

    const params = {
        TableName: process.env.tableName,
        KeyConditionExpression: "userId = :userId",
        // 'KeyConditionExpression' defines the condition for the query
        // - 'userId = :userId': only return items with matching 'userId' partition key

        // 'ExpressionAttributeValues' defines the value in the condition
        ExpressionAttributeValues: {
            // - ':userId': defines 'userId' to be Identity Pool identity id of the authenticated user
            ":userId": event.requestContext.identity.cognitoIdentityId
        }
    };

    const result = await dynamoDb.query(params);
    if ( ! result.Items) {
        throw new Error("User not found.");
    }

    // Return the retrieved item
    return result.Items;
});