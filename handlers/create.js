import aws from 'aws-sdk';
import { respond, getAdjustedTimestamp } from '../util/util';

const dynamoClient = new aws.DynamoDB.DocumentClient();

export const handler = async (event, context) => {
    let { linkNotes, attachment, questions, topic } = JSON.parse(event.body);
    topic = topic || "default";
    //date without adjusting return UTC time, must adjust for tz difference
    const timestamp = getAdjustedTimestamp();
    const params = {
        TableName: process.env.TableName,
        Item: {
            userId: event.requestContext.identity.cognitoIdentityId,
            linkId: `${topic}#${timestamp}`,
            linkNotes,
            attachment,
            questions,
            modificationDate: timestamp,
            topic
        },
    };
    try {
        //call returns empty object on successful case
        await dynamoClient.put(params).promise();
        return respond(200, params.Item );
    } catch (e) {
        return respond(500, { error: e.message });
    }
};

