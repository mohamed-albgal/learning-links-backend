import aws from 'aws-sdk';
import { respond }  from '../util/util';

const dynamoClient = new aws.DynamoDB.DocumentClient();
export const handler = async (event, context) => {
    const { linkId } = JSON.parse(event.pathParameters);
    const params = {
        TableName: process.env.TableName,
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId,
            linkId,
        },
    };
    try{
        const result = await dynamoClient.get(params).promise();
        if (!result.Item) {
            throw new Error( `No item for ${linkId}`);
        }
        return respond(200,result.Item);
    }catch(e){
         return respond(500, e.message);
    }
};

