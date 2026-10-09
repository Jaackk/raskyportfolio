"""Render the matched seated-practice lead-in; original media is preserved."""
import hashlib
import json
import shutil
import subprocess
from pathlib import Path
import imageio_ffmpeg

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'theatre/assets/v2'
SOURCE=OUT/'originals/practice-DUD_MWUDRK9.mp4'
WORK=ROOT.parent/'theatre-qa/v2-audio-work'
STUDIO_OFFSET=182.45079365079366
RATIO=.917
SHOW_START=49.0406
SHOW_END=60.1742
MASTER_EXCERPT_START=135.1401

def run():
    ff=imageio_ffmpeg.get_ffmpeg_exe()
    duration=SHOW_END-SHOW_START
    source_in=(MASTER_EXCERPT_START+SHOW_START-STUDIO_OFFSET)/RATIO
    source_out=(MASTER_EXCERPT_START+SHOW_END-STUDIO_OFFSET)/RATIO
    backup=WORK/'before-listener-fix'
    backup.mkdir(parents=True,exist_ok=True)
    for name in ['practice-guitar.mp4','practice-guitar-poster.jpg']:
        if (OUT/name).exists() and not (backup/name).exists():
            shutil.copy2(OUT/name,backup/name)
    transform=f'trim=start={source_in:.12f}:end={source_out:.12f},setpts={RATIO}*(PTS-{source_in:.12f}/TB),fps=30:start_time=0'
    subprocess.run([ff,'-hide_banner','-loglevel','error','-i',str(SOURCE),'-an','-vf',transform,'-t',str(duration),'-c:v','libx264','-crf','22','-preset','medium','-pix_fmt','yuv420p','-movflags','+faststart','-y',str(OUT/'practice-guitar.mp4')],check=True)
    subprocess.run([ff,'-hide_banner','-loglevel','error','-ss','5.5','-i',str(SOURCE),'-frames:v','1','-q:v','3','-y',str(OUT/'practice-guitar-poster.jpg')],check=True)
    reader=imageio_ffmpeg.read_frames(str(OUT/'practice-guitar.mp4'))
    meta=next(reader)
    reader.close()
    frame_count,_=imageio_ffmpeg.count_frames_and_secs(str(OUT/'practice-guitar.mp4'))
    analysis=json.loads((ROOT/'theatre/audio-practice-match.json').read_text())
    record={'schemaVersion':1,'source':str(SOURCE.relative_to(ROOT)).replace('\\','/'),'publicSource':'https://www.instagram.com/p/DUD_MWUDRK9/','sourceOwner':'@raskyjack; user confirmed ownership of all music rights.','sourceCaption':'Gorilla tape for the finger','sourceInSeconds':source_in,'sourceOutSeconds':source_out,'showStartSeconds':SHOW_START,'showEndSeconds':SHOW_END,'nominalDurationSeconds':duration,'encodedDurationSeconds':meta['duration'],'frameRate':meta['fps'],'size':list(meta['size']),'durationRatio':RATIO,'playbackSpeed':1/RATIO,'studioMatchOffsetSeconds':STUDIO_OFFSET,'sound':'No audio stream in video; the existing continuous Smoke and Glass remix soundtrack plays beneath it.','framing':'Entire native landscape frame; no mobile crop, invented detail or optical flow.','evidence':'Constrained same-song pitch-spectrum match: first16s cosine0.580 to master and0.443 to guitar stem at duration ratio0.917. Full51s practice independently matches the same passage/rate.','localChecks':analysis['introLocalWindows'],'limitations':'Signal-supported correspondence, not a listening assessment or proof of every performed note. Interpolated local residual estimates0–5ms are below the11.61ms analysis hop. Normal30fps source/output sampling adds frame quantisation.','posterSourceSeconds':5.5}
    record['files']={name:{'bytes':(OUT/name).stat().st_size,'sha256':hashlib.sha256((OUT/name).read_bytes()).hexdigest()} for name in ['practice-guitar.mp4','practice-guitar-poster.jpg']}
    record['frameCount']=frame_count
    record['encodedDurationSeconds']=frame_count/meta['fps']
    record['sound']='Video itself has no audio stream. The single premixed soundtrack includes the actual displayed practice recording quietly beneath supplied studio accompaniment and a restrained studio guitar stem; see sync.json for current levels.'
    (OUT/'practice-sync.json').write_text(json.dumps(record,indent=2)+'\n')
    print(json.dumps(record,indent=2))

if __name__=='__main__':run()
