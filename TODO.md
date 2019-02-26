# TODO

Loosely ordered in priority from top down

- [ ] Put TODO into trello
- [x] Remember scroll positions and keep it at bottom when current is active
- [x] Notifications/Badges within App
- [x] Emojis on :
- [x] User listing on @
- [x] Theme customization
- [x] Font customization
- [x] Fix reconnecting bug, not completely fixed, new item at bottom of list
- [x] Detect when users leave room
- [x] Add way to sign off
- [x] Add a section for direct messages
- [x] Add way to change current users status
- [x] Embedded videos
- [x] Better handling of links
- [x] Timestamp messages
- [x] Put dates whenever there is a new one
- [x] Send unsubscribe when channel is removed
- [x] Format new lines correctly
- [x] Form validation and user input sanitization
- [x] Get VCards
- [x] Add my photo/avatar
- [x] Fix sending messages to self (possibly fixed itself or I am just unable to replicate, need to research more)
- [x] Handle errors on login
- [x] Highlight when you are called out
- [x] Flashing badge on messages with you called out
- [x] Move all logic into separate files to make the move to Context, Hooks, and react-governor easier
- [x] Split audio settings for groupchat and chat
- [x] On discover make items scrollable (form is picking up larger height)
- [x] Make channel users scrollable
- [x] Remove hashtags in channel name (only if first character)
- [x] Fix mentions with symbols right after (examples: . ! ?)
- [x] add a total unread message next to the groupname
- [x] Really long text without breaks causes right sidebar to shrink
- [x] Scroll when emoji and user drop downs when navigating items using arrow keys
- [x] Sort channels alphabetically
- [x] Does not recognize user mentions if it ends with it
- [x] Bad recognition of users with spaces in their name
- [x] React-player with video controls
- [x] Statuses get weird if there are multiple connections for a single user
- [x] Handle connection errors (need better support for when auto login fails, like a retry button or auto retry every x seconds)
- [x] Audio doesn't work in production
- [x] Customization of text colors is not represented across all elements
- [x] Add a way to add rooms that are not publicly visible
- [x] Add support for joining rooms that require a password
- [x] Add way to customize the base spacing unit in the settings
- [x] Add option to show users without avatar in both left and right sidebar
- [x] Better styling on badges, something that is more dynamic
- [x] Sliders for all number inputs
- [x] Add support for getyarn links
- [x] Add support for images links
- [x] Add settings to disable media content for video, getyarn and image links
- [x] Add setting to flash chat when you get a message
- [x] Reduce top and bottom spacing on user cards if there is not avatar being displayed

- [ ] Add status on channels and show if password has failed
- [ ] Allow navigation of chat with ctrl page up and page down
- [ ] Add a way to specify a port on login
- [ ] The default font value of 15 does not represent the default material ui font sizes for some of the elements
- [ ] Toggling avatars causes other styles to change (maybe font size and related to task above or spacing)
- [ ] Handle message errors and acknowledgment
- [ ] Cannot resize window from top edge
- [ ] Show selected color in theme customization

- [ ] Better styling on input (sometimes there is a weird dot at the start that blinks and text gets cut off)

- [ ] Change nick on /nick
- [ ] Add way to change nickname on an added channel
- [ ] Format messages with /me

- [ ] Add a new element that specifies at what point in the listing of messages where the new messages begin
- [ ] Have setting to load application on startup
- [ ] Notifications outside App
- [ ] After x min of inactivity set status to away
- [ ] Notify user on both ends when someone is typing
- [ ] Use timestamp to identify if historical messages have been read
- [ ] Encrypted channel passwords (not high priority, pidgin doesn't encrypt any passwords)

- [ ] Figure out why streams aren't closing properly (currently fixed with a bit of a hack, need to look into it some more)
- [ ] PropTypes on all components
- [ ] Move to Context and Hooks and refactor code

Alpha

- [ ] Keep logs of messages
- [ ] Make rooms sortable
- [ ] Include options for a compact and cozy layout for the messages. compact is the current and cozy would include avatars
- [ ] Show a users connections in user details
- [ ] Select colors for theme with hex code
- [ ] Scheduled messages
- [ ] Virtualize messages when there is a large number of them
- [ ] Link previews (still debating whether I want to do this)

Beta

- [ ] Make sure customization options do not causes bad spacing
- [ ] Performance

- [ ] Get auto updater working
- [ ] Put together a website to download etc

- [ ] Tests

Release
