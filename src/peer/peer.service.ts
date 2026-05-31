import { Injectable } from '@nestjs/common';

interface PeerConnection {
  peerId: string;
  userId: number;
  userType: 'doctor' | 'patient';
  appointmentId: number;
  connectedAt: Date;
}

@Injectable()
export class PeerService {
  private connections: Map<string, PeerConnection> = new Map();

  // Register a peer connection
  registerPeer(
    peerId: string,
    userId: number,
    userType: 'doctor' | 'patient',
    appointmentId: number,
  ): PeerConnection {
    const connection: PeerConnection = {
      peerId,
      userId,
      userType,
      appointmentId,
      connectedAt: new Date(),
    };

    this.connections.set(peerId, connection);
    console.log(
      `Peer registered: ${peerId} (${userType} - Appointment ${appointmentId})`,
    );

    return connection;
  }

  // Get the other user's peer ID in the same appointment
  getOtherUserPeerId(
    appointmentId: number,
    currentUserType: 'doctor' | 'patient',
  ): string | null {
    const otherUserType = currentUserType === 'doctor' ? 'patient' : 'doctor';

    for (const [peerId, connection] of this.connections.entries()) {
      if (
        connection.appointmentId === appointmentId &&
        connection.userType === otherUserType
      ) {
        return peerId;
      }
    }

    return null;
  }

  // Check if both users are connected
  areUsersConnected(appointmentId: number): boolean {
    const connections = Array.from(this.connections.values()).filter(
      (c) => c.appointmentId === appointmentId,
    );

    if (connections.length < 2) return false;

    const hasDoctor = connections.some((c) => c.userType === 'doctor');
    const hasPatient = connections.some((c) => c.userType === 'patient');

    return hasDoctor && hasPatient;
  }

  // Get connection status for an appointment
  getConnectionStatus(appointmentId: number): {
    doctorConnected: boolean;
    patientConnected: boolean;
    doctorPeerId?: string;
    patientPeerId?: string;
  } {
    const connections = Array.from(this.connections.values()).filter(
      (c) => c.appointmentId === appointmentId,
    );

    const doctorConnection = connections.find((c) => c.userType === 'doctor');
    const patientConnection = connections.find((c) => c.userType === 'patient');

    return {
      doctorConnected: !!doctorConnection,
      patientConnected: !!patientConnection,
      doctorPeerId: doctorConnection?.peerId,
      patientPeerId: patientConnection?.peerId,
    };
  }

  // Remove peer connection
  removePeer(peerId: string): void {
    const connection = this.connections.get(peerId);
    if (connection) {
      console.log(
        `Peer disconnected: ${peerId} (${connection.userType} - Appointment ${connection.appointmentId})`,
      );
      this.connections.delete(peerId);
    }
  }

  // Get all peers for an appointment
  getAppointmentPeers(appointmentId: number): PeerConnection[] {
    return Array.from(this.connections.values()).filter(
      (c) => c.appointmentId === appointmentId,
    );
  }

  // Check if peer is registered
  isPeerConnected(peerId: string): boolean {
    return this.connections.has(peerId);
  }
}
