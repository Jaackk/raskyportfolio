"""Local timing review after the user's listening feedback; preserves inputs."""
import json
from pathlib import Path
from importlib.machinery import SourceFileLoader
import numpy as np
import scipy.signal as sig
import scipy.ndimage as ndi
import librosa

a=SourceFileLoader('audit',str(Path(__file__).with_name('audio-analysis.py'))).load_module()
SR=a.RATE
HOP=128
OFFSET=195.3143
RATIO=.993976

def spectrum(y):
    q=np.log1p(12*np.abs(librosa.cqt(y=y,sr=SR,hop_length=HOP,fmin=librosa.note_to_hz('C3'),n_bins=60)))
    q-=q.mean(axis=0,keepdims=True)
    q-=q.mean(axis=1,keepdims=True)
    return q/np.maximum(np.linalg.norm(q,axis=0,keepdims=True),1e-6)

def flux(y):
    f,t,z=sig.stft(y,fs=SR,nperseg=512,noverlap=512-HOP,boundary='zeros')
    s=np.abs(z)
    features=[]
    for lo,hi in [(40,180),(180,1000),(1000,5000)]:
        row=np.sum(np.maximum(0,np.diff(s[(f>=lo)&(f<hi)],axis=1,prepend=0)),axis=0)
        row/=np.maximum(ndi.maximum_filter1d(row,size=round(2*SR/HOP)),1e-8)
        features.append(row)
    return t,np.array(features)

def main():
    live=a.decode(a.ROOT/'music/media/5c155cf3-efaf-4bca-9d71-3bcef8f36d4b.MP4')
    guitar=a.zipdecode('4 Guitar.wav')
    drum=a.zipdecode('2 Drums.wav')
    l=spectrum(live);g=spectrum(guitar)
    lt,lf=flux(live);dt,df=flux(drum)
    output={'localWindows':[]}
    for center in np.arange(2,32,2):
        times=np.arange(max(.2,center-2),min(len(live)/SR-.2,center+2),HOP/SR)
        q=np.array([np.interp(times,np.arange(l.shape[1])*HOP/SR,row) for row in l])
        qf=np.array([np.interp(times,lt,row) for row in lf])
        rows=[]
        for shift in np.arange(-.2,.201,.005):
            target=OFFSET+RATIO*times+shift
            ref=np.array([np.interp(target,np.arange(g.shape[1])*HOP/SR,row) for row in g])
            ref_f=np.array([np.interp(target,dt,row) for row in df])
            harmonic=float(np.mean(np.sum(q*ref,axis=0)))
            transient=float(np.corrcoef(qf.ravel(),ref_f.ravel())[0,1])
            rows.append((shift,harmonic,transient))
        note=max(rows,key=lambda x:x[1]);rhythm=max(rows,key=lambda x:x[2])
        result={'liveCenter':float(center),'noteBestShift':round(float(note[0]),4),'noteCosine':note[1],'rhythmBestShift':round(float(rhythm[0]),4),'rhythmCorrelation':rhythm[2]}
        output['localWindows'].append(result)
        print(json.dumps(result),flush=True)
    (a.OUT/'audio-refine.json').write_text(json.dumps(output,indent=2)+'\n')

if __name__=='__main__':main()
