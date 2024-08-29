const WebSocket = require('ws');
const axios = require('axios');

// 포트 8081에서 웹소켓 서버를 설정합니다.
const wss = new WebSocket.Server({ port: 8081 });

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', async (message) => {
        console.log('Received:', message);

        const messageText = message.toString();

        let parsedMessage;
        try {
            parsedMessage = JSON.parse(messageText);
        } catch (error) {
            console.error("Failed to parse message:", error);
            return;
        }

        // chat_time 설정 없이 그대로 데이터를 Spring Boot 서버로 전송
        const postData = {
            contract_chat_id: parsedMessage.contract_chat_id,
            sender_name: parsedMessage.sender_name,
            content: parsedMessage.content,
            sent_by_member_id: parsedMessage.sent_by_member_id,
            sent_by_biz_member_id: parsedMessage.sent_by_biz_member_id || null,
        };

        try {
            const response = await axios.post('http://localhost:8080/query/chatlogs/insert', postData);
            console.log('Data successfully posted to the server:', response.data);
        } catch (error) {
            console.error('Error posting data to the server:', error);
        }

        const jsonMessage = JSON.stringify(parsedMessage);
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(jsonMessage);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server is running on ws://localhost:8081');
