import * as uuid from 'uuid';
import aws from 'aws-sdk';
import { respond, getAdjustedTimestamp } from '../util/util';

const dynamoClient = new aws.DynamoDB.DocumentClient();

export const handler = async (event, context) => {
    let { linkNotes, goals, title, priority, attachment, questions, topic, sourceUrl } = JSON.parse(event.body);
    //date without adjusting return UTC time, must adjust for tz difference
    const timestamp = getAdjustedTimestamp();
    const params = {
        TableName: process.env.TableName,
        Item: {
            userId: event.requestContext.identity.cognitoIdentityId,
            linkId:  uuid.v1(),
            linkNotes,
            title,
            priority,
            goals,
            sourceUrl,
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

