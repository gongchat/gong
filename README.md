# Gong

Gong is a Electron + React XMPP Client. Currently under development and is in pre-alpha.

## Running the Application

### Node

1.  `xmpp.js@0.6.1` requires node 10.13.0+. I have tried versions 10.0.0 and 11.5.0 and was unable to run the project.

### Keytar

This application uses Keytar to encrypt and decrypt your password. A key is generated and saved to your operating systems password manager. The encrypted
password is saved along with your settings in the `config.json` file.

If you are having issues with Keytar follow the steps below. See this github [issue](https://github.com/atom/node-keytar/issues/51) for more info.
_I am using electron 3, node 10.13.0, and Windows 10_

1. run `npm install`
2. run `.\node_modules\.bin\electron-rebuild`
3. run `npm start`

## Building the Application

1. Run `npm run build`
2. Run `npm run dist`
   1. If you get a `Error: Chunk.entrypoints: Use Chunks.addGroup instead` you may have to run `npm install -G extract-text-webpack-plugin@next`. See this github [issue](https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/701#issuecomment-398103246) for more info.
   2. If you get a `...\app.asar: The process cannot access the file because it is being used by another process.` Close any IDEs that have this project open and run the command from terminal. See this github [issue](https://github.com/electron-userland/electron-builder/issues/3666) for more info.

## TODO

Loosely ordered in priority from top down

[ ] Put TODO into Trello
[x] Remember scroll positions and keep it at bottom when current is active
[x] Notifications/Badges within App
[x] Emojis on :
[x] User listing on @
[x] Theme customization
[x] Font customization
[x] Fix reconnecting bug, not completely fixed, new item at bottom of list
[x] Detect when users leave room
[x] Add way to sign off
[x] Add a section for direct messages
[x] Add way to change current users status
[x] Embedded videos
[x] Better handling of links
[x] Timestamp messages
[x] Put dates whenever there is a new one
[x] Send unsubscribe when channel is removed
[x] Format new lines correctly
[x] Form validation and user input sanitization
[x] Get VCards
[x] Add my photo/avatar
[x] Fix sending messages to self (possibly fixed itself or I am just unable to replicate, need to research more)
[x] Handle errors on login
[x] Highlight when you are called out
[x] Flashing badge on messages with you called out
[x] Move all logic into separate files to make the move to Context, Hooks, and react-governor easier
[x] Split audio settings for groupchat and chat
[x] On discover make items scrollable (form is picking up larger height)
[x] Make channel users scrollable
[x] Remove hashtags in channel name (only if first character)
[x] Fix mentions with symbols right after (examples: . ! ?)
[x] add a total unread message next to the groupname
[x] Really long text without breaks causes right sidebar to shrink
[x] Scroll when emoji and user drop downs when navigating items using arrow keys
[x] Sort channels alphabetically

[ ] Handle connection errors (need better support for when auto login fails, like a retry button or auto retry every x seconds)
  start on loading page
  if hasSavedCredentials and !isAuthenticated but { error: 'Cannot authorize your credentials' } then wipe credentials and go to login page
  if hasSavedCredentials and !isAuthenticated but any connection error then go to reconnecting page
  if hasSavedCredentials and !isAuthenticated and successfully connects go to main page
  if hasSavedCredentials and isAuthenticated disable input
  if !hasSavedCredentials go to login page

[ ] Bad recognition of users with spaces in their name
[ ] Does not recognize user mentions if it ends with it
[ ] Handle message errors and acknowledgment
[ ] Add way to customize the base spacing unit in the settings
[ ] Add setting to flash chat when you get a message
[ ] The default font value of 15 does not represent the default material ui font sizes for some of the elements
[ ] Better styling on badges, something that is more dynamic
[ ] Better styling on input (sometimes there is a weird dot at the start that blinks and text gets cut off)
[ ] Customization of text colors is not represented across all elements
[ ] Use timestamp to identify if historical messages have been read
[ ] Statuses get weird if there are multiple connections for a single user
[ ] Add option to show users without avatar in both left and right sidebar
[ ] Add a new element that specifies at what point in the listing of messages where the new messages begin
[ ] Add a way to specify a port on login
[ ] Allow navigation of chat with ctrl page up and page down
[ ] React-player with video controls
[ ] Cannot resize window from top edge

[ ] Change nick on /nick
[ ] Add way to change nickname on an added channel
[ ] Format messages with /me

[ ] Notifications outside App
[ ] After x min of inactivity set status to away
[ ] Notify user on both ends when someone is typing

[ ] Figure out why streams aren't closing properly (currently fixed with a bit of a hack, need to look into it some more)
[ ] PropTypes on all components
[ ] Move to Context and Hooks and refactor code

Alpha

[ ] Keep logs of messages
[ ] Make rooms sortable
[ ] Include options for a compact and cozy layout (compact is the current)
[ ] Select colors for theme with hex code
[ ] Scheduled messages
[ ] Virtualize messages when there is a large number of them
[ ] Link previews (still debating whether I want to do this)

Beta

[ ] Make sure customization options do not causes bad spacing
[ ] Performance

[ ] Get auto updater working
[ ] Put together a website to download etc

Release