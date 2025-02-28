interface ImapMessage {
    attributes: {
        date: string;
    };
    parts: Array<{
        which: string;
        body: string;
    }>;
    "x-gm-msgid": string;
}


export type {
  ImapMessage,
};
