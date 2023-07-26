interface Message {
    fansLevel: number;
    isAdmin: boolean;
    isFans: 0 | 1;
    msg_content: string;
    nickName: string;
    userID: string | number;
}

interface Music {
    musicSrc: string;
    song: string;
}

type Info = Message & Music;

interface W extends Window {
    electronAPI?: any;
    chat?: any;
    message?: any;
    status?: any;
}
