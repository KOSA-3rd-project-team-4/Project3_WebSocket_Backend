const WebSocket = require('ws');

// 포트 8081에서 웹소켓 서버를 설정합니다.
const wss = new WebSocket.Server({ port: 8081 });

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        console.log('Received:', message);

        // 메시지가 버퍼로 전송되었다면, 이를 문자열로 변환
        const messageText = message.toString();

        // 클라이언트로부터 받은 메시지를 JSON으로 파싱
        let parsedMessage;
        try {
            parsedMessage = JSON.parse(messageText);
        } catch (error) {
            console.error("Failed to parse message:", error);
            return;
        }

        // 메시지의 내용에 따라 처리 (예: sender_name, content, 등)
        const jsonMessage = JSON.stringify({
            chat_log_id: parsedMessage.chat_log_id || null, // 고유 ID
            contract_chat_id: parsedMessage.contract_chat_id || 1, // 채팅 계약 ID
            sender_name: parsedMessage.sender_name, // 발신자 이름
            content: parsedMessage.content, // 메시지 내용
            chat_time: new Date().toISOString(), // 현재 시간을 메시지에 포함
            sent_by_member_id: parsedMessage.sent_by_member_id, // 사용자 ID
            sent_by_biz_member_id: parsedMessage.sent_by_biz_member_id || null, // 사업자 ID
        });

        // chat_log_id
        // contract_chat_id
        // sent_by_member_id
        // sent_by_biz_member_id

        // 받은 메시지를 모든 클라이언트에게 브로드캐스트합니다.
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
