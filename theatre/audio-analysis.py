"""Reproducible local-only audio correspondence audit. Does not modify sources."""
import io
import json
import os
import zipfile
from pathlib import Path
import subprocess

import imageio_ffmpeg
import numpy as np
import scipy.signal
import soundfile as sf
import librosa

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(r'C:\Users\Jacko\Desktop\raskymusic\Illusions\Smoke and Glass REMIX')
OUT = ROOT / 'theatre'
RATE = 11025
HOP = 256

def decode(path):
    p = subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(), '-hide_banner', '-loglevel', 'error', '-i', str(path), '-vn', '-ac', '1', '-ar', str(RATE), '-f', 'f32le', 'pipe:1'], capture_output=True, check=True)
    return np.frombuffer(p.stdout, dtype=np.float32)

def zipdecode(name):
    with zipfile.ZipFile(SOURCE / 'STEMS' / 'Smoke and glass Stems.zip') as z:
        y, sr = sf.read(io.BytesIO(z.read(name)), dtype='float32')
    if y.ndim > 1:
        y = y.mean(axis=1)
    return librosa.resample(y, orig_sr=sr, target_sr=RATE)

def features(y):
    # Harmonic pitch-class features let separate live/studio performances be compared.
    h = librosa.effects.harmonic(y)
    c = librosa.feature.chroma_cqt(y=h, sr=RATE, hop_length=HOP, bins_per_octave=24)
    return librosa.util.normalize(c, axis=0)

def candidates(a, b, label):
    # Positive cosine cost; a is the complete live query and b the studio timeline.
    d, wp = librosa.sequence.dtw(X=a, Y=b, metric='cosine', subseq=True,
        step_sizes_sigma=np.array([[1,1],[1,2],[2,1]]), weights_add=np.array([0,0.05,0.05]))
    final = d[-1,:] / a.shape[1]
    ends = scipy.signal.find_peaks(-final, distance=int(12*RATE/HOP))[0]
    ends = sorted(ends, key=lambda i: final[i])[:6]
    results = []
    for end in ends:
        results.append({'endCandidateSeconds':float(end*HOP/RATE),'normalizedCost':float(final[end])})
    path = wp[::-1]
    x = path[:,0]*HOP/RATE
    z = path[:,1]*HOP/RATE
    slope, intercept = np.polyfit(x,z,1)
    residual = z - (slope*x + intercept)
    result={'target':label,'bestStart':float(z[0]),'bestEnd':float(z[-1]),
        'globalRateRatio':float(slope),'globalOffset':float(intercept),
        'alignmentResidualSecondsRms':float(np.sqrt(np.mean(residual**2))),
        'bestNormalizedCost':float(np.min(final)),'otherCandidates':results,
        'anchors':[{'live':round(float(t),3),'studio':round(float(z[np.argmin(np.abs(x-t))]),3)} for t in np.arange(0,x[-1]+0.01,2)]}
    print(json.dumps(result), flush=True)
    return result

def energy(y):
    block=RATE
    rms=np.array([np.sqrt(np.mean(y[i:i+block]**2)) for i in range(0,len(y),block)])
    onset=librosa.onset.onset_strength(y=y,sr=RATE,hop_length=HOP)
    tempo,beats=librosa.beat.beat_track(onset_envelope=onset,sr=RATE,hop_length=HOP,trim=False)
    return {'duration':len(y)/RATE,'tempoEstimateBpm':float(np.asarray(tempo).flatten()[0]),
        'beatSeconds':librosa.frames_to_time(beats,sr=RATE,hop_length=HOP).round(4).tolist(),
        'rmsPerSecond':np.round(rms,5).tolist(),'peak':float(np.max(np.abs(y)))}

def main():
    print('Decoding master, guitar/drum/vocal stems and two live sources',flush=True)
    master=decode(SOURCE/'Smoke and glass.wav')
    guitar=zipdecode('4 Guitar.wav')
    drums=zipdecode('2 Drums.wav')
    vocals=zipdecode('0 Lead Vocals.wav')
    live=decode(ROOT/'music/media/5c155cf3-efaf-4bca-9d71-3bcef8f36d4b.MP4')
    edited=decode(ROOT/'music/media/clip3.mp4')
    result={'auditioned':False,'analysisSampleRate':RATE,'hop':HOP,
        'master':energy(master),'guitarStem':energy(guitar),'drumStem':energy(drums),
        'vocalStem':energy(vocals),'liveSolo':energy(live),'editedLive':energy(edited)}
    print('Feature extraction',flush=True)
    live_c=features(live)
    result['correspondence']=[candidates(live_c,features(guitar),'studio guitar stem'),
        candidates(live_c,features(master),'studio full master'),
        candidates(live_c,features(edited),'local edited live reel')]
    (OUT/'audio-analysis.json').write_text(json.dumps(result,indent=2)+'\n')
    print('Saved theatre/audio-analysis.json',flush=True)

if __name__=='__main__':
    main()
