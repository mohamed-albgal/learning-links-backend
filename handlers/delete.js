import aws from 'aws-sdk';
import respond from '../util/httpResponse';

const dynamoClient = new aws.DynamoDB.DocumentClient();


export const handler = async (event, context) => {
    //the primary key is the hash key and range key
    //get the hash key from the body and range key from the path parameters
    const { linkId } = JSON.parse(event.pathParameters);
    const { userId } = JSON.parse(event.body);
    const params = {
        TableName: process.env.TableName,
        Key:{
            linkId,
            userId
        },
    };
    try {
        if (!userId){
            throw new Error("No userID in request body");
        }
        await dynamoClient.delete(params).promise();
        return respond(200);
    }catch (e) {
        return respond(500, {error: e.message});
    }
};