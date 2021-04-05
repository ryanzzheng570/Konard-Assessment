## kGmail
In this assignment you'll be working on a lightweight Gmail clone called kGmail. Most of Gmail's features haven't been implemented but kGmail will let users load their inbox, filter it by label and assign labels to messages. kGmail integrates with the Gmail API so you'll need a Gmail account to sign in.

To launch kGmail run:
 - `npm install`
 - `npm start`

## Tasks

### Select All Checkbox
Implement the select all messages checkbox.

**Acceptance Criteria**
 - When no messages are selected the "select all" checkbox is unchecked. Clicking it will select all messages.
 - When some messages are selected the "select all" checkbox shows it's indeterminate state. Clicking it will deselect all messages.
 - When all messages are selected the "select all" is checkbox is checked. Clicking it will deselect all messages.

kGmal uses a custom checkbox component that supports indeterminate state. It works the same as `<input type="checkbox">` except that you can pass `undefined` to the `checked` attribute to show an indeterminate state.

```HTML
<Checkbox checked={true}/> Checked
<Checkbox checked={undefined}/> Indeterminate
<Checkbox checked={false}/> Unchecked
```

The select all checkbox can be found in `src/components/messages/messages.js`. Try to implement this feature without storing any derived state.

### Load Messages

In `src/util/messageUtil.js` the `getMessagesForLabels(labelIds)` function is called when the app first starts and whenever the selected labels change. This function is responsible for returning all of the messages to show in the list of messages.

**Acceptance Criteria**
 - When `labelIds` is empty (no labels are selected), `getMessagesForLabels()` should return a promise that resolves with the most recent messages.
 - When `labelIds` is not empty, `getMessagesForLabels()` should load the most recent messages for each label in `labelIds` and use `MessageUtil._combineSortedMessages()` to merge them into a single list. A promise should be returned that resolves with the merged list of messages. 

 Currently this function ignores `labelIds` and always retrieves the most recent messages using `googleApi.getMessages()`. You can use `googleApi.getMessages([labelId])` to load messages for a specific label. `labelId` will be forwarded along to this gmail API: 

 [developers.google.com/gmail/api/v1/reference/users/messages/list](https://developers.google.com/gmail/api/v1/reference/users/messages/list#javascript)

Note: This function should return all messages that have at least one of the selected labels. So be careful with `googleApi.getMessages()`'s `labelIds` parameter as this is not exactly what it does. Also try to implement this without changing the signature for `_combineSortedMessages()`.

 ### Merge Messages

In `src/util/messageUtil.js` implement `_combineSortedMessages(messagesA, messagesB)`.

**Acceptance Criteria**
 - Given two sorted lists of messages, return a single list containing all unique messages from the input lists.
 - The returned list of messages should be sorted from newest message to oldest.

**Example**
```javascript
let messagesA = [
  {id: 'a', internalDate: '1527831809002', ...},
  {id: 'b', internalDate: '1527831809001', ...}
];

let messagesB = [
  {id: 'c', internalDate: '1527831809003', ...},
  {id: 'b', internalDate: '1527831809001', ...}
];

_combineSortedMessages(messagesA, messagesB) === [
  {id: 'c', internalDate: '1527831809003', ...},
  {id: 'a', internalDate: '1527831809002', ...},
  {id: 'b', internalDate: '1527831809001', ...}
]
```

Try to implement this function with a O(n) algorithm. In other words try not to iterate over the items in the input arrays more than a fixed number of times. Sorting is a O(n log n) so avoid it if possible.

### Unit Test

Add unit tests to `src/util/messageUtil.test.js` for the `messageUtil._combineSortedMessages()` function. Make sure to cover the basic functionality of `messageUtil._combineSortedMessages()` as well as any edge cases you think of.

You can run the unit tests by running `npm run test` and then pressing `a`. The unit tests are written in [Jest](https://facebook.github.io/jest/docs/en/getting-started.html).

### Modal CSS

Clicking the "New Label" button will open the new label modal however it has not been styled yet. Modify `src/components/labelModal/labelModal.css` and `src/components/labelModal.js` to make the modal look like:
![label modal](./assets/readme/new-label-modal.png)

Try to follow the naming convention for class names used elsewhere in the app (BEM) and don't worry about being pixel perfect.

### Integrate Google API
To edit the labels on a group of messages users should be able to: select messages -> click the label dropdown -> select/deselect labels -> click apply.

Clicking apply in the label dropdown will call `labelDropdown.applyLabels()` which you will need to implement.

**Acceptance Criteria**
 - When the user clicks apply in the label dropdown
   - each selected label should be added to each message passed into `<LabelDropdown/>`
   - each unselected label should be removed from each message passed into `<LabelDropdown/>`
   - After labels have finished being updated call `this.props.submit()` to close the dropdown

You will need to add a new API integration to the following endpoint to implement this feature: [developers.google.com/gmail/api/v1/reference/users/messages/modify](https://developers.google.com/gmail/api/v1/reference/users/messages/modify#javascript). It is not covered very well in the docs but you can treat the return value from a call to `gapi` as a `Promise` instead of calling `.execute()`.

### Message Count

Add a "message count" beside each label in the left panel that specifies how many messages in the message list contain that label. For example if the message list is currently showing the following messages:

```javascript
[
  {subject: 'lorem', labels: ['label1', 'label2']},
  {subject: 'ipsum', labels: ['label2']},
  {subject: 'dolor', labels: ['label2', 'label4']}
]
```

then the left panel would look something like

```
▢ Label 1 (1)
▢ Label 2 (3)
▢ Label 3 (0)
▢ Label 4 (1)
```

The design and implementation is up to you. 

### Other

In the Notes section of readme.md let us know if you fixed any bugs, cleaned up any code, or added any features not covered by the previous tasks.


## Notes

Add any notes you have here
