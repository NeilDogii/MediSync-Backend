import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PeerService } from './peer.service';

@Controller('peer')
export class PeerController {
  constructor(private readonly peerService: PeerService) {}

  /**
   * Register a peer connection
   * POST /peer/register
   */
  @Post('register')
  registerPeer(
    @Body()
    body: {
      peerId: string;
      appointmentId: number;
      userType: 'doctor' | 'patient';
      userId: number;
    },
  ): any {
    if (!body.peerId || !body.appointmentId || !body.userType || !body.userId) {
      throw new BadRequestException(
        'Missing required fields: peerId, appointmentId, userType, userId',
      );
    }

    if (!['doctor', 'patient'].includes(body.userType)) {
      throw new BadRequestException('userType must be "doctor" or "patient"');
    }

    const connection = this.peerService.registerPeer(
      body.peerId,
      body.userId,
      body.userType,
      body.appointmentId,
    );

    return {
      success: true,
      message: 'Peer registered successfully',
      connection,
    };
  }

  /**
   * Get the other user's peer ID
   * GET /peer/other/:appointmentId/:userType
   */
  @Get('other/:appointmentId/:userType')
  getOtherUserPeerId(
    @Param('appointmentId') appointmentId: string,
    @Param('userType') userType: 'doctor' | 'patient',
  ) {
    const appointmentId_num = parseInt(appointmentId, 10);

    if (isNaN(appointmentId_num)) {
      throw new BadRequestException('Invalid appointmentId');
    }

    if (!['doctor', 'patient'].includes(userType)) {
      throw new BadRequestException('userType must be "doctor" or "patient"');
    }

    const otherPeerId = this.peerService.getOtherUserPeerId(
      appointmentId_num,
      userType,
    );

    return {
      success: true,
      otherPeerId: otherPeerId || null,
      isConnected: !!otherPeerId,
    };
  }

  /**
   * Get connection status for an appointment
   * GET /peer/status/:appointmentId
   */
  @Get('status/:appointmentId')
  getConnectionStatus(@Param('appointmentId') appointmentId: string) {
    const appointmentId_num = parseInt(appointmentId, 10);

    if (isNaN(appointmentId_num)) {
      throw new BadRequestException('Invalid appointmentId');
    }

    const status = this.peerService.getConnectionStatus(appointmentId_num);
    const bothConnected = this.peerService.areUsersConnected(appointmentId_num);

    return {
      success: true,
      ...status,
      bothConnected,
    };
  }

  /**
   * Remove peer connection
   * DELETE /peer/:peerId
   */
  @Delete(':peerId')
  removePeer(@Param('peerId') peerId: string) {
    const isPeerConnected = this.peerService.isPeerConnected(peerId);

    if (!isPeerConnected) {
      throw new NotFoundException('Peer not found');
    }

    this.peerService.removePeer(peerId);

    return {
      success: true,
      message: 'Peer disconnected successfully',
    };
  }

  /**
   * Check if peer is currently connected
   * GET /peer/check/:peerId
   */
  @Get('check/:peerId')
  checkPeerConnection(@Param('peerId') peerId: string) {
    const isConnected = this.peerService.isPeerConnected(peerId);

    return {
      success: true,
      peerId,
      isConnected,
    };
  }
}
