'use client';
// One designated offerer prevents simultaneous-offer collisions. ICE is queued
// until a remote description exists; media senders can switch to screen sharing.
export class ClassroomRTC {
 peers=new Map<string,RTCPeerConnection>();
 pending=new Map<string,RTCIceCandidateInit[]>();
 video:MediaStreamTrack|null=null;
 constructor(public id:string,public stream:MediaStream,public iceServers:RTCIceServer[],public send:(target:string,payload:unknown)=>Promise<void>,public onStream:(id:string,stream:MediaStream)=>void,public onState:(id:string,state:string)=>void){this.video=stream.getVideoTracks()[0]||null}
 ensure(id:string){let pc=this.peers.get(id);if(pc)return pc;pc=new RTCPeerConnection({iceServers:this.iceServers});this.peers.set(id,pc);const current=pc;
 current.addTransceiver(this.stream.getAudioTracks()[0]||'audio',{direction:'sendrecv',streams:[this.stream]});current.addTransceiver(this.video||'video',{direction:'sendrecv',streams:[this.stream]});
 current.ontrack=e=>{const stream=new MediaStream();for(const t of current.getReceivers().map(r=>r.track))stream.addTrack(t);this.onStream(id,e.streams[0]||stream)};
 current.onicecandidate=e=>{if(e.candidate)void this.send(id,{candidate:e.candidate.toJSON()}).catch(()=>this.onState(id,'signaling-error'))};
 current.onconnectionstatechange=()=>this.onState(id,current.connectionState);return current;
 }
 async offer(id:string){const pc=this.ensure(id);if(this.id>id)return;await pc.setLocalDescription(await pc.createOffer());await this.send(id,{description:pc.localDescription?.toJSON()})}
 async receive(id:string,payload:{description?:RTCSessionDescriptionInit;candidate?:RTCIceCandidateInit}){const pc=this.ensure(id);if(payload.description){await pc.setRemoteDescription(payload.description);for(const candidate of this.pending.get(id)||[])await pc.addIceCandidate(candidate);this.pending.delete(id);if(payload.description.type==='offer'){await pc.setLocalDescription(await pc.createAnswer());await this.send(id,{description:pc.localDescription?.toJSON()})}}else if(payload.candidate){if(pc.remoteDescription)await pc.addIceCandidate(payload.candidate);else this.pending.set(id,[...(this.pending.get(id)||[]),payload.candidate])}}
 async replaceVideo(track:MediaStreamTrack|null){this.video=track;await Promise.all([...this.peers.values()].map(pc=>pc.getSenders()[1].replaceTrack(track)))}
 remove(id:string){this.peers.get(id)?.close();this.peers.delete(id);this.pending.delete(id)}
 close(){for(const id of this.peers.keys())this.remove(id)}
}
