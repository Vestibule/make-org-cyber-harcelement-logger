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