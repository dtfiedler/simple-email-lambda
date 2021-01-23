## DESCRIPTION
Simple email lambda that can send emails via Amazon SES. 

### Input:
```
{
    "user": {
        "name": "<first-name>",
        "email": "<email-address>"
    },
    "subject": "<subject>",
    "html": "<h1>Forgot Password Request</h1><br><span>Hi ${user.name},</span><br><br>Click <a href='google.com'>here</a> to reset your password. If you did not request a link to reset your password, please click <a href='google.com'>here</a>.<br><br><h3>The ABC Team</h3>"
}
```

The html section parses any inputs defined in the event object with `%{}` notation. (e.g. in this example `${user.name}` is replaced with the `user.name` of the input.);

## NOTES

Before running `npm run package` make sure you run `apt-get install zip`.
Deploy function requires `awscli` installed (using `pip install awscli`) and IAM user credentials configured (using `aws configure`).
