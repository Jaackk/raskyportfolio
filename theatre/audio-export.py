"""Build the V2 soundtrack and matching picture from preserved user originals.

The performance is audible from its own recording; it is not mimed to the
studio guitar stem. Analysis is objective signal review, not an aural audition.
"""
import io
import json
import hashlib
import subprocess
import sys
import zipfile
from pathlib import Path

import numpy as np
import soundfile as sf
import imageio_ffmpeg
from scipy.interpolate import PchipInterpolator

ROOT=Path(__file__).resolve().parents[1]
SOURCE=Path(r'C:\Users\Jacko\Desktop\raskymusic\Illusions\Smoke and Glass REMIX')
LIVE=ROOT/'music/media/5c155cf3-efaf-4bca-9d71-3bcef8f36d4b.MP4'
OUT=ROOT/'theatre/assets/v2'
WORK=ROOT.parent/'theatre-qa/v2-audio-work'
FF=imageio_ffmpeg.get_ffmpeg_exe()
SR=48000
START=135.1401
STOP=248.36
OFFSET=195.3143
RATIO=0.993976
FADE=0.45
BACKING_GAIN=0.60
STUDIO_GUITAR_GAIN=0.18
PRACTICE_STUDIO_START=184.1807
PRACTICE_RATIO=.917
PRACTICE_STUDIO_OFFSET=182.45079365079366
PRACTICE_RELATIVE_DB=-7.0
PRACTICE_CROSSFADE=.4
LIVE_CHAPTER_END=OFFSET-START+32.4506
LIVE_VIDEO_END=OFFSET-START+32.4
STUDIO_LEAD_FADE_SECONDS=3.0
LIVE_AUDIO_EDGE_FADE_SECONDS=.035
OPENING_FADE_SECONDS=.08
RB=WORK/'rubberband/rubberband-4.0.0-gpl-executable-windows/rubberband.exe'

def time_map(source_duration):
    # Local multiband transient matching, checked against guitar pitch spectra.
    # Smooth the four-second-window measurements; do not snap individual notes.
    x=np.array([0,4,8,12,16,20,24,28,30,source_duration])
    correction=np.array([0,0,.010,.058,.0525,.07375,.04875,-.034,-.065,-.065])
    curve=PchipInterpolator(x,correction)
    source=np.r_[np.arange(0,source_duration,.5),source_duration]
    target=source*RATIO+curve(source)
    # Both renderers consume these exact sample-quantised pairs.
    pairs=np.column_stack((np.rint(source*SR),np.rint(target*SR))).astype(np.int64)
    assert np.all(np.diff(pairs,axis=0)>0)
    return pairs

def retime_performance():
    if not RB.exists():
        raise FileNotFoundError('Install the official Rubber Band 4.0.0 Windows CLI in the external QA work folder; see audio-README.md.')
    ff(['-i',LIVE,'-vn','-ar',SR,'-ac','2','-af','highpass=f=120:p=2','-c:a','pcm_f32le','-y',WORK/'live-source-eq.wav'])
    original,sr=sf.read(WORK/'live-source-eq.wav',dtype='float32')
    pairs=time_map(len(original)/sr)
    map_path=WORK/'live-time-map.txt'
    # The offline tool already fixes the first/last frames from --duration.
    # Supplying duplicate endpoint constraints can create a zero-length span.
    map_path.write_text('\n'.join(f'{s} {t}' for s,t in pairs[1:-1])+'\n')
    target_duration=pairs[-1,1]/SR
    subprocess.run([str(RB),'-3','--quiet','--centre-focus','--ignore-clipping','--duration',str(target_duration),'--timemap',str(map_path),str(WORK/'live-source-eq.wav'),str(WORK/'live-retimed.wav')],check=True)
    # Piecewise linear interpolation of precisely the same sample-pair map.
    seconds=pairs.astype(float)/SR
    expression=f'{seconds[-1,1]:.10f}'
    for (s0,t0),(s1,t1) in reversed(list(zip(seconds[:-1],seconds[1:]))):
        slope=(t1-t0)/(s1-s0)
        expression=f'if(lt(T,{s1:.10f}),{t0:.10f}+{slope:.12f}*(T-{s0:.10f}),{expression})'
    script=WORK/'video-time-map.ffilter'
    script.write_text(f"setpts='({expression})/TB',fps=30,tpad=stop_mode=clone:stop_duration=0.12\n")
    ff(['-i',LIVE,'-an','-filter_script:v',script,'-t',target_duration,'-c:v','libx264','-crf','23','-preset','medium','-pix_fmt','yuv420p','-movflags','+faststart','-y',OUT/'guitar-synced.mp4'])
    mapping={'sampleRate':SR,'sourceTargetSamples':pairs.tolist(),'sourceTargetSeconds':seconds.tolist(),'anchorSourceSeconds':[float(v) for v in [0,4,8,12,16,20,24,28,30,len(original)/sr]],'anchorCorrectionSeconds':[0,0,.010,.058,.0525,.07375,.04875,-.034,-.065,-.065],'basis':'Smoothed local multiband-transient correspondence, bounded around the verified original same-song offset. Guitar spectral matches corroborate middle/late direction. No per-note quantisation.','audioRenderer':'Rubber Band4 offline Finer engine, stereo centre focus, explicit source-to-target sample map, pitch unchanged.','videoRenderer':'Exactly the same sample-pair map interpolated piecewise-linearly in FFmpeg setpts; standard30fps delivery.'}
    (ROOT/'theatre/audio-time-map.json').write_text(json.dumps(mapping,indent=2)+'\n')
    return mapping

def ff(args):
    subprocess.run([FF,'-hide_banner','-loglevel','error',*map(str,args)],check=True)


def retime_practice():
    source=OUT/'originals/practice-DUD_MWUDRK9.mp4'
    ff(['-i',source,'-vn','-ar',SR,'-ac','2','-af','highpass=f=120:p=2','-c:a','pcm_f32le','-y',WORK/'practice-source-eq.wav'])
    audio,sr=sf.read(WORK/'practice-source-eq.wav',dtype='float32')
    source_in=(PRACTICE_STUDIO_START-PRACTICE_STUDIO_OFFSET)/PRACTICE_RATIO
    # A short source handle extends past the picture cut for the audio dissolve.
    duration=OFFSET-PRACTICE_STUDIO_START+PRACTICE_CROSSFADE
    source_out=source_in+duration/PRACTICE_RATIO
    excerpt=audio[round(source_in*SR):round(source_out*SR)]
    sf.write(WORK/'practice-source-excerpt.wav',excerpt,SR,subtype='FLOAT')
    target_duration=round(duration*SR)/SR
    subprocess.run([str(RB),'-3','--quiet','--centre-focus','--ignore-clipping','--duration',str(target_duration),str(WORK/'practice-source-excerpt.wav'),str(WORK/'practice-retimed.wav')],check=True)
    rendered,_=sf.read(WORK/'practice-retimed.wav',dtype='float32')
    return rendered,{'sourceInSeconds':source_in,'visibleSourceOutSeconds':(OFFSET-PRACTICE_STUDIO_OFFSET)/PRACTICE_RATIO,'audioSourceOutIncludingCrossfadeSeconds':source_out,'durationRatio':PRACTICE_RATIO,'showStartSeconds':PRACTICE_STUDIO_START-START,'showPictureEndSeconds':OFFSET-START,'audioHandleSeconds':PRACTICE_CROSSFADE,'sound':'Actual unseparated practice recording, with its original backing if present, pitch-preserved and retimed by the same constant correspondence as the picture. No neural separation or replaced note.'}

def main():
    OUT.mkdir(parents=True,exist_ok=True)
    WORK.mkdir(parents=True,exist_ok=True)
    master,sr=sf.read(SOURCE/'Smoke and glass.wav',dtype='float32')
    assert sr==SR
    start=round(START*SR);stop=min(len(master),round(STOP*SR))
    mix=master[start:stop].copy()
    # Sum stems directly: their combined waveform is not identical to the master.
    backing=np.zeros_like(mix)
    with zipfile.ZipFile(SOURCE/'STEMS/Smoke and glass Stems.zip') as z:
        for name in ['2 Drums.wav','3 Bass.wav','5 Keyboard.wav','6 Percussion.wav','7 Synth.wav','8 Other.wav']:
            y,r=sf.read(io.BytesIO(z.read(name)),dtype='float32')
            assert r==SR
            backing+=y[start:stop]
        guitar_stem,r=sf.read(io.BytesIO(z.read('4 Guitar.wav')),dtype='float32')
        assert r==SR
        guitar_stem=guitar_stem[start:stop]
    if '--audio-only' in sys.argv:
        mapping=json.loads((ROOT/'theatre/audio-time-map.json').read_text())
        if not (WORK/'live-retimed.wav').exists():
            raise FileNotFoundError('Existing retimed live WAV required for --audio-only; run a full export first.')
    else:
        mapping=retime_performance()
    live,r=sf.read(WORK/'live-retimed.wav',dtype='float32')
    original_live_rms=float(np.sqrt(np.mean(live**2)))
    # The full performance is preserved. Gentle high-pass EQ reduces competing
    # live kick/bass; there is no neural isolation or generated/replaced note.
    live_gain=min(2.0,0.14/max(original_live_rms,1e-6))
    backing_gain=BACKING_GAIN
    position=round((OFFSET-START)*SR)
    n=min(len(live),len(mix)-position)
    practice,practice_info=retime_practice()
    practice_rms=float(np.sqrt(np.mean(practice**2)))
    practice_target=.14*10**(PRACTICE_RELATIVE_DB/20)
    practice_gain=practice_target/max(practice_rms,1e-8)
    practice_position=round((PRACTICE_STUDIO_START-START)*SR)
    # Return immediately after the actual live source ends, within the final
    # video frame; no studio lead competes with the end of the live phrase.
    master_return_start=OFFSET-START+n/SR
    combined_n=round((master_return_start+FADE)*SR)-practice_position
    live_relative_position=position-practice_position
    recordings=np.zeros((combined_n,2),dtype=np.float32)
    practice_n=min(len(practice),combined_n)
    recordings[:practice_n]=practice[:practice_n]*practice_gain
    overlap=min(round(PRACTICE_CROSSFADE*SR),practice_n-live_relative_position,n)
    blend=.5-.5*np.cos(np.linspace(0,np.pi,overlap))
    recordings[live_relative_position:live_relative_position+overlap]*=(1-blend[:,None])
    live_weights=np.ones(n,dtype=np.float32)
    live_weights[:overlap]=blend
    # Preserve the full final phrase; only soften the final35ms file edge.
    live_edge=round(LIVE_AUDIO_EDGE_FADE_SECONDS*SR)
    live_weights[-live_edge:]*=.5+.5*np.cos(np.linspace(0,np.pi,live_edge))
    recordings[live_relative_position:live_relative_position+n]+=live[:n]*live_gain*live_weights[:,None]
    section=slice(practice_position,practice_position+combined_n)
    show_times=(np.arange(combined_n)+practice_position)/SR
    fade_phase=np.clip((show_times-(LIVE_VIDEO_END-STUDIO_LEAD_FADE_SECONDS))/STUDIO_LEAD_FADE_SECONDS,0,1)
    studio_lead_envelope=.5+.5*np.cos(np.pi*fade_phase)
    replacement=recordings+backing[section]*backing_gain+guitar_stem[section]*(STUDIO_GUITAR_GAIN*studio_lead_envelope[:,None])
    # Common accompaniment continues through the tail. The master returns once
    # the actual source recording finishes, without waiting for a visual hold.
    envelope=np.ones(combined_n,dtype=np.float32)
    entrance=round(PRACTICE_CROSSFADE*SR);exit_frames=round(FADE*SR)
    envelope[:entrance]=.5-.5*np.cos(np.linspace(0,np.pi,entrance))
    envelope[-exit_frames:]=.5+.5*np.cos(np.linspace(0,np.pi,exit_frames))
    mix[section]=mix[section]*(1-envelope[:,None])+replacement*envelope[:,None]
    # Begin within a verified vocal pause; finish at the source's real tail.
    opening=round(OPENING_FADE_SECONDS*SR)
    mix[:opening]*=(.5-.5*np.cos(np.linspace(0,np.pi,opening)))[:,None]
    ending=round(.32*SR)
    mix[-ending:]*=np.linspace(1,0,ending)[:,None]
    sf.write(WORK/'premix.wav',mix,SR,subtype='FLOAT')
    ff(['-i',WORK/'premix.wav','-af','loudnorm=I=-16:TP=-1.5:LRA=11','-ar','44100','-c:a','libmp3lame','-b:a','192k','-write_xing','1','-y',OUT/'soundtrack.mp3'])
    ff(['-ss','2.5','-i',LIVE,'-frames:v','1','-q:v','3','-y',OUT/'guitar-poster.jpg'])
    ff(['-i',OUT/'soundtrack.mp3','-ar',SR,'-ac','2','-c:a','pcm_f32le','-y',WORK/'delivered.wav'])
    delivered,_=sf.read(WORK/'delivered.wav',dtype='float32')
    mono=np.mean(delivered,axis=1)
    hop=SR//20
    rms=[float(np.sqrt(np.mean(mono[i:i+hop]**2))) for i in range(0,len(mono),hop)]
    peak=[float(np.max(np.abs(mono[i:i+hop]))) for i in range(0,len(mono),hop)]
    analysis=json.loads((ROOT/'theatre/audio-analysis.json').read_text())
    beats=[round(t-START,4) for t in analysis['drumStem']['beatSeconds'] if START<=t<STOP]
    waveform={'sampleRateHz':20,'source':'Actual decoded delivered soundtrack, mono RMS and peak per 50 ms. No synthetic beat values.','durationSeconds':len(delivered)/SR,'rms':rms,'peak':peak,'maxRms':max(rms),'beatSeconds':beats,'beatSource':'Onset/beat analysis of supplied remix drum stem; mapped by source excerpt offset. Live timing now uses the common nonlinear map in audio-time-map.json.'}
    (OUT/'waveform.json').write_text(json.dumps(waveform,separators=(',',':'))+'\n')
    info={'schemaVersion':1,'auditioned':False,'durationSeconds':len(delivered)/SR,'sourceTrack':'Smoke and glass.wav','sourceStartSeconds':START,'sourceEndSeconds':STOP,'sourceTrackDurationSeconds':len(master)/SR,'liveSource':str(LIVE.relative_to(ROOT)).replace('\\','/'),'liveSourceInSeconds':0,'liveSourceOutSeconds':32.64725623582766,'liveStudioOffsetSeconds':OFFSET,'liveShowStartSeconds':OFFSET-START,'liveShowEndSeconds':OFFSET-START+len(live)/SR,'liveVideoDurationRatio':RATIO,'liveAudioTempoFactor':1/RATIO,'liveBeatFitRmsSeconds':0.0469,'liveBeatCount':51,'liveRmsBeforeGain':original_live_rms,'liveGain':live_gain,'backingGain':backing_gain,'crossfadeSeconds':FADE,'normalization':'FFmpeg loudnorm I=-16 LUFS, true peak=-1.5dBTP, LRA=11; MP3 192kbps stereo44.1kHz.','actualDecodedPeak':float(np.max(np.abs(delivered))),'soundtrackChanges':'One continuous final-song excerpt. During the full live passage, the master fades to the actual pitch-preserved live recording plus quiet accompaniment from supplied stems excluding guitar and vocals, then returns. No internal song splice, note replacement, phrase truncation or variable tempo jitter.','confidence':'Signal-supported same-song and beat correspondence. Neither track was heard by the agent, and perfect note equivalence or perceptual mix quality is not claimed. Source audio and source video are retimed together by one constant factor.','beatSeconds':beats}
    info.update({'schemaVersion':2,'revision':'listener-feedback-local-sync-and-backing','previousVersionAuditionedByUser':True,'liveVideoDurationRatio':None,'liveAudioTempoFactor':None,'previousConstantBeatFitRmsSeconds':info.pop('liveBeatFitRmsSeconds'),'timeMap':'/theatre/audio-time-map.json','sourceTargetSeconds':mapping['sourceTargetSeconds'],'backingGainChangeDb':float(20*np.log10(backing_gain/.24)),'liveEq':'120Hz second-order high-pass to reduce room kick/bass overlap; no source separation or note fabrication.','soundtrackChanges':'One continuous final-song excerpt. Actual live solo and picture share an explicit nonlinear source-to-target sample map. During the live passage, source vocals/studio guitar fade out; the complete live recording and nonguitar/nonvocal studio accompaniment replace them. Accompaniment is raised7.96dB relative to the previous mix. No interior song splice or replaced note.','confidence':'Same-song correspondence plus constrained local transient and guitar pitch-spectrum checks. The user heard drift in the prior version; the agent cannot audition audio and does not claim perfect perceptual alignment. Audio and picture consume the same explicit sample map.'})
    info['soundtrackChanges']=info['soundtrackChanges'].replace('raised7.96dB','raised 7.96 dB')
    info['liveSourceOutSeconds']=mapping['sourceTargetSeconds'][-1][0]
    info['previousConstantDetectedBeatCount']=info.pop('liveBeatCount')
    probe=imageio_ffmpeg.read_frames(str(OUT/'guitar-synced.mp4'))
    metadata=next(probe)
    probe.close()
    info['liveVideoEncodedDurationSeconds']=metadata['duration']
    info['liveVideoFramesPerSecond']=metadata['fps']
    pairs=np.array(mapping['sourceTargetSeconds'])
    speed=np.diff(pairs[:,0])/np.diff(pairs[:,1])
    info['livePlaybackSpeedRange']=[float(speed.min()),float(speed.max())]
    info.update({'schemaVersion':3,'revision':'audible-practice-studio-guitar-and-longer-opening','studioGuitarGain':STUDIO_GUITAR_GAIN,'practiceRecordingRmsBeforeGain':practice_rms,'practiceRecordingGain':practice_gain,'practiceRecordingTargetRms':practice_target,'practiceRecordingRelativeToLiveDb':PRACTICE_RELATIVE_DB,'practiceToLiveCrossfadeSeconds':PRACTICE_CROSSFADE,'practice':practice_info,'soundtrackChanges':'One continuous final-song excerpt beginning at a quiet detected beat. The actual practice recording plays 7 dB below the main live recording target level; both retain their original room/backing sound. A 0.4-second dissolve brings in the actual live performance. Nonguitar/nonvocal studio accompaniment remains at gain0.60. The supplied studio guitar stem is deliberately audible at gain0.38 beneath both actual recordings, as requested by the user. The main live audio and picture share the exact nonlinear source-to-target sample map. The master returns over0.65seconds after the live passage.','confidence':'Strong same-song audio correspondence and frame-level verification of the encoded practice mapping. The user reported the studio-only practice mix looked out of time; the revised mix now includes the sound of the actual displayed practice take. Neither hand-motion analysis nor signal matching proves perfect per-note visual sync, and the agent cannot audition audio.'})
    live_body=slice(position+round(.8*SR),position+n-round(.8*SR))
    body_lead_gain=STUDIO_GUITAR_GAIN*studio_lead_envelope[live_body.start-practice_position:live_body.stop-practice_position]
    info['measuredLiveBodyPremixRms']={'nonguitarStudioAccompaniment':float(np.sqrt(np.mean((backing[live_body]*BACKING_GAIN)**2))),'studioGuitar':float(np.sqrt(np.mean((guitar_stem[live_body]*body_lead_gain[:,None])**2))),'actualLiveTarget':.14,'actualPracticeTarget':practice_target}
    info['schemaVersion']=6
    info['revision']='raskys-opening-and-prompt-studio-return'
    info['soundtrackChanges']=f'One continuous final-song excerpt beginning at a quiet detected beat. Actual practice recording target is {PRACTICE_RELATIVE_DB:g} dB relative to the main live recording target; both retain their original backing/room sound. A {PRACTICE_CROSSFADE:g}-second cosine dissolve brings in the actual live performance. Nonguitar/nonvocal studio accompaniment remains at gain {BACKING_GAIN:.2f}. The supplied studio guitar stem is subtle at gain {STUDIO_GUITAR_GAIN:.2f}, fading to zero over the last {STUDIO_LEAD_FADE_SECONDS:g} seconds of the main live video. Actual live sound remains through its complete source duration, with only a {LIVE_AUDIO_EDGE_FADE_SECONDS:g}-second file-edge fade. The full master returns smoothly over {FADE:g} seconds immediately after the actual live recording ends, within its final video frame. Nonguitar accompaniment continues throughout the handoff.'
    info['studioLeadExit']={'showStartSeconds':LIVE_VIDEO_END-STUDIO_LEAD_FADE_SECONDS,'showEndSeconds':LIVE_VIDEO_END,'startGain':STUDIO_GUITAR_GAIN,'endGain':0,'curve':'half-cosine smooth fade, zero-slope endpoints'}
    info['masterReturn']={'showStartSeconds':master_return_start,'showEndSeconds':master_return_start+FADE,'curve':'half-cosine crossfade, zero-slope endpoints','underlay':'Nonguitar/nonvocal stem accompaniment at0.60 continues without a gap.','placement':'Begins only once actual live audio ends, within the final video frame. No additional chapter-hold delay.'}
    info['liveChapterEndSeconds']=LIVE_CHAPTER_END
    info['openingFadeSeconds']=OPENING_FADE_SECONDS
    info['addedOpeningSecondsFromPrevious']=143.0814-START
    info['studioGuitarGainChangeFromPreviousDb']=float(20*np.log10(STUDIO_GUITAR_GAIN/.20))
    info['actualLiveFileEdgeFadeSeconds']=LIVE_AUDIO_EDGE_FADE_SECONDS
    practice_path=OUT/'practice-sync.json'
    practice_sync=json.loads(practice_path.read_text())
    practice_sync.update({'showStartSeconds':PRACTICE_STUDIO_START-START,'showEndSeconds':OFFSET-START,'sound':'Video itself has no audio stream. The single premixed soundtrack includes this actual practice recording at a target level7dB below the main live recording, plus supplied studio accompaniment and a restrained studio guitar stem.','actualRecordingMix':practice_info,'actualRecordingGain':practice_gain})
    practice_path.write_text(json.dumps(practice_sync,indent=2)+'\n')
    info['files']={p.name:{'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in [OUT/'soundtrack.mp3',OUT/'guitar-synced.mp4',OUT/'guitar-poster.jpg',OUT/'waveform.json']}
    (OUT/'sync.json').write_text(json.dumps(info,indent=2)+'\n')
    print(json.dumps(info,indent=2),flush=True)

if __name__=='__main__':main()
