//API documented at https://developers.google.com/gmail/api/v1/reference/
class GoogleApi {
    init() {
        this.loaded = new Promise((resolve) => {
            let initClient = () => {
                window.gapi.client.init({
                    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'],
                    clientId: '698209336656-gog4ck5rei3n7472a3o1r5kfvkh5h392.apps.googleusercontent.com',
                    scope: 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.labels https://www.googleapis.com/auth/gmail.modify'
                })
                .then(() => resolve());
            };

            window.gapi.load('client:auth2', initClient);
        });
    }

    //listener will be called with boolean indication whether the user is logged in when the login status changes
    registerLoginStatusListener(listener) {
        window.gapi.auth2.getAuthInstance().isSignedIn.listen(listener);
        listener(window.gapi.auth2.getAuthInstance().isSignedIn.get());
    }

    getLabels() {
        const NAME_OVERRIDES = {
            CATEGORY_FORUMS: 'Forums',
            CATEGORY_PERSONAL: 'Personal',
            CATEGORY_SOCIAL: 'Social',
            IMPORTANT: 'Important',
            CATEGORY_UPDATES: 'Updates',
            CHAT: 'Chat',
            SENT: 'Sent',
            INBOX: 'Inbox',
            TRASH: 'Trash',
            CATEGORY_PROMOTIONS: 'Promotions',
            DRAFT: 'Draft',
            SPAM: 'Spam',
            STARRED: 'Starred',
            UNREAD: 'Unread'
        };

        return window.gapi.client.gmail.users.labels.list({userId: 'me'})
            .then(res => res.result.labels)
            .then(labels => labels.map(label => {
                label.name = NAME_OVERRIDES[label.id] || label.name;
                return label;
            }));
    }

    getMessageSummaries(labelIds = []) {
        return window.gapi.client.gmail.users.messages.list({userId: 'me', maxResults: 40, labelIds: labelIds})
            .then(res => res.result.messages || []);
    }

    getMessage(messageId) {
        return window.gapi.client.gmail.users.messages.get({userId: 'me', id: messageId})
            .then((res) => {
                let message = res.result;
                message.headerMap = {};
                message.payload.headers.forEach(header => {
                    message.headerMap[header.name] = header.value;
                });

                return message;
            });
    }

    /**
     * Retrieves messages that contain all of the supplied labelIds
     * @param labelIds - array of label IDs
     * @returns a promise that resolves with the matching messages. The message model is documented here:
     * https://developers.google.com/gmail/api/v1/reference/users/messages
     */
    getMessages(labelIds = []) {
        return this.getMessageSummaries(labelIds)
            .then(messageSummaries => {
                return Promise.all(
                    messageSummaries.map(summary => this.getMessage(summary.id))
                );
            });
    }

    createLabel(labelName) {
        return window.gapi.client.gmail.users.labels.create({
            userId: 'me',
            resource: {
                name: labelName,
                labelListVisibility: 'labelShow',
                messageListVisibility: 'show'
            }
        });
    }

    signIn() {
        window.gapi.auth2.getAuthInstance().signIn();
    }

    signOut() {
        window.gapi.auth2.getAuthInstance().signOut();
    }

}

export default new GoogleApi();