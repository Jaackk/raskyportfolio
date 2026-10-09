"""Constrained correspondence checks; similarity is evidence, not proof of sync."""
import json
from pathlib import Path
import numpy as np
import scipy.signal
import scipy.ndimage
import librosa
from importlib.machinery import SourceFileLoader

a=SourceFileLoader('audit',str(Path(__file__).with_name('audio-analysis.py'))).load_module()
RATE=a.RATE
HOP=512

def feat(y):
    q=np.abs(librosa.cqt(y=y,sr=RATE,hop_length=HOP,fmin=librosa.note_to_hz('C3'),n_bins=60,bins_per_octave=12))
    q=np.log1p(q*12)
    q-=np.mean(q,axis=0,keepdims=True)
    q-=np.mean(q,axis=1,keepdims=True)
    q/=np.maximum(np.linalg.norm(q,axis=0,keepdims=True),1e-8)
    return q

def linear_match(query,target,rates):
    results=[]
    for rate in rates:
        n=round(query.shape[1]*rate)
        if n>=target.shape[1]:continue
        q=scipy.signal.resample(query,n,axis=1)
        # sum frame-wise dot-products, comparable after fixed per-frame normalization
        score=sum(scipy.signal.correlate(row, qr,mode='valid',method='fft') for row,qr in zip(target,q))/n
        peaks=scipy.signal.find_peaks(score,distance=round(5*RATE/HOP))[0]
        for p in sorted(peaks,key=lambda i:score[i],reverse=True)[:5]:
            results.append({'studioStart':float(p*HOP/RATE),'rate':float(rate),'cosineSimilarity':float(score[p])})
    return sorted(results,key=lambda x:x['cosineSimilarity'],reverse=True)[:12]

def main():
    print('Decode/features',flush=True)
    target=feat(a.decode(a.SOURCE/'Smoke and glass.wav'))
    guitar=feat(a.zipdecode('4 Guitar.wav'))
    live=feat(a.decode(a.ROOT/'music/media/5c155cf3-efaf-4bca-9d71-3bcef8f36d4b.MP4'))
    edited=feat(a.decode(a.ROOT/'music/media/clip3.mp4'))
    rates=np.arange(.90,1.121,.01)
    output={}
    for label,q,t in [('solo-to-master',live,target),('solo-to-guitar',live,guitar),('edited-full-to-master',edited,target),('solo-to-edited',live,edited)]:
        output[label]=linear_match(q,t,rates)
        print(label,json.dumps(output[label][:3]),flush=True)
    for start in range(0,100,10):
        q=edited[:,round(start*RATE/HOP):round((start+12)*RATE/HOP)]
        output[f'edited-{start}-to-master']=linear_match(q,target,rates)
        print(f'edited-{start}-to-master',json.dumps(output[f'edited-{start}-to-master'][:2]),flush=True)
    (a.OUT/'audio-match.json').write_text(json.dumps(output,indent=2)+'\n')

if __name__=='__main__':main()
