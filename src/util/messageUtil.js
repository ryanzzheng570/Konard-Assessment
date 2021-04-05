import googleApi from "./googleApi";

class MessageUtil {
    /**
     * @param labelIds - array of label IDs
     * @returns a Promise that resolves with a list of the most recent messages that contain at least one of the labels
     * in `labelIds`. If `labelIds` is empty then the resulting array will contain the most recent messages.
     */
    getMessagesForLabels(labelIds) {
        //Base condition where if labelIds is empty then return the most recent messages
        if(labelIds.length === 0) {
            return googleApi.getMessages();
        }
        else {
            return googleApi.getMessages(labelIds);
        }

    }

    /**
     * Takes two sorted lists of messages and merges them together. The input and output arrays are sorted from the
     * newest message to the oldest message. If both input arrays contain the same message then the resulting array will
     * only contain one copy of it.
     *
     * @example
     * let messagesA = [
     *   {id: 'a', internalDate: '1527831809002', ...},
     *   {id: 'b', internalDate: '1527831809001', ...}
     * ];
     *
     * let messagesB = [
     *   {id: 'c', internalDate: '1527831809003', ...},
     *   {id: 'b', internalDate: '1527831809001', ...}
     * ];
     *
     * _combineSortedMessages(messagesA, messagesB) === [
     *   {id: 'c', internalDate: '1527831809003', ...},
     *   {id: 'a', internalDate: '1527831809002', ...},
     *   {id: 'b', internalDate: '1527831809001', ...}
     * ]
     */

     //Only works for a specific case
    _combineSortedMessages(messagesA, messagesB) {
        var sortedArray = [], indexA = 0, indexB = 0;
        while(indexA < messagesA.length && indexB < messagesB.length) {
            if(this.sortHelperFunction(messagesA[indexA], messagesB[indexB]) > 0) {
                sortedArray.push(messagesB[indexB++]);
            }
            else {
                sortedArray.push(messagesA[indexA++]);
            }
        }
        
        if(indexA < messagesA.length) {
            sortedArray = sortedArray.concat(messagesA.slice(indexA));
        }
        else {
            console.log(indexA);
            sortedArray = sortedArray.concat(messagesB.slice(indexB));
        }

        return sortedArray;
    }

    sortHelperFunction(indexA, indexB) {
        return indexB.internalDate - indexA.internalDate;
    }
}

export default new MessageUtil();