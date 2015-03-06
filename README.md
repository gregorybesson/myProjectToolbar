# myProjectToolbar
A Project Toolbar for your customers : They can comment and screenshot a page they test and a Jira ticket will be automagically created !

Tested succesfully on IE10+, FF, Chrome and Safari

## Usage
This project adds a toolbar at the bottom of a website. When the user click on "open a bug", an input box is open. The user can then enter the detail of his bug.
Then, a screenshot is taken and a php script is called via ajax which creates a ticket in your Jira project. In this ticket, the following informations are entered :
- The summary is what the user has entered
- A screenshot is attached to the ticket
- The detail is filled in with
   - the URL of the page 
   - the user-agent detail (including the browser and its version used to test)

If you want to use the toolbar on your sites you just have to add a js on your project :

     <script src="http://myToolbar.domain/toolbar/toolbar.js">
       var toolbarCode = "SANDBOX";
     </script>
	
The var toolbarCode is the JIRA project code for which you want to create a ticket.

Limitations : This project uses html2canvas.js library (http://html2canvas.hertzen.com/) which uses a canvas to create an image from the html page. As this is not 100% accurate, your screenshot is only a representation of what the user sees.

Another version could be based on a phantomJS screenshot but the result will not respect what the user sees neither...


TODO : 
- Create a bookmarklet from this project so that you don't have to change the code of your project.
- Create a Chrome plugin so that the users can screenshot high fidelity screens and comment them.


