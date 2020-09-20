/**
 * We are creating a handler function that we’ll use as a wrapper around our Lambda functions.
*/

export default function handler(lambda) { // It takes our Lambda function as the argument.
    return async function (event, context) {   // We return an asyn function that runs the Lambda function in a try/catch block.
        let body, statusCode;

        // On success, we JSON.stringify the result and return it with a 200 status code.
        // If there is an error then we return the error message with a 500 status code.
        // This will help us avoid writing this kind of logic in each of the lambda handler.
        try {
            // Run the Lambda
            body = await lambda(event, context);
            statusCode = 200;
        } catch (e) {
            body = { error: e.message };
            statusCode = 500;
        }

        // Return HTTP response
        return {
            statusCode,
            body: JSON.stringify(body),
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
        };
    };
}