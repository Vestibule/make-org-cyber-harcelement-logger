# Mon Allié Numérique mobile app  

This app was built for the Jan 2021 Nuit du Code Citoyen Hackathon with [make.org](http://make.org) 
and [e-enfance](https://www.e-enfance.org/).

It's doing 2 things:
- Listen to notifications to extract text from social apps conversations, and send them to our API
  to flag the ones that might contain harmful messages
- Register a share target so that screenshots can be sent to our API, which will extract textual
  content to also classify it.
  
The notification listening portion is based on
https://github.com/Chagall/notification-listener-service-example

- There isn't much UI at this point, but eventually it would be good to be able to fill the form to 
  build a harassment case from the device, by providing the info, adding screenshots, etc.
- When sharing an image, there is no confirmation, or UI to enter some annotation for the
  screenshot, we just send it to the backend.
- We forward notifications for only a few apps: Facebook, Facebook Messenger, Whatsapp, Instagram, 
  Google Chat. Even then, we didn't do much work to curate the messages for these apps. Using
  Android notification channels it would be possible to distinguish between the various types of
  notifications to only forward the ones we're interested in. This could be very brittle to changes
  in the targeted apps.
- We're relying on apps using the default messaging template on Android, they could choose to ignore
  some of it (e.g. Instagram and Whatsapp don't populate msg author fields) or totally use their
  own UI to render the notifications (Snapchat does that maybe?)
  
Overall, trying to monitor notifications this way works a bit, but it's brittle, unreliable, and
will require constant work to especially if we're trying to parse structured data out of the
notification