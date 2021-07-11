import aws from 'aws-sdk';
import respond from '../util/httpResponse';

const dynamoClient = new aws.DynamoDB.DocumentClient();

export const handler = async (event, context) =>  {
    const data = JSON.parse(event.body);
    const { linkId } = JSON.parse(event.pathParameters);
    const { userId } = data;
    const attributes = { ":ln" : "linkNotes", ":qs": "questions", ":at": "attachment"};
    const [expressionString, attributeValues] = getExpressionInfo(data,attributes);

    const params = {
        TableName: process.env.TableName,
        Key: {
            userId,
            linkId
        },
        UpdateExpression: expressionString,
        ExpressionAttributeValues: attributeValues,
        ReturnValues: "UPDATED_NEW",
        //add a condition to ensure not already equal, to save on write costs (? confirm)
        // ReturnValues: "ALL_NEW",
    };

    try {
        if (!userId){
            throw new Error("UserId not present in request body");
        }
        const result = await dynamoClient.update(params).promise();
        return respond(200, result.Attributes);
    }catch (e){
        return respond(500, { error: e.message});
    }

};

//only want to update the keys indicated in the request body
const getExpressionInfo = (requestBody, attributes) => {
    let expressions = [];
    let expressionValues = {};
    //for any property that is in the body, add it to the expression to update
    // and translate the mapping to the value from the request
    for (let [ abbrev, property ]  of Object.entries(attributes)) {
        if (requestBody.hasOwnProperty(property)){
            expressions.push(`${property} = ${abbrev}`);
            expressionValues[abbrev] = requestBody[property];
        }
    }
    const expressionString =  "Set " + expressions.join(", ");
    return [expressionString, expressionValues];
};


/**
 * expression string must be like: "Set content=:c, imageUrl=:i"
 * then map the expression's values to their actual values like: { ":c" : "Some content", ":i" : "some url"}
 * note the values come from the http request.
 * the issue i was having was only needing to partially update an item's attributes (instead of all of its attributes)
 * i needed to see what was in the req body vs what _could_ be updated and get that intersection to avoid updating things to null!
 */