"""Verify the rendered nonlinear timing against source and studio transients."""
import json
from pathlib import Path
from importlib.machinery import SourceFileLoader
import numpy as np

r=SourceFileLoader('refine',str(Path(__file__).with_name('audio-refine.py'))).load_module()
a=r.a
WORK=a.ROOT.parent/'theatre-qa/v2-audio-work'

def main():
    mapping=json.loads((a.OUT/'audio-time-map.json').read_text())
    pairs=np.array(mapping['sourceTargetSeconds'])
    lt,lf=r.flux(a.decode(WORK/'live-source-eq.wav'))
    rt,rf=r.flux(a.decode(WORK/'live-retimed.wav'))
    dt,df=r.flux(a.zipdecode('2 Drums.wav'))
    old=json.loads((a.OUT/'audio-refine.json').read_text())
    results=[]
    for center in np.arange(2,32,2):
        source=np.arange(max(.2,center-2),min(pairs[-1,0]-.2,center+2),r.HOP/a.RATE)
        target=np.interp(source,pairs[:,0],pairs[:,1])
        original=np.array([np.interp(source,lt,row) for row in lf])
        rendered=np.array([np.interp(target,rt,row) for row in rf])
        rows=[]
        for shift in np.arange(-.12,.1201,.0025):
            test=np.array([np.interp(target+shift,rt,row) for row in rf])
            studio=np.array([np.interp(r.OFFSET+target+shift,dt,row) for row in df])
            rows.append((shift,float(np.corrcoef(original.ravel(),test.ravel())[0,1]),float(np.corrcoef(rendered.ravel(),studio.ravel())[0,1])))
        render_match=max(rows,key=lambda x:x[1])
        studio_match=max(rows,key=lambda x:x[2])
        previous=next(row for row in old['localWindows'] if row['liveCenter']==center)
        results.append({'sourceCenterSeconds':float(center),'renderedCenterSeconds':float(np.interp(center,pairs[:,0],pairs[:,1])),
            'sourceToRenderedResidualSeconds':round(float(render_match[0]),4),'sourceToRenderedCorrelation':render_match[1],
            'oldStudioResidualSeconds':previous['rhythmBestShift'],'newStudioResidualSeconds':round(float(studio_match[0]),4),'studioTransientCorrelation':studio_match[2]})
    report={'method':'Four-second windows; bounded multiband spectral-flux correlation. 128-sample analysis hop at 11025Hz, 2.5ms interpolation search. Correlation estimates do not prove sample-accurate or perceptual note alignment.','windows':results}
    for key in ['sourceToRenderedResidualSeconds','oldStudioResidualSeconds','newStudioResidualSeconds']:
        values=np.array([row[key] for row in results])
        report[key+'Rms']=float(np.sqrt(np.mean(values**2)))
        report[key+'MedianAbsolute']=float(np.median(np.abs(values)))
    # Independently locate the actual mixed recordings in the delivered MP3.
    # This catches a gross duplicated excerpt offset even if metadata is correct.
    current=json.loads((a.OUT/'assets/v2/sync.json').read_text())
    delivered=a.decode(a.OUT/'assets/v2/soundtrack.mp3')
    placements={}
    for name,filename,lo,hi,expected in [('practice','practice-retimed.wav',1,10,current['practice']['showStartSeconds']),('live','live-retimed.wav',2,29,current['liveShowStartSeconds'])]:
        source=a.decode(WORK/filename)
        query=source[round(lo*a.RATE):round(hi*a.RATE)].copy()
        query-=query.mean()
        correlation=r.sig.correlate(delivered,query,mode='valid',method='fft')
        index=int(np.argmax(correlation))
        detected=index/a.RATE-lo
        score=float(correlation[index]/np.sqrt(np.sum(query**2)*np.sum(delivered[index:index+len(query)]**2)))
        placements[name]={'expectedShowStartSeconds':expected,'detectedFromDeliveredWaveformSeconds':detected,'differenceSeconds':detected-expected,'correlation':score}
    report['deliveredRecordingPlacement']={'analysisSampleRate':a.RATE,'method':'Raw waveform cross-correlation of the rendered source recording against the whole delivered soundtrack; not inferred from cue metadata. Resolution is one analysis sample, about90.7 microseconds.','recordings':placements}
    report['limitations']='The local windows helped choose the map, so before/after residuals are fitting diagnostics rather than an independent test. Interpolated shifts are finer than the 11.61ms analysis hop. Neither residual proves exact guitar-note alignment or a successful human listening review.'
    (a.OUT/'audio-validation.json').write_text(json.dumps(report,indent=2)+'\n')
    sync_path=a.OUT/'assets/v2/sync.json'
    sync=json.loads(sync_path.read_text())
    sync['localTimingValidation']={key:value for key,value in report.items() if key!='windows'}
    sync['localTimingValidation']['report']='/theatre/audio-validation.json'
    sync_path.write_text(json.dumps(sync,indent=2)+'\n')
    print(json.dumps(report,indent=2))

if __name__=='__main__':main()
