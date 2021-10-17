# How does it work?
- Set environment variables: AWS credentials (`textractClient.ts`), Postgres DB credentials (`app.module.ts`), server address (in Android app)
- Launch the server (with Serverless, EC2...) with: `yarn start:dev`
- Launch the app on an Android phone (using Android Studio for instance). 
The app will intercept any notification and send it to the server. You can also share screenshots through the app


# App
cf [README.md](./app/README.md) in ./app

# Server
We're using:
- Nest as a server framework;
- Postgres for the database
- TypeORM for the ORM

Every notification received will be analyzed by Bodyguard API (since 
we do not have the API key, we've made a simple mock of it). It is then
saved to the database.

Every screenshot received will be processed by AWS Textract. A custom post-
processing is done to divide sender and receiver messages. Every message is
sent to Bodyguard's API. If any of them is classified as `HATEFUL`, the screenshot
is saved (not done).

# Next steps
- AWS Textract pricing is 0.0015$/file. It is actually quite easy to
locate and extract text from an image using any open-source library (such as Tesseract).
- The credentials (AWS RDS, AWS Textract) and the server host address which were commited in a hurry should be replaced
by environment variables (the AWS RDS & AWS EC2 used for demo will be shut down).
- Notifications treatment should be improved, since many cases will make
the service fail: many notifications from one or many senders for example
- iOS app was not made. In addition, iOS does not allow to intercept other app's notifications. Hence,
only the screenshot feature will work
- Screenshot should be saved with more information in a safe place.
