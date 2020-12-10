import {Given, Then, When} from 'cucumber';
import { validate } from 'jsonschema';
import { expect } from 'chai';


Given('I am in TH site', async () => {
    return "Done";
});

Then('I pass parameters', async(table: any) => {
    console.log(table.rows());
});

When(/I inspect the (\w+) events/, async (event_type: number) => {
    console.log(event_type);

    let eventSchema = {
        "type" : "object",
        "properties" : {
            "account_id" : {"type" : "string"},
            "client_name" : {"type" : "string"},
            "client_version" : {"type" : "string"},
            "project_id" : {"type" : "string"},
            "revision" : {"type" : "string"},
            "visitors" : {"type" : "array", "properties" : {
                "visitor_id" : {"type" : "string"},
                "session_id" : {"type" : "string"}
            }}
        },
        "required" : ["account_id", "client_name", "project_id", "visitors"]
    }

    // let eventValidator = new Validator();
    // eventValidator.addSchema(eventSchema, '/landingEvent');

    let mock = await browser.mock('https://logx.optimizely.com/v1/events', {
        method: 'POST',
        statusCode: 204
    });

    mock.respond('Zero Events XXX');

    await browser.url("https://be.tommy.com");

    await browser.setupInterceptor();
    await browser.expectRequest('POST', 'https://logx.optimizely.com/v1/events', 204);
    await browser.pause(2000);

    await browser.assertExpectedRequestsOnly();

    let requests = await browser.getRequests();
    requests.filter(d=>{
        return d.url.includes("optimizely")
    }).map(d=>{
        console.log(validate(d.body, eventSchema));
        expect(validate(d.body, eventSchema).valid, "Uh oh! schema violation!").to.be.true;
    });

    let title = await browser.getTitle();
    console.log(title);

    return "Done";
});

Then('I see an event with a valid schema', async () => {
    return "Done";
});