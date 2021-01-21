window.onload = () => {
    const host = 'http://127.0.0.1:2021';

    const auth = {
        name: '',
        pass: '',
    };

    let roomList = [];

    const client = {
        get: async url => {
            let res = await fetch(`${host}${url}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${btoa(auth.name + ':' + auth.pass)}`,
                },
            });
            res = await res.json();
            if (res.success) {
                return res.data;
            } else {
                throw res.err;
            }
        },
        post: async (url, data) => {
            data = new URLSearchParams(data);
            let res = await fetch(`${host}${url}`, {
                method: 'POST',
                body: data.toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${btoa(auth.name + ':' + auth.pass)}`,
                },
            });
            res = await res.json();
            if (res.success) {
                return res.data;
            } else {
                throw res.err;
            }
        },
    };

    const socket = io(`${host}/room`);
    socket.on('connect', () => {
        const id = socket.id;

        socket.on(id, data  => {
            console.log(data);
        });

        setTimeout(() => {
            socket.emit('enter', 'hi');
        }, 1000);
    });

    const api = {
        passportLogin: async (name, password) => {
            const res = await client.post('/passport/login', {
                name, password,
            });
            auth.name = res.id;
            auth.pass = res.token;
            return res;
        },
        passportRegister: async (name, password) => {
            const res = await client.post('/passport/register', {
                name, password,
            });
            auth.name = res.id;
            auth.pass = res.token;
            return res;
        },
        userInfo: async () => {
            return client.get('/user/info');
        },
        roomList: async () => {
            const list = await client.get('/room/list');
            roomList = list;
            return list;
        },
        roomCreate: async (name, password, size) => {
            return client.post('/room/create', {
                name,
                password,
                size,
            });
        },
        roomJoin: async (index, password) => {
            return client.post('/room/join', {
                roomId: roomList[index].id,
                password,
            });
        },
        roomLeave: async (index, force) => {
            return client.post('/room/leave', {
                roomId: roomList[index].id,
                force,
            });
        },
    };

    window.tools = {
        client,
        api,
    };
};