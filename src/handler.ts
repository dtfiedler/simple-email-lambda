import * as aws from 'aws-sdk';
import * as _ from 'lodash';
import { createCustomLogger } from './logger';
import { LOG_LEVEL } from './utils';
import sanitizeHtml from 'sanitize-html';

const sesClient = new aws.SES({
  region: process.env.AWS_REGION || 'us-west-2',
});

export const handler = async (event, context) => {
    const logger = createCustomLogger('send-email-handler');
    logger.log(LOG_LEVEL.INFO, `Received event: ${JSON.stringify(event)}`);
    const htmlString = parseAndSanitizeHTML(event, event.html);
    const params: aws.SES.SendEmailRequest = {
        Destination: {
        ToAddresses: [event.user.email],
        },
        Message: {
        Body: {
            Html: {
                Data: htmlString
            }
        },

        Subject: { Data: event.subject },
        },
        Source: process.env.SOURCE_EMAIL,
    };

    try {
        await sesClient.sendEmail(params).promise();
        logger.log(LOG_LEVEL.INFO, 'Successfully sent email.', context);
    } catch (e) {
        logger.log(LOG_LEVEL.ERROR, `Failed to send email: ${e}`);
        throw e;
    }
};


export const parseAndSanitizeHTML = (event: any, html: string) => {
    const result = html.replace(/\$\{([^}]+)\}/g, (match, index, og) => {
        const attribute = match.replace('$', '').replace('{', '').replace('}', '');
        return _.get(event, attribute);
    });
    return sanitizeHtml(result);
}
