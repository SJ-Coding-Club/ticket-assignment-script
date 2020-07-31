// This script reads the user's response, and based on the platform they have
// issues with, it will choose the appropriate club member to notify.
// It is activated immediately whenever someone makes a submission.


// function that activates upon form submission
function notifyOnSubmission() {
  
    var form = FormApp.openById("Redacted");
    
    // get response that was just submitted.
    var mostRecentResponse = form.getResponses().pop();
    
    // access the boxes the user filled out - They're indexed in the order they appear
    var itemResponses = mostRecentResponse.getItemResponses(); // -> ItemResponse[]
    
    var responseObject = {
      name : itemResponses[0].getResponse(),
      email : itemResponses[1].getResponse(),
      platform : itemResponses[2].getResponse(),
      issue : itemResponses[3].getResponse(),
    };
    
    Logger.log(responseObject);  
    
    var memberAssigned = getMemberToSendTo(responseObject);
    var emailBody = 
    `
    New Support Ticket From ${responseObject.name} \n
    Platform: ${responseObject.platform}\n
    Issue: ${responseObject.issue}
    `;
    GmailApp.sendEmail(memberAssigned.email, `New Support Ticket From ${responseObject.name}`, emailBody);
    Logger.log("Sent to " + memberAssigned.email);
  }
  
  // This function determines who the task will be assigned to
  function getMemberToSendTo(responseObject) {
    var rawresponse = responseObject["platform"].concat(responseObject["issue"]);
    
    // current values are just for proof-of-concept - I'll probably store them in a json later
    var members =
        {
          "Jack" :
          { 
            name: "Jack Donofrio",
            email : "Redacted@gmail.com",
            preferred : 
            [
              "portals",
              "classroom"
            ]
          },
          "Samir" :
          {
            name: "Samir Rajani",
            email : "Redacted@gmail.com", // not real
            preferred : 
            [
              "quizlet",
              "kahoot"
            ]
          }
        }
    // match issue with member
    for (var member in members) {
      var pref = members[member].preferred;
      for (var i in pref) {
        if (contains(rawresponse, pref[i])) {
          return members[member];
        }
      }
    }
    // otherwise just send to me
    return members.Jack;
  }
  
  // returns a contains b regardless of case
  function contains(str, substr) {
    return str.toUpperCase().indexOf(substr.toUpperCase()) > -1;
  }