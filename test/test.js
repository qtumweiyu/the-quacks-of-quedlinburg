window.onload = () => {
    const host = 'http://127.0.0.1:2021';

    const socket = io(`${host}/room`);
    socket.on('connect', () => {
        const id = socket.id;

        socket.on(id, data => {
            console.log(id, data);
            handleData(data);
        });

        socket.on('broadcast', data => {
            console.log('broadcast', data);
            handleData(data);
        });
    });

    const handleData = data => {
        const { type, payload } = data;
        switch (type) {
            case 'passport':
                handlePassport(payload);
                break;
            case 'state':
                handleState(payload);
                break;
            case 'alert':
                alert(payload.message);
                break;
            default:
                alert(`unknown type: ${type}`);
        }
    };

    const handlePassport = user => {
        if (user === null) {
            window.localStorage.removeItem('id');
            login();
        } else {
            window.localStorage.setItem('id', user.id);
            if (user.room) {
                handleState(user.room);
            }
        }
    };

    const handleState = state => {
        console.log('state', state);
    };

    const login = () => {
        const id = window.localStorage.getItem('id');
        if (id) {
            socket.emit('login', { id });
        } else {
            let name = window.localStorage.getItem('name');
            if (!name) {
                name = prompt('请输入一个名字');
                window.localStorage.setItem('name', name);
            }
            socket.emit('login', { name });
        }
    };

    const createRoom = size => {
        socket.emit('create', { size });
    };

    const joinRoom = password => {
        socket.emit('join', { password });
    };

    const leaveRoom = () => {
        socket.emit('leave');
    };

    const readyGame = () => {
        socket.emit('ready');
    };

    setTimeout(() => {
        login();
    }, 1000);

    window.api = {
        login,
        createRoom,
        joinRoom,
        leaveRoom,
        readyGame,
    };
};