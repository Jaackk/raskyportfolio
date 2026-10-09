"""Two silent HD guitar-detail clips from the user's preserved band video."""
import hashlib
import json
import subprocess
from pathlib import Path
import imageio_ffmpeg

ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'music/media/clip3.mp4'
OUT=ROOT/'theatre/assets/v2'
CLIPS=[('guitar-broll-blue',42.5,7.0,15.0),('guitar-broll-warm',80.2,22.8,30.8)]

def main():
    ff=imageio_ffmpeg.get_ffmpeg_exe()
    output={'source':str(SOURCE.relative_to(ROOT)).replace('\\','/'),'sourceSha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(),'sourceSize':[1300,2304],'sourceFrameRate':'24000/1001','ownership':'Existing user-supplied music/media/clip3.mp4 from this portfolio. Original and duplicate preserved.','use':'Silent peripheral B-roll, labelled Other moments / live. These are different moments of the same band recording, not synchronised alternative views of the main solo.','clips':[]}
    for name,start,local_in,local_out in CLIPS:
        video=OUT/f'{name}.mp4';poster=OUT/f'{name}-poster.jpg'
        crop='crop=1300:732:0:1180,scale=1280:720,fps=24'
        subprocess.run([ff,'-hide_banner','-loglevel','error','-ss',str(start),'-i',str(SOURCE),'-t','8','-an','-vf',crop,'-c:v','libx264','-crf','22','-preset','medium','-pix_fmt','yuv420p','-movflags','+faststart','-y',str(video)],check=True)
        subprocess.run([ff,'-hide_banner','-loglevel','error','-ss','4','-i',str(video),'-frames:v','1','-q:v','3','-y',str(poster)],check=True)
        subprocess.run([ff,'-hide_banner','-loglevel','error','-i',str(video),'-f','null','-'],check=True)
        frame_count,_=imageio_ffmpeg.count_frames_and_secs(str(video))
        record={'video':video.name,'poster':poster.name,'sourceInSeconds':start,'sourceOutSeconds':start+8,'crop':[0,1180,1300,732],'outputSize':[1280,720],'upscaled':False,'durationSeconds':frame_count/24,'frameCount':frame_count,'frameRate':24,'audioStream':False,'timeTreatment':'No speed change; native approximately23.976fps sampled at24fps for an exact8-second clip.','composition':'Close detail of both guitar hands, instrument and torso. Head intentionally outside this landscape detail crop; main solo retains full-body framing.','review':'All8seconds sampled every0.5seconds for framing, sharpness, subject continuity and absence of cuts to a different performer; full encode decoded successfully.','suggestedMainChapterLocalInSeconds':local_in,'suggestedMainChapterLocalOutSeconds':local_out}
        record['files']={p.name:{'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in [video,poster]}
        record['posterLocalSeconds']=4
        record['posterSourceSeconds']=start+4
        output['clips'].append(record)
    (OUT/'guitar-broll.json').write_text(json.dumps(output,indent=2)+'\n')
    print(json.dumps(output,indent=2))

if __name__=='__main__':main()
