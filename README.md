# Description


# App

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