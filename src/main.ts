import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressPeerServer } from 'peer';
import { PeerService } from './peer/peer.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const server = await app.listen(process.env.PORT ?? 5050);
  const peerService = app.get(PeerService);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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
