import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressPeerServer } from 'peer';
import { PeerService } from './peer/peer.service';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(json({ limit: '500mb' }));
  app.use(urlencoded({ extended: true, limit: '500mb' }));

  const server = await app.listen(process.env.PORT ?? 5050);
  const peerService = app.get(PeerService);

  //@typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const peerServer = ExpressPeerServer(server, {
    path: '/video-server',
    allow_discovery: true,
    port: 5050,
  });

  peerServer.on('connection', (client) => {
    console.log('Peer connected:', client.getId());
  });

  peerServer.on('disconnect', (client) => {
    const peerId = client.getId();
    console.log('Peer disconnected:', peerId);

    peerService.removePeer(peerId);
  });

  app.use(peerServer);
}
void bootstrap();
