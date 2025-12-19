const { Response, Request } = require('express');

  res;
  userId?: string;
};

export 
  message;
  data?: any;
  targetUserId?: string;
};

class NotificationService {
  private clients = [];

  subscribe(req, res, userId?) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const client = { id, res, userId };
    this.clients.push(client);

    // Send initial heartbeat
    this.send(client.res, { type: 'health', message: 'connected' });

    req.on('close', () => {
      this.clients = this.clients.filter((c) => c.id !== id);
    });
  }

  notify(event) {
    const payload = `data: ${JSON.stringify(event)}\n\n`;
    const targets = event.targetUserId
      ? this.clients.filter((c) => c.userId === event.targetUserId)
      : this.clients;
    targets.forEach((c) => c.res.write(payload));
  }

  private send(res, event) {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  }
}

const notifications = new NotificationService();
